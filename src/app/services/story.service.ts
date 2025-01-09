import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../interfaces/story';

export enum HttpRoutes {
  Menu = '/api/menu',
  Stories = '/api/stories',
}

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  constructor(private http: HttpClient) {}

  getStoriesById(menuLevelId?: number | null): Observable<Story[]> {
    let url = `${environment.apiBaseUrl}${HttpRoutes.Stories}`;

    if (menuLevelId) {
      url += `/by-menu-level?menuLevelId=${menuLevelId}`; // Add menuLevelId as a query parameter
    }
    return this.http.get<Story[]>(url);
  }

  getAllStories(): Observable<Story[]> {
    return this.http.get<Story[]>(
      `${environment.apiBaseUrl}${HttpRoutes.Stories}`
    );
  }

  getStoryById(id: number): Observable<Story> {
    return this.http.get<Story>(
      `${environment.apiBaseUrl}${HttpRoutes.Stories}/${id}`
    );
  }
}
