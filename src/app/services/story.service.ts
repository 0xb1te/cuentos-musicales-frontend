import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../interfaces/story';

export enum HttpRoutes {
  Menu = '/api/menu',
  Stories = '/api/stories',
  Upload = '/api/upload',
  AdminUpload = '/api/admin/upload',
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

    // Determine file type based on the field type and file extension
    const fileType = this.determineFileType(type, file.name);
    formData.append('fileType', fileType);

    return this.http.post<any>(
      `${environment.apiBaseUrl}${HttpRoutes.AdminUpload}`,
      formData
    );
  }

  private determineFileType(fieldType: string, fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();

    // Map field types to storage directories
    if (fieldType.includes('audio') || fieldType.includes('Audio')) {
      return 'audio';
    }

    if (fieldType.includes('guide') || fieldType.includes('Guide')) {
      return 'documents';
    }

    if (
      fieldType.includes('image') ||
      fieldType.includes('Image') ||
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
    ) {
      return 'images';
    }

    // Default fallback
    return 'uploads';
  }
}
