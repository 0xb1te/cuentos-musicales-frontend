import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './story-create.component.html',
  styleUrls: ['./story-create.component.scss'],
})
export class StoryCreateComponent {
  storyForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
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
    });
  }

  onSubmit() {
    if (this.storyForm.valid) {
      console.log('Story data:', this.storyForm.value);
      // Here you would call a service to save the story
      // Navigate to summary after saving
      this.router.navigate(['/admin/summary']);
    }
  }

  handleFileUpload(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      // Here you would upload the file to a server
      console.log(`Uploading file for ${field}:`, file.name);
      // For now, just use the file name as the URL
      this.storyForm.get(field)?.setValue(file.name);
    }
  }
}
