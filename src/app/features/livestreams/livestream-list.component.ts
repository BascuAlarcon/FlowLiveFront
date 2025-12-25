// src/app/features/livestreams/livestream-list.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livestream-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Livestreams</h1>
      <p>Gestión de transmisiones en vivo</p>
    </div>
  `
})
export class LivestreamListComponent {}
