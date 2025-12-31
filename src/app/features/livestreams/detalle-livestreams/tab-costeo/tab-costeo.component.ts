import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-tab-costeo',
  imports: [],
  standalone: true,
  templateUrl: './tab-costeo.component.html',
  styleUrl: './tab-costeo.component.scss',
})
export class TabCosteoComponent {

  protected breadcrumbItems: BreadcrumbItem[] = [
      { label: 'HOME', active: false, url: '/home' },
      { label: 'Proyectos', active: true },
    ];
  
}
