// src/app/features/metrics/metrics-dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Métricas</h1>
      <p>Dashboard de métricas y estadísticas</p>
      <!-- TODO: Implementar gráficos con Chart.js -->
    </div>
  `
})
export class MetricsDashboardComponent {}
