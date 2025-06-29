import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialPopupComponent } from '../components/material-popup/material-popup.component';
import { StoryDetailComponent } from '../pages/story-detail/story-detail.component';
import { StoryService } from './story.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog, private storyService: StoryService) {}

  openStoryDetail(storyId: number, view: string = 'detail') {
    const titles: { [key: string]: string } = {
      detail: 'Detalles del Cuento',
      preview: 'Vista Previa',
      dedication: '',
      presentation: '',
      purchase: 'Comprar Cuento',
      'emotional-guide': '',
      'awakening-guide': '',
      'musical-guide': '',
    };

    // First fetch the story to get color theme information
    this.storyService.getStoryById(storyId).subscribe({
      next: (story) => {
        this.dialog.open(MaterialPopupComponent, {
          width: '80%',
          maxWidth: '800px',
          data: {
            title: titles[view] || 'Detalles del Cuento',
            component: StoryDetailComponent,
            inputs: {
              storyId,
              view,
            },
            hideHeader:
              view === 'dedication' ||
              view === 'presentation' ||
              view.includes('-guide'),
            // Pass color theme information
            story: story,
            backgroundColor: story.backgroundColor,
            textColor: story.textColor,
          },
        });
      },
      error: (error) => {
        console.error('Error fetching story for popup:', error);
        // Fallback to open popup without color customization
        this.dialog.open(MaterialPopupComponent, {
          width: '80%',
          maxWidth: '800px',
          data: {
            title: titles[view] || 'Detalles del Cuento',
            component: StoryDetailComponent,
            inputs: {
              storyId,
              view,
            },
            hideHeader:
              view === 'dedication' ||
              view === 'presentation' ||
              view.includes('-guide'),
          },
        });
      },
    });
  }

  openCustomPopup(title: string, component: any, inputs: any = {}) {
    return this.dialog.open(MaterialPopupComponent, {
      width: '80%',
      maxWidth: '800px',
      data: {
        title,
        component,
        inputs,
      },
    });
  }
}
