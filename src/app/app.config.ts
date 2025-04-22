import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Define the auth interceptor as a function
function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Auth interceptor - URL:', req.url);
  console.log('Auth interceptor - Token exists:', !!token);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Auth interceptor - Adding token to request');
    return next(authReq);
  }

  console.log('Auth interceptor - No token available');
  return next(req);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
};
