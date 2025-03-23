import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoryService } from '../../../services/story.service';
import { finalize, forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-story-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './story-create.component.html',
  styleUrls: ['./story-create.component.scss'],
})
export class StoryCreateComponent {
  storyForm: FormGroup;
  files: { [key: string]: File } = {};
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storyService: StoryService,
    private authService: AuthService
  ) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: [''],
      content: [''],
      imageUrl: [''],
      isFree: [false],
      audioPreviewUrl: [''],
      audioFullUrl: [''],
      indicativeImage1: [''],
      indicativeImage2: [''],
      emotionalGuideUrl: [''],
      musicalGuideUrl: [''],
      educationalGuideUrl: [''],
      duration: [0],
      hasInteractiveElements: [false],
    });

    // Verificar que el usuario está autenticado
    const token = this.authService.getToken();
    console.log('StoryCreateComponent initialized, token exists:', !!token);
  }

  onSubmit() {
    if (this.storyForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log('Starting story creation process');
      console.log('Files to upload:', Object.keys(this.files).length);

      // First upload all files
      const fileUploads = Object.keys(this.files)
        .map((field) => {
          const file = this.files[field];
          if (file) {
            console.log(
              `Uploading file for field: ${field}, name: ${file.name}, size: ${file.size} bytes`
            );
            return this.storyService.uploadFile(file, field).pipe(
              finalize(() => {
                // Remove the file after upload to avoid re-uploading
                delete this.files[field];
              })
            );
          } else {
            return of(null);
          }
        })
        .filter((upload) => upload !== null);

      if (fileUploads.length > 0) {
        console.log(`Starting upload of ${fileUploads.length} files`);
        forkJoin(fileUploads).subscribe({
          next: (results) => {
            console.log('All files uploaded successfully, results:', results);
            // Update form with URLs from upload results
            results.forEach((result, index) => {
              if (result && result.url) {
                const fieldName = Object.keys(this.files)[index];
                this.storyForm.get(fieldName)?.setValue(result.url);
                console.log(
                  `Updated form field ${fieldName} with URL: ${result.url}`
                );
              }
            });
            this.createStory();
          },
          error: (error) => {
            console.error('Error uploading files:', error);
            this.handleError(error);
          },
        });
      } else {
        console.log('No files to upload, proceeding to create story');
        this.createStory();
      }
    }
  }

  private createStory() {
    console.log('Creating story with data:', this.storyForm.value);
    this.storyService.createStory(this.storyForm.value).subscribe({
      next: (story) => {
        this.isLoading = false;
        console.log('Story created successfully:', story);
        this.router.navigate(['/admin/summary']);
      },
      error: (error) => {
        console.error('Error creating story:', error);
        this.handleError(error);
      },
    });
  }

  private handleError(error: any) {
    this.isLoading = false;
    console.error('Error details:', error);

    if (error instanceof HttpErrorResponse) {
      console.error(`Status: ${error.status}, Message: ${error.message}`);

      if (error.status === 403) {
        this.errorMessage =
          'No tienes permiso para realizar esta acción. Por favor, inicia sesión nuevamente.';
        // Podría ser un problema de autenticación, intentemos cerrar sesión y redirigir al login
        setTimeout(() => {
          this.authService.logout();
        }, 2000);
        return;
      }

      if (error.status === 401) {
        this.errorMessage =
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        setTimeout(() => {
          this.authService.logout();
        }, 2000);
        return;
      }
    }

    this.errorMessage =
      'Ha ocurrido un error al guardar el cuento. Por favor, inténtalo de nuevo.';
  }

  handleFileUpload(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      // Store file for later upload
      this.files[field] = file;
      // For preview purposes, update the form with the file name
      this.storyForm.get(field)?.setValue(file.name);
      console.log(
        `File selected for ${field}:`,
        file.name,
        'Size:',
        file.size,
        'bytes'
      );
    }
  }
}
