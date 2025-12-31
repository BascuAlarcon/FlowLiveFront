import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

interface HitoIngreso {
  nombre: string;
  fechaPactada: string;
  tipoFinanciamiento: string;
  porcentajePago: number;
  subtotal: number;
}

interface HitoPago {
  descripcion: string;
  fechaPactada: string;
  proveedor: string;
  subtotal: number;
}

@Component({
  selector: 'app-tab-gestion',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './tab-gestion.component.html',
  styleUrl: './tab-gestion.component.scss',
})
export class TabGestionComponent {

  public mainTabIndex = 0;
  public subTab: 'ingresos' | 'pagos' = 'ingresos';
    
  protected breadcrumbItems: BreadcrumbItem[] = [
    { label: 'HOME', active: false, url: '/home' },
    { label: 'Proyectos', active: true },
  ];
 

  readonly SUB_TABS = {
    INGRESOS: {
      label: 'Ingresos',
      value: 'ingresos' as const,  
    },
    PAGOS: {
      label: 'Pagos',
      value: 'pagos' as const, 
    },
  };

  // Datos de Hitos de Ingreso
  hitosIngreso: HitoIngreso[] = [];
  totalPorcentajeIngreso: number = 0;
  totalSubtotalIngreso: number = 0;

  // Datos de Hitos de Pagos
  hitosPagos: HitoPago[] = [
    { descripcion: 'Descripción Pago', fechaPactada: 'Sin información', proveedor: 'Sin información', subtotal: 1000000 },
    { descripcion: 'Descripción Pago', fechaPactada: 'Sin información', proveedor: 'Sin información', subtotal: 1000000 },
    { descripcion: 'Descripción Pago', fechaPactada: 'Sin información', proveedor: 'Sin información', subtotal: 1000000 },
    { descripcion: 'Descripción Pago', fechaPactada: 'Sin información', proveedor: 'Sin información', subtotal: 1000000 },
  ];
  totalPagos: number = 2000000;

  // Nuevo hito de ingreso
  nuevoHitoIngreso: HitoIngreso = {
    nombre: '',
    fechaPactada: '',
    tipoFinanciamiento: 'Financiamiento',
    porcentajePago: 0,
    subtotal: 0
  };

  selectSubTab(tab: 'ingresos' | 'pagos') {
    this.subTab = tab;
    this.mainTabIndex = 0;
  }

  agregarHitoIngreso() {
    if (this.nuevoHitoIngreso.nombre && this.nuevoHitoIngreso.fechaPactada) {
      this.hitosIngreso.push({ ...this.nuevoHitoIngreso });
      this.calcularTotalesIngreso();
      this.nuevoHitoIngreso = {
        nombre: '',
        fechaPactada: '',
        tipoFinanciamiento: 'Financiamiento',
        porcentajePago: 0,
        subtotal: 0
      };
    }
  }

  eliminarHitoIngreso(index: number) {
    this.hitosIngreso.splice(index, 1);
    this.calcularTotalesIngreso();
  }

  eliminarHitoPago(index: number) {
    this.hitosPagos.splice(index, 1);
    this.calcularTotalPagos();
  }

  calcularTotalesIngreso() {
    this.totalPorcentajeIngreso = this.hitosIngreso.reduce((sum, hito) => sum + hito.porcentajePago, 0);
    this.totalSubtotalIngreso = this.hitosIngreso.reduce((sum, hito) => sum + hito.subtotal, 0);
  }

  calcularTotalPagos() {
    this.totalPagos = this.hitosPagos.reduce((sum, hito) => sum + hito.subtotal, 0);
  }
  
}
