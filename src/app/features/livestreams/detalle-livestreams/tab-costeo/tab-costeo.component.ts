import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivestreamDetailedStats } from '../../livestreams.service';

@Component({
  selector: 'app-tab-costeo',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './tab-costeo.component.html',
  styleUrl: './tab-costeo.component.scss',
})
export class TabCosteoComponent {
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

  getAttributeKeys(): string[] {
    if (!this.livestreamData?.attributesWithPercentages) return [];
    return Object.keys(this.livestreamData.attributesWithPercentages);
  }

  getAttributeValues(attributeName: string): any[] {
    if (!this.livestreamData?.attributesWithPercentages) return [];
    return this.livestreamData.attributesWithPercentages[attributeName] || [];
  }

  getColorForIndex(index: number): string {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
      '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140',
      '#30cfd0', '#330867', '#a8edea', '#fed6e3', '#ffecd2'
    ];
    return colors[index % colors.length];
  }
}
