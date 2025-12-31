// src/app/features/livestreams/livestreams.routes.ts

import { Routes } from '@angular/router';

export const LIVESTREAMS_ROUTES: Routes = [
  {
    path: 'listar',
    loadComponent: () => import('./listar-livestreams/listar-livestreams.component').then(m => m.ListarLivestreamsComponent)
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./detalle-livestreams/detalle-livestreams.component').then(m => m.DetalleLivestreamsComponent)
  }
];
