// src/app/features/live-mode/live-mode.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-mode',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="live-mode-container">
      <div class="live-header">
        <span class="live-badge">🔴 EN VIVO</span>
        <h1>Modo Live</h1>
      </div>
      <p>Panel optimizado para ventas durante transmisiones</p>
      <!-- TODO: Implementar modo live -->
    </div>
  `,
  styles: [`
    .live-mode-container {
      padding: var(--spacing-lg);
      background: var(--gray-900);
      min-height: 100vh;
      color: white;
    }

    .live-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .live-badge {
      background: var(--danger);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `]
})
export class LiveModeComponent {}
