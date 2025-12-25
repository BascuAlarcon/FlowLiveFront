import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

// Recibe un array con este formato:
// breadcrumbItems: BreadcrumbItem[] = [
//   { label: 'Inicio', url: '/' },
//   { label: 'Recursos Humanos', url: '/rrhh' },
//   { label: 'Procesos de Selección', active: true }
// ];

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
