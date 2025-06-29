// story-grid.component.ts
import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../services/story.service';
import { Story } from '../../interfaces/story';
import { CategoryService } from '../../services/category.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-story-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-grid.component.html',
  styleUrl: './story-grid.component.scss',
})
export class StoryGridComponent implements OnInit {
  gridItems: Story[] = [];

  constructor(
    private storyService: StoryService,
    private categoryService: CategoryService,
    private popupService: PopupService
  ) {
    // Use effect to react to changes in the selected category ID
    effect(() => {
      const categoryId = this.categoryService.selectedMenuLevelId();
      console.log(categoryId);
      if (categoryId !== null) {
        this.fetchStories(categoryId);
      }
    });
  }

  ngOnInit() {
    this.fetchStories(); // Initial fetch without a category filter
  }

  fetchStories(categoryId?: number) {
    console.log(categoryId);
    this.storyService
      .getStoriesById(categoryId === 1 ? null : categoryId)
      .subscribe({
        next: (stories) => {
          // Filter stories by category ID (assuming stories have a categoryId property)
          this.gridItems = stories;

          // Debug: Log color information for each story
          this.gridItems.forEach((story) => {
            console.log(`Story "${story.title}" colors:`, {
              backgroundColor: story.backgroundColor,
              buttonsColor: story.buttonsColor,
              textColorButtons: story.textColorButtons,
              textColor: story.textColor,
              containerBackgroundColor: story.containerBackgroundColor,
            });
          });

          console.log('Stories:::', this.gridItems);
        },
        error: (error) => {
          console.error('Error fetching stories:', error);
        },
      });
  }

  openStoryDetail(storyId: number, view: string = 'detail') {
    this.popupService.openStoryDetail(storyId, view);
  }

  // Temporary debug method to log color values
  debugColors(story: any): void {
    console.log('Story colors:', {
      id: story.id,
      title: story.title,
      backgroundColor: story.backgroundColor,
      buttonsColor: story.buttonsColor,
      textColorButtons: story.textColorButtons,
      textColor: story.textColor,
    });
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
