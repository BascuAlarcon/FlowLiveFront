// src/app/features/customers/customer-list.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Clientes</h1>
      <p>Gestión de clientes</p>
    </div>
  `
})
export class CustomerListComponent {}
