import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Story } from '../../../interfaces/story';

@Component({
  selector: 'app-story-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './story-summary.component.html',
  styleUrls: ['./story-summary.component.scss'],
})
export class StorySummaryComponent implements OnInit {
  stories: Story[] = [];

  constructor() {}

  ngOnInit() {
    // Here you would call a service to get the stories
    // For now, just set some dummy data
    this.stories = [
      {
        id: 1,
        title: 'El Bosque Encantado',
        content: 'Contenido del cuento...',
        description: 'Un cuento mágico sobre un bosque encantado',
        imageUrl: 'forest.jpg',
        hasInteractiveElements: false,
      },
      {
        id: 2,
        title: 'El Mar Azul',
        content: 'Contenido del cuento...',
        description: 'Aventuras en el mar azul',
        imageUrl: 'sea.jpg',
        hasInteractiveElements: true,
      },
      {
        id: 3,
        title: 'La Montaña Mágica',
        content: 'Contenido del cuento...',
        description: 'Descubriendo los secretos de la montaña',
        imageUrl: 'mountain.jpg',
        hasInteractiveElements: false,
      },
    ];
  }

  deleteStory(id: number) {
    // Here you would call a service to delete the story
    console.log('Deleting story with id:', id);
    this.stories = this.stories.filter((story) => story.id !== id);
  }
}
