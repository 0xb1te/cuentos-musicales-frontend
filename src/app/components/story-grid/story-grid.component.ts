import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../services/story.service';
import { Story } from '../../interfaces/story';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-story-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './story-grid.component.html',
  styleUrl: './story-grid.component.scss',
})
export class StoryGridComponent implements OnInit {
  gridItems: Story[] = [];

  constructor(private storyService: StoryService) {}

  ngOnInit() {
    this.fetchStories();
  }

  fetchStories() {
    this.storyService.getStories().subscribe({
      next: (stories) => {
        this.gridItems = stories;
      },
      error: (error) => {
        console.error('Error fetching stories:', error);
      },
    });
  }
}
