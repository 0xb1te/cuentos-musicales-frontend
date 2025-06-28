import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from '../../../services/story.service';
import { Story } from '../../../interfaces/story';

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
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private storyService: StoryService
  ) {
    this.storyForm = this.fb.group({
      title: ['', Validators.required],
      author: [''],
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
  }

  ngOnInit() {
    this.storyId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.storyId) {
      this.loadStory();
    }
  }

  loadStory() {
    if (!this.storyId) return;

    this.isLoading = true;
    this.storyService.getStoryById(this.storyId).subscribe({
      next: (story: Story) => {
        this.storyForm.patchValue({
          title: story.title,
          author: story.author,
          description: story.description,
          content: story.content,
          imageUrl: story.imageUrl,
          isFree: story.isFree,
          audioPreviewUrl: story.audioPreviewUrl,
          audioFullUrl: story.audioFullUrl,
          indicativeImage1: story.indicativeImage1,
          indicativeImage2: story.indicativeImage2,
          dedicationImageUrl: story.dedicationImageUrl,
          presentationImageUrl: story.presentationImageUrl,
          emotionalGuideUrl: story.emotionalGuideUrl,
          musicalGuideUrl: story.musicalGuideUrl,
          educationalGuideUrl: story.educationalGuideUrl,
          duration: story.duration,
          hasInteractiveElements: story.hasInteractiveElements,
          customPhrase: story.customPhrase,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading story:', error);
        this.errorMessage = 'Error loading story';
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    if (this.storyForm.valid && this.storyId) {
      this.isLoading = true;
      this.errorMessage = '';

      this.storyService
        .updateStory(this.storyId, this.storyForm.value)
        .subscribe({
          next: (story) => {
            console.log('Story updated successfully:', story);
            this.isLoading = false;
            this.router.navigate(['/admin/summary']);
          },
          error: (error) => {
            console.error('Error updating story:', error);
            this.errorMessage = 'Error updating story';
            this.isLoading = false;
          },
        });
    }
  }

  handleImageSelection(image: string) {
    this.selectedImage = image;
    this.storyForm.get('imageUrl')?.setValue(image);
  }
}
