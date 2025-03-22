import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-story-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './story-edit.component.html',
  styleUrls: ['./story-edit.component.scss'],
})
export class StoryEditComponent implements OnInit {
  storyId?: number;
  storyForm: FormGroup;
  selectedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      characteristicsText: ['', Validators.required],
      imageUrl: [''],
    });
  }

  ngOnInit() {
    this.storyId = Number(this.route.snapshot.paramMap.get('id'));
    // Here you would call a service to get the story data
    // For now, just set some dummy data
    this.storyForm.patchValue({
      title: 'Titulo del cuento',
      characteristicsText: 'Texto de características',
      imageUrl: 'placeholder-image.jpg',
    });
  }

  onSubmit() {
    if (this.storyForm.valid) {
      console.log('Story updated:', this.storyForm.value);
      // Here you would call a service to update the story
      this.router.navigate(['/admin/summary']);
    }
  }

  handleImageSelection(image: string) {
    this.selectedImage = image;
    this.storyForm.get('imageUrl')?.setValue(image);
  }
}
