// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '@shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: ` 
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <router-outlet></router-outlet> 
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      position: relative;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `]
})
export class AppComponent {
  constructor(public loadingService: LoadingService) {}
}
