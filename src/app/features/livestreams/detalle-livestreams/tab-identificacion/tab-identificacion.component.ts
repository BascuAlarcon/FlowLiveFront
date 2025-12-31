import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-tab-identificacion',
  imports: [],
  standalone: true,
  templateUrl: './tab-identificacion.component.html',
  styleUrl: './tab-identificacion.component.scss',
})
export class TabIdentificacionComponent {
  protected breadcrumbItems: BreadcrumbItem[] = [
    { label: 'HOME', active: false, url: '/home' },
    { label: 'Proyectos', active: true },
  ];

}
