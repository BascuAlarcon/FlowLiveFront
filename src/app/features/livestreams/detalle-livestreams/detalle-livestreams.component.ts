import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IndicesProyectoComponent } from './indices-proyecto/indices-proyecto.component';
import { TabCosteoComponent } from './tab-costeo/tab-costeo.component'; 
import { TabIdentificacionComponent } from './tab-identificacion/tab-identificacion.component';
import { LivestreamsService, LivestreamDetailedStats } from '../livestreams.service';

@Component({
  selector: 'app-detalle-livestreams',
  imports: [  
    TabCosteoComponent, 
    TabIdentificacionComponent, 
    IndicesProyectoComponent,
    BreadcrumbComponent, 
    CommonModule,
    MatSortModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './detalle-livestreams.component.html',
  styleUrl: './detalle-livestreams.component.css',
})
export class DetalleLivestreamsComponent implements OnInit {
  protected breadcrumbItems: BreadcrumbItem[] = [
      { label: 'HOME', active: false, url: '/home' },
      { label: 'Livestreams', active: false, url: '/livestreams/listar' },
      { label: 'Dashboard de Métricas', active: true },
  ];

  activeTab: string = 'IDENTIFICACION';
  public mainTabIndex = 0;

  readonly MAIN_TABS = {
    IDENTIFICACION: { label: 'Información General', value: 'IDENTIFICACION' },
    COSTEO: { label: 'Productos y Clientes', value: 'COSTEO' },
  };
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private livestreamsService = inject(LivestreamsService);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);

  livestreamId: string = '';
  livestreamData: LivestreamDetailedStats | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    this.livestreamId = this.route.snapshot.paramMap.get('id') || '';
    if (this.livestreamId) {
      this.loadLivestreamData();
    } else {
      this.toastr.error('ID de livestream no proporcionado');
      this.router.navigate(['/livestreams/listar']);
    }
  }

  loadLivestreamData(): void {
    this.loading = true;
    this.spinner.show();
    
    this.livestreamsService.getDetailedStats(this.livestreamId).subscribe({
      next: (response) => {
        if (response.success) {
          this.livestreamData = response.data;
        }
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar datos del livestream:', error);
        this.toastr.error('Error al cargar los datos del livestream');
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onVolver(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/livestreams/listar']);
  }

}
