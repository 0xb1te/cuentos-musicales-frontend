import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, MenuResponse } from '../interfaces/menu';
import { HttpRoutes } from './story.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}

  getMenuStructure(): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(
      `${environment.apiBaseUrl}${HttpRoutes.Menu}`
    );
  }
}
