// src/app/features/sales/sale-list.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Ventas</h1>
      <p>Gestión de ventas</p>
    </div>
  `
})
export class SaleListComponent {}
