// src/app/features/livestreams/livestreams.routes.ts

import { Routes } from '@angular/router';

export const LIVESTREAMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./livestream-list.component').then(m => m.LivestreamListComponent)
  }
];
