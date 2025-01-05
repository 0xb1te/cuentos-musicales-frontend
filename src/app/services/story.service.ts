import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../interfaces/story';

export enum HttpRoutes {
  GetMenu = '/api/menu',
  GetStories = '/api/stories',
}

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  constructor(private http: HttpClient) {}

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(HttpRoutes.GetStories);
  }

  getStoryById(id: number): Observable<Story> {
    return this.http.get<Story>(`/api/stories/${id}`);
  }
}
