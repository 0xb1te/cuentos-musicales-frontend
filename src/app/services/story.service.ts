import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../interfaces/story';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  constructor(private http: HttpClient) {}

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>('/api/stories');
  }

  getStoryById(id: number): Observable<Story> {
    return this.http.get<Story>(`/api/stories/${id}`);
  }
}
