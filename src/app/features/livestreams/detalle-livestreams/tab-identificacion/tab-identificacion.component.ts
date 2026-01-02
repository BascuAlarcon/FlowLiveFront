import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivestreamDetailedStats } from '../../livestreams.service';

@Component({
  selector: 'app-tab-identificacion',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './tab-identificacion.component.html',
  styleUrl: './tab-identificacion.component.scss',
})
export class TabIdentificacionComponent {
  @Input() livestreamData: LivestreamDetailedStats | null = null;

  getPlatformIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      'instagram': '📷',
      'tiktok': '🎵',
      'youtube': '▶️',
      'other': '📹'
    };
    return icons[platform] || icons['other'];
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} minuto${mins !== 1 ? 's' : ''}`;
    }
    if (mins === 0) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hora${hours !== 1 ? 's' : ''} ${mins} minuto${mins !== 1 ? 's' : ''}`;
  }

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

  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
