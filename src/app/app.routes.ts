import { Routes } from '@angular/router';
import { StoryGridComponent } from './components/story-grid/story-grid.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'stories',
    loadComponent: () =>
      import('./components/story-grid/story-grid.component').then(
        (c) => c.StoryGridComponent
      ),
  },
  {
    path: 'content/:id',
    loadComponent: () =>
      import('./pages/dynamic-content/dynamic-content.component').then(
        (c) => c.DynamicContentComponent
      ),
  },
  {
    path: 'story/:id',
    loadComponent: () =>
      import('./pages/story-detail/story-detail.component').then(
        (m) => m.StoryDetailComponent
      ),
  },
  {
    path: 'story/:id/preview',
    loadComponent: () =>
      import('./pages/story-detail/story-detail.component').then(
        (m) => m.StoryDetailComponent
      ),
    data: { view: 'preview' },
  },
  {
    path: 'story/:id/dedication',
    loadComponent: () =>
      import('./pages/story-detail/story-detail.component').then(
        (m) => m.StoryDetailComponent
      ),
    data: { view: 'dedication' },
  },
  {
    path: 'story/:id/guide',
    loadComponent: () =>
      import('./pages/story-detail/story-detail.component').then(
        (m) => m.StoryDetailComponent
      ),
    data: { view: 'guide' },
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [AuthGuard],
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
