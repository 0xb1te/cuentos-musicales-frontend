import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../interfaces/menu';
import { HttpRoutes } from './story.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}

  getMenuStructure(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(HttpRoutes.GetMenu);
  }
}
