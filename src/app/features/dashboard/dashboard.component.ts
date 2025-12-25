import { Component } from '@angular/core';
 import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component'; 
import { HomeProcesosSeleccionTabGeneralesComponent } from './home-procesos-seleccion-tab-generales/home-procesos-seleccion-tab-generales.component';
import { HomeProcesosSeleccionTabIngresoComponent } from './home-procesos-seleccion-tab-ingreso/home-procesos-seleccion-tab-ingreso.component';
import { HomeProcesosSeleccionTabSeleccionComponent } from './home-procesos-seleccion-tab-seleccion/home-procesos-seleccion-tab-seleccion.component';
 
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr'; 
import { UserRole } from '@core/constants/enums';
import { MatDialog } from '@angular/material/dialog';
import { SelectorRangoFechasModalComponent } from '@features/modals/selector-rango-fechas-modal/selector-rango-fechas-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-procesos-seleccion',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, HomeProcesosSeleccionTabGeneralesComponent, HomeProcesosSeleccionTabIngresoComponent, HomeProcesosSeleccionTabSeleccionComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../../assets/styles/styles-seleccion.scss'],
})
export class DashboardComponent {

  readonly UserRole = UserRole;

  breadcrumbItems: BreadcrumbItem[] = [ 
    { label: 'HOME',  },
    { label: 'Selección e Ingreso de Personas', active: true }
  ];

  activeTab: string = 'generales'; 
  showFilters: boolean = false;
  fechaSeleccionada: string = '25/10/2025';

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private readonly _router: Router,
    private dialog: MatDialog
  ){ 
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    console.log('Pestaña activa:', this.activeTab);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  abrirSelectorRapido(){
    const dialogRef = this.dialog.open(SelectorRangoFechasModalComponent, {
      width: '700px',
      panelClass: 'dialog-generico',
      data: { 
        mesInicio: 'Enero/2024',
        mesFinal: 'Enero/2024'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar el valor mostrado en el input
        this.fechaSeleccionada = `${result.mesInicio} - ${result.mesFinal}`;
        console.log('Rango seleccionado:', result);
      }
    });
  }
}
