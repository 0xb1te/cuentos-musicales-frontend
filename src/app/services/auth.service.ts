import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );

  constructor(private http: HttpClient, private router: Router) {
    // Check token validity on service instantiation
    this.checkTokenValidity();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    console.log('Attempting to login with credentials:', credentials.username);
    return this.http
      .post<LoginResponse>(
        `${environment.apiBaseUrl}/api/admin/login`,
        credentials
      )
      .pipe(
        tap((response) => {
          console.log('Login successful, received token and expiry:', response);
          this.setToken(response.token, response.expiresIn);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    console.log('Logging out user');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): Observable<boolean> {
    // Check token validity before returning state
    this.checkTokenValidity();
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (!this.hasValidToken()) {
      console.warn('Token exists but is expired, logging out');
      this.logout();
      return null;
    }

    return token;
  }

  private setToken(token: string, expiresIn: number): void {
    const expiryTime = new Date().getTime() + expiresIn;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    console.log(
      'Token saved with expiry time:',
      new Date(expiryTime).toISOString()
    );
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiryTime) {
      return false;
    }

    const now = new Date().getTime();
    const isValid = now < parseInt(expiryTime, 10);
    console.log('Token validity check:', isValid ? 'Valid' : 'Expired');
    return isValid;
  }

  private checkTokenValidity(): void {
    const isValid = this.hasValidToken();
    if (!isValid && this.isAuthenticatedSubject.value) {
      console.log(
        'Token is invalid but state is authenticated, updating state'
      );
      this.isAuthenticatedSubject.next(false);
    }
  }
}
