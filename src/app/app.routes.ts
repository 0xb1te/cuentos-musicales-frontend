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
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/admin/story-create/story-create.component').then(
            (m) => m.StoryCreateComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./pages/admin/story-edit/story-edit.component').then(
            (m) => m.StoryEditComponent
          ),
      },
      {
        path: 'summary',
        loadComponent: () =>
          import('./pages/admin/story-summary/story-summary.component').then(
            (m) => m.StorySummaryComponent
          ),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import(
            './pages/admin/menu-management/menu-management.component'
          ).then((m) => m.MenuManagementComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/admin-landing/admin-landing.component').then(
            (m) => m.AdminLandingComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
