// src/app/features/products/product-list.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Productos</h1>
      <p>Gestión de productos</p>
      <!-- TODO: Implementar lista de productos -->
    </div>
  `
})
export class ProductListComponent {}
