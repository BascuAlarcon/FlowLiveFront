// src/app/features/sales/sales.routes.ts

import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sale-list.component').then(m => m.SaleListComponent)
  }
];
