import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivestreamDetailedStats } from '../../livestreams.service';

@Component({
  selector: 'app-indices-proyecto',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './indices-proyecto.component.html',
  styleUrl: './indices-proyecto.component.scss',
})
export class IndicesProyectoComponent {
  @Input() livestreamData: LivestreamDetailedStats | null = null;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-CL').format(value);
  }

  formatDecimal(value: number): string {
    return value.toFixed(2);
  }
}
