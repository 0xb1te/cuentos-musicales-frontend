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

  getStories(): Observable<Story[]> {
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
