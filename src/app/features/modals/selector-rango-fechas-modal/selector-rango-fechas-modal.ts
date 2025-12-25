import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

export interface RangoFechasConfig {
  mesInicio?: string;
  mesFinal?: string;
}

@Component({
  selector: 'app-selector-rango-fechas-modal',
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './selector-rango-fechas-modal.html',
  styleUrl: './selector-rango-fechas-modal.scss',
  standalone: true
})
export class SelectorRangoFechasModalComponent {
  // Selector rápido
  selectorRapido: string = '';
  
  // Fechas seleccionadas
  mesInicio: string = 'Enero/2024';
  mesFinal: string = 'Enero/2024';
  
  // Año actual
  yearActual: number = 2024;
  
  // Meses
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  // Tracking para selección de rango
  mesInicioSeleccionado: string = '';
  mesFinalSeleccionado: string = '';

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<SelectorRangoFechasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RangoFechasConfig
  ) {
    if (data) {
      this.mesInicio = data.mesInicio || 'Enero/2024';
      this.mesFinal = data.mesFinal || 'Enero/2024';
    }
  }

  aplicarSelectorRapido(opcion: string): void {
    this.selectorRapido = opcion;
    const today = new Date();
    const mesActual = today.getMonth();
    const yearActual = today.getFullYear();
    
    switch(opcion) {
      case 'personalizar':
        // No hacer nada, dejar que el usuario personalice
        break;
      case 'mes-actual':
        this.mesInicio = `${this.meses[mesActual]}/${yearActual}`;
        this.mesFinal = `${this.meses[mesActual]}/${yearActual}`;
        break;
      case 'ultimos-2-meses':
        const mes2Atras = mesActual - 1 >= 0 ? mesActual - 1 : 11;
        const year2 = mes2Atras > mesActual ? yearActual - 1 : yearActual;
        this.mesInicio = `${this.meses[mes2Atras]}/${year2}`;
        this.mesFinal = `${this.meses[mesActual]}/${yearActual}`;
        break;
      case 'ultimos-3-meses':
        const mes3Atras = mesActual - 2 >= 0 ? mesActual - 2 : 12 + (mesActual - 2);
        const year3 = mes3Atras > mesActual ? yearActual - 1 : yearActual;
        this.mesInicio = `${this.meses[mes3Atras]}/${year3}`;
        this.mesFinal = `${this.meses[mesActual]}/${yearActual}`;
        break;
      case 'año-actual':
        this.mesInicio = `Enero/${yearActual}`;
        this.mesFinal = `${this.meses[mesActual]}/${yearActual}`;
        break;
    }
  }

  anteriorYear(): void {
    this.yearActual--;
  }

  siguienteYear(): void {
    this.yearActual++;
  }

  seleccionarMes(mes: string, tipo: 'inicio' | 'final'): void {
    const mesSeleccionado = `${mes}/${this.yearActual}`;
    if (tipo === 'inicio') {
      this.mesInicioSeleccionado = mesSeleccionado;
    } else {
      this.mesFinalSeleccionado = mesSeleccionado;
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onAplicar(): void {
    // Usar los meses seleccionados en el calendario si existen, sino usar los del input
    const resultado = {
      mesInicio: this.mesInicioSeleccionado || this.mesInicio,
      mesFinal: this.mesFinalSeleccionado || this.mesFinal
    };
    this.dialogRef.close(resultado);
  }

  isMesSeleccionado(mes: string, tipo: 'inicio' | 'final'): boolean {
    const mesCompleto = `${mes}/${this.yearActual}`;
    if (tipo === 'inicio') {
      return this.mesInicioSeleccionado === mesCompleto;
    } else {
      return this.mesFinalSeleccionado === mesCompleto;
    }
  }
}
