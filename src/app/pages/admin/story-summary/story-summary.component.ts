import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Story } from '../../../interfaces/story';
import { StoryService } from '../../../services/story.service';

@Component({
  selector: 'app-story-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './story-summary.component.html',
  styleUrls: ['./story-summary.component.scss'],
})
export class StorySummaryComponent implements OnInit {
  stories: Story[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private storyService: StoryService) {}

  ngOnInit() {
    this.loadStories();
  }

  loadStories() {
    this.isLoading = true;
    this.storyService.getAllStories().subscribe({
      next: (stories) => {
        this.stories = stories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stories:', error);
        this.errorMessage = 'Error loading stories';
        this.isLoading = false;
      },
    });
  }

  deleteStory(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este cuento?')) {
      this.storyService.deleteStory(id).subscribe({
        next: () => {
          console.log('Story deleted successfully');
          this.loadStories(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting story:', error);
          this.errorMessage = 'Error deleting story';
        },
      });
    }
  }
}
