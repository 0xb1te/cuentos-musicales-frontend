import { Routes } from '@angular/router';
import { StoryGridComponent } from './components/story-grid/story-grid.component';

export const routes: Routes = [
  {
    path: '',
    component: StoryGridComponent,
  },
  {
    path: 'story/:id',
    loadComponent: () =>
      import('./pages/story-detail/story-detail.component').then(
        (m) => m.StoryDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
