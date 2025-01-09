// story-grid.component.ts
import { Component, OnInit, effect } from '@angular/core'; // Import effect
import { CommonModule } from '@angular/common';
import { StoryService } from '../../services/story.service';
import { Story } from '../../interfaces/story';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service'; // Import the service

@Component({
  selector: 'app-story-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './story-grid.component.html',
  styleUrl: './story-grid.component.scss',
})
export class StoryGridComponent implements OnInit {
  gridItems: Story[] = [];

  constructor(
    private storyService: StoryService,
    private categoryService: CategoryService // Inject the service
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

          console.log('Stories:::', this.gridItems);
        },
        error: (error) => {
          console.error('Error fetching stories:', error);
        },
      });
  }
}
