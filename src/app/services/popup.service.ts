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
    this.dialog.open(MaterialPopupComponent, {
      width: '80%',
      maxWidth: '800px',
      data: {
        title: 'Detalles del Cuento',
        component: StoryDetailComponent,
        inputs: {
          storyId,
          view,
        },
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
