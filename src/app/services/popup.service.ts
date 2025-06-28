import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialPopupComponent } from '../components/material-popup/material-popup.component';
import { StoryDetailComponent } from '../pages/story-detail/story-detail.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openStoryDetail(storyId: number, view: string = 'detail') {
    const titles: { [key: string]: string } = {
      detail: 'Detalles del Cuento',
      preview: 'Vista Previa',
      dedication: '', // No title for dedication
      presentation: '', // No title for presentation
      purchase: 'Comprar Cuento',
      guide: 'Guías Didácticas',
      'emotional-guide': 'Guía Emocional',
      'awakening-guide': 'Guía Despertador',
      'musical-guide': 'Guía Musical',
    };

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
        hideHeader: view === 'dedication' || view === 'presentation',
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
