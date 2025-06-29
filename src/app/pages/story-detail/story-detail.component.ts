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
    console.log('StoryDetail ngOnInit - Input view:', this.view);
    this.currentView.set(this.view);
    console.log('StoryDetail currentView set to:', this.currentView());

    this.storyService
      .getStoryById(this.storyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (story) => {
          console.log('Story loaded:', {
            id: story.id,
            title: story.title,
            dedicationImageUrl: story.dedicationImageUrl,
            presentationImageUrl: story.presentationImageUrl,
            emotionalGuideUrl: story.emotionalGuideUrl,
            musicalGuideUrl: story.musicalGuideUrl,
            awakeningGuideUrl: story.awakeningGuideUrl,
          });
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

  // Utility method to adjust color brightness
  adjustColor(color: string, percent: number): string {
    // Remove # if present
    const hex = color.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Adjust brightness
    const adjustedR = Math.max(
      0,
      Math.min(255, r + Math.round((r * percent) / 100))
    );
    const adjustedG = Math.max(
      0,
      Math.min(255, g + Math.round((g * percent) / 100))
    );
    const adjustedB = Math.max(
      0,
      Math.min(255, b + Math.round((b * percent) / 100))
    );

    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
  }
}
