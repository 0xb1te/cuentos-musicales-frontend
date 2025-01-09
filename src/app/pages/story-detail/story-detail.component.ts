import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryService } from '../../services/story.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Story } from '../../interfaces/story';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'story-detail.component.html',
})
export class StoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private storyService = inject(StoryService);
  private destroyRef = inject(DestroyRef);

  story = signal<Story | null>(null);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          const id = Number(params['id']);
          return this.storyService.getStoryById(id);
        })
      )
      .subscribe({
        next: (story) => {
          this.story.set(story);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading story:', err);
          this.error.set(
            'Error al cargar la historia. Por favor, intenta de nuevo más tarde.'
          );
          this.loading.set(false);
        },
      });
  }

  onReadStory() {
    console.log('Reading story:', this.story()?.id);
    // Implement story reading logic
  }

  onDownloadGuide() {
    console.log('Downloading guide for story:', this.story()?.id);
    // Implement guide download logic
  }

  onViewFullGuide() {
    console.log('Viewing full guide for story:', this.story()?.id);
    // Implement full guide view logic
  }
}
