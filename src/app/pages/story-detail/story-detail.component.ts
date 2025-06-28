import {
  Component,
  OnInit,
  signal,
  inject,
  DestroyRef,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../services/story.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Story } from '../../interfaces/story';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'story-detail.component.html',
})
export class StoryDetailComponent implements OnInit {
  @Input() storyId!: number;
  @Input() view: string = 'detail';

  private storyService = inject(StoryService);
  private destroyRef = inject(DestroyRef);

  story = signal<Story | null>(null);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  currentView = signal<string>('detail');
  showDedicationModal = signal<boolean>(false);
  showPresentationModal = signal<boolean>(false);

  ngOnInit() {
    this.currentView.set(this.view);

    this.storyService
      .getStoryById(this.storyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  setView(view: string) {
    this.currentView.set(view);
  }

  goToSection(section: string) {
    this.setView(section);
  }

  onPurchase() {
    console.log('Purchase button clicked');
  }

  onBuyStory() {
    console.log('Buying story:', this.story()?.id);
    // Implement story purchase logic
  }

  onDownloadStory() {
    console.log('Downloading story:', this.story()?.id);
    // Implement story download logic
  }

  onDownloadGuide() {
    console.log('Downloading guide for story:', this.story()?.id);
    // Implement guide download logic
  }

  onViewFullGuide() {
    console.log('View full guide clicked');
  }

  openDedicationModal() {
    this.showDedicationModal.set(true);
  }

  closeDedicationModal() {
    this.showDedicationModal.set(false);
  }

  openPresentationModal() {
    this.showPresentationModal.set(true);
  }

  closePresentationModal() {
    this.showPresentationModal.set(false);
  }
}
