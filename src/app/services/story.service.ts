import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../interfaces/story';

export enum HttpRoutes {
  Menu = '/api/menu',
  Stories = '/api/stories',
  Upload = '/api/upload',
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

  createStory(story: Partial<Story>): Observable<Story> {
    return this.http.post<Story>(
      `${environment.apiBaseUrl}${HttpRoutes.Stories}`,
      story
    );
  }

  updateStory(id: number, story: Partial<Story>): Observable<Story> {
    return this.http.put<Story>(
      `${environment.apiBaseUrl}${HttpRoutes.Stories}/${id}`,
      story
    );
  }

  deleteStory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}${HttpRoutes.Stories}/${id}`
    );
  }

  uploadFile(file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<any>(
      `${environment.apiBaseUrl}${HttpRoutes.Upload}`,
      formData
    );
  }
}
