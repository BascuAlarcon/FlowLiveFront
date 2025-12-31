import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseDetalleSolicitud } from '@core/interfaces/solicitudes.interface';
import { AuthService } from '@core/services/auth.service';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IndicesProyectoComponent } from './indices-proyecto/indices-proyecto.component';
import { TabCosteoComponent } from './tab-costeo/tab-costeo.component';
import { TabGestionComponent } from './tab-gestion/tab-gestion.component';
import { TabIdentificacionComponent } from './tab-identificacion/tab-identificacion.component';

@Component({
  selector: 'app-detalle-livestreams',
  imports: [
    TabGestionComponent, 
    TabCosteoComponent, 
    TabIdentificacionComponent, 
    IndicesProyectoComponent,
    BreadcrumbComponent, 
    CommonModule,
    MatSortModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './detalle-livestreams.component.html',
  styleUrl: './detalle-livestreams.component.css',
})
export class DetalleLivestreamsComponent {
  protected breadcrumbItems: BreadcrumbItem[] = [
      { label: 'HOME', active: false, url: '/home' },
      { label: 'Potenciales Proyectos', active: false, url: '/potenciales-proyectos/listar' },
      { label: 'Crear Propuesta', active: true },
  ];

  activeTab: string = 'GESTION';
  public mainTabIndex = 0;

  readonly MAIN_TABS = {
    IDENTIFICACION: { label: 'Identificación Proyecto', value: 'IDENTIFICACION' },
    COSTEO: { label: 'Costeo Proyecto', value: 'COSTEO' },
    GESTION: { label: 'Gestión Financiera', value: 'GESTION' },
  };
  
  private router = inject(Router);

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onVolver(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.activeTab === 'solicitud') {
      this.router.navigate(['/procesos-seleccion']);
    } else {
      this.setActiveTab('solicitud');
    }
  }

}
