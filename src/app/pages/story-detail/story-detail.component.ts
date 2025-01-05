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

          // For development: Load mock data
          this.loadMockData();
        },
      });
  }

  private loadMockData() {
    const mockStory: Story = {
      id: 1,
      title: 'El Viaje Musical de Luna',
      description:
        'Una aventura mágica donde Luna descubre el poder de la música para conectar con sus emociones y con los demás.',
      content: 'Contenido detallado de la historia...',
      imageUrl: '',
      hasInteractiveElements: true,
      interactiveElements: [
        {
          id: 1,
          title: 'Juego Musical',
          description:
            'Explora diferentes instrumentos y crea tu propia melodía.',
          type: 'game',
        },
        {
          id: 2,
          title: 'Actividad de Reflexión',
          description: 'Conecta con tus emociones a través de la música.',
          type: 'activity',
        },
      ],
      teachingGuide: {
        id: 1,
        preview:
          'Esta guía incluye actividades prácticas y reflexiones para trabajar las emociones a través de la música...',
      },
    };

    this.story.set(mockStory);
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
