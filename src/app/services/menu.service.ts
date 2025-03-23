import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, MenuOptionRequest, MenuResponse } from '../interfaces/menu';
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

  // Get all menu items for admin display
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(
      `${environment.apiBaseUrl}/api/admin/menu-items`
    );
  }

  // Add a new menu option
  addMenuOption(menuOption: MenuOptionRequest): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/api/admin/menu-option`,
      menuOption
    );
  }

  // Update an existing menu option
  updateMenuOption(id: number, menuOption: MenuOptionRequest): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/api/admin/menu-option/${id}`,
      menuOption
    );
  }

  // Delete a menu option
  deleteMenuOption(id: number): Observable<any> {
    return this.http.delete(
      `${environment.apiBaseUrl}/api/admin/menu-option/${id}`
    );
  }

  // Upload a menu option image
  uploadMenuImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'image');

    return this.http.post(
      `${environment.apiBaseUrl}/api/admin/upload`,
      formData
    );
  }

  // Get all menu options in a flat structure for dropdown
  getMenuOptionsFlat(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiBaseUrl}/api/menu-options/flat`
    );
  }
}
