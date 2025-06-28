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
      dedicationImageUrl: [''],
      presentationImageUrl: [''],
      emotionalGuideUrl: [''],
      musicalGuideUrl: [''],
      educationalGuideUrl: [''],
      duration: [0],
      hasInteractiveElements: [false],
      customPhrase: [''],
      // Color theme fields
      backgroundColor: ['#1f2937'],
      buttonsColor: ['#3b82f6'],
      textColorButtons: ['#ffffff'],
      textColor: ['#f9fafb'],
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
      const fileFields = Object.keys(this.files);
      const fileUploads = fileFields.map((field) => {
        const file = this.files[field];
        console.log(
          `Uploading file for field: ${field}, name: ${file.name}, size: ${file.size} bytes`
        );
        return this.storyService.uploadFile(file, field).pipe(
          finalize(() => {
            console.log(`Upload completed for field: ${field}`);
          })
        );
      });

      if (fileUploads.length > 0) {
        console.log(`Starting upload of ${fileUploads.length} files`);
        forkJoin(fileUploads).subscribe({
          next: (results) => {
            console.log('All files uploaded successfully, results:', results);
            // Update form with URLs from upload results
            results.forEach((result, index) => {
              if (result && result.url) {
                const fieldName = fileFields[index];
                this.storyForm.get(fieldName)?.setValue(result.url);
                console.log(
                  `Updated form field ${fieldName} with URL: ${result.url}`
                );
              }
            });

            // Clear the files dictionary since they're now uploaded
            this.files = {};
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
    } else {
      console.log('Form is invalid:', this.storyForm.errors);
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
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

      if (error.status === 413) {
        this.errorMessage =
          'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.';
        return;
      }

      if (error.status === 415) {
        this.errorMessage =
          'Tipo de archivo no permitido. Por favor, verifica que el archivo sea válido.';
        return;
      }
    }

    this.errorMessage =
      'Ha ocurrido un error al guardar el cuento. Por favor, inténtalo de nuevo.';
  }

  handleFileUpload(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        this.errorMessage = `El archivo ${file.name} es demasiado grande. El tamaño máximo permitido es 10MB.`;
        // Clear the input
        event.target.value = '';
        return;
      }

      // Store file for later upload
      this.files[field] = file;
      // For preview purposes, update the form with the file name
      this.storyForm.get(field)?.setValue(file.name);
      console.log(
        `File selected for ${field}:`,
        file.name,
        'Size:',
        (file.size / 1024 / 1024).toFixed(2),
        'MB'
      );

      // Clear any previous error messages
      if (this.errorMessage.includes('demasiado grande')) {
        this.errorMessage = '';
      }
    }
  }
}
