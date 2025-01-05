import { Component } from '@angular/core';
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
export class StoryGridComponent {
  gridItems: Story[] = [];

  constructor(private storyService: StoryService) {}

  ngOnInit() {
    // Using mock data for now
    this.gridItems = Array(10)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        title: 'Título del cuento al completo',
        description: 'Breve descripción del cuento...',
        content: 'Contenido del cuento...',
        imageUrl: '',
        hasInteractiveElements: false,
        interactiveElements: [],
        teachingGuide: {
          id: i + 1,
          preview: 'Preview of teaching guide',
        },
      }));
  }
}
