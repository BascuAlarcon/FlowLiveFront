import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserRole } from '@core/constants/enums';
import { AuthService } from '@core/services/auth.service';
import { LivestreamsService } from '../livestreams.service';
import { Livestream } from '@core/models/interfaces';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { CustomPaginatorComponent } from '@shared/components/custom-paginator/custom-paginator.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu'; 
import {  MatSortModule } from '@angular/material/sort'; 
import { MatTabsModule } from '@angular/material/tabs';
import { TiposProceso, Empresa } from '@core/interfaces/comunes.interface';
import { SolicitudModelBase } from '@core/interfaces/solicitudes.interface';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '@shared/directives/has-role.directive';

interface DataSource {
  id: string;
  numero?: number;
  nombreProyecto?: string;
  tipoProceso?: string;
  nombreEmpresa?: string;
  cargo?: string;
  tipoServicio?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoTotal?: number;
  facturado?: number;
  porFacturar?: number;
  estado?: string;
  fechaSolicitud?: string;
  responsable?: string;
  urgencia?: string;
  expanded?: boolean;
  tipoVenta?: string;
  tipoFinanciamiento?: string;
  contrato?: string;
  margen?: number;
  fechaTerminoPropuesta?: string;
  solicitante?: string;
}

@Component({
  selector: 'app-listar-livestreams',
  imports: [ 
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatTabsModule,
    CustomPaginatorComponent,
    CommonModule,
    BreadcrumbComponent,
    HasRoleDirective
  ],
  standalone: true,
  templateUrl: './listar-livestreams.component.html',
  styleUrl: './listar-livestreams.component.css',
})
export class ListarLivestreamsComponent {
  readonly UserRole = UserRole;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  public dataSource: MatTableDataSource<DataSource> = new MatTableDataSource<DataSource>();
  public displayedColumns: string[] = [];

  protected breadcrumbItems: BreadcrumbItem[] = [
    { label: 'HOME', active: false, url: '/home' },
    { label: 'Proyectos', active: true },
  ];

  public tiposProcesos: TiposProceso[] = [];
  public empresas: Empresa[] = [];

  public subTab: 'otic' | 'futuro' = 'otic';
  public mainTabIndex = 0;

  public filtrosAbiertos = false;

  readonly MAIN_TABS = {
    SOLICITUDES_SELECCION: { label: 'Solicitudes de Selección', value: 'SOLICITUDES_SELECCION' },
    MIS_SOLICITUDES: { label: 'Mis Solicitudes', value: 'MIS_SOLICITUDES' },
  };

  readonly SUB_TABS = {
    OTIC: {
      label: 'OTIC SOFOFA',
      value: 'otic' as const,
      MAIN_TABS: [{ label: 'Solicitudes de Selección', value: 'SOLICITUDES_SELECCION' }],
    },
    FUTURO: {
      label: 'Futuro del Trabajo',
      value: 'futuro' as const,
      MAIN_TABS: [{ label: 'Solicitudes de Selección', value: 'SOLICITUDES_SELECCION' }],
    },
  };

  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private authService = inject(AuthService);
  private readonly _router = inject(Router);
  private livestreamsService = inject(LivestreamsService);

  get _isFuturoTab(): boolean {
    return this.subTab === this.SUB_TABS.FUTURO.value;
  }

  get _isMisSolicitudesTab(): boolean {
    return this.mainTabIndex === 1;
  }
  get _displayedColumns(): string[] {
    return [
      'numero',
      'tipoProceso',
      'nombreEmpresa',
      'cargo',
      'solicitante',
      'estado',
      'fechaSolicitud',
      'responsable',
      'urgencia',
      'opciones'
    ];
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.init();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error al cargar la información.', 'Error');
    } finally {
      this.spinner.hide();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  isAdmin(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  async init() {
    try {
      const response: any = await this.livestreamsService.getAll().toPromise();
      const livestreams = response?.data || response || [];
      this.cargarLivestreams(livestreams);
    } catch (error) {
      console.error('Error al cargar livestreams:', error);
      this.toastr.error('No se pudieron cargar los livestreams', 'Error');
      // Cargar datos mock como fallback
      this.cargarDatosMock();
    }
  }

  cargarLivestreams(livestreams: Livestream[]) {
    this.dataSource.data = livestreams.map((livestream, index) => {
      console.log(livestream);
      const stats = livestream.stats;
      const isActive = stats?.isActive ?? !livestream.endedAt;
      const totalRevenue = stats?.totalRevenue || livestream.totalSalesAmount || 0;
      const confirmedRevenue = stats ? (stats.confirmedSales / (stats.totalSales || 1)) * totalRevenue : 0;
      const pendingRevenue = totalRevenue - confirmedRevenue;
      
      return {
        id: livestream.id,
        numero: index + 1,
        nombreProyecto: livestream.title,
        tipoProceso: 'Livestream',
        nombreEmpresa: this.formatPlatform(livestream.platform),
        cargo: stats ? `${stats.totalUnitsSold} unidades vendidas` : '-',
        tipoServicio: 'Transmisión en vivo',
        fechaInicio: new Date(livestream.startedAt).toLocaleDateString('es-CL'),
        fechaFin: livestream.endedAt ? new Date(livestream.endedAt).toLocaleDateString('es-CL') : 'En curso',
        montoTotal: totalRevenue,
        facturado: Math.round(confirmedRevenue),
        porFacturar: Math.round(pendingRevenue),
        estado: isActive ? 'En Progreso' : 'Finalizado',
        fechaSolicitud: new Date(livestream.createdAt).toLocaleDateString('es-CL'),
        responsable: this.truncateId(livestream.createdBy),
        urgencia: isActive ? 'Alta' : 'Baja',
        expanded: false,
        tipoVenta: 'En Vivo',
        tipoFinanciamiento: stats ? `${stats.totalSales} ventas` : '-',
        contrato: stats ? `Ticket promedio: ${this.formatearMonto(stats.averageTicket)}` : '-',
        margen: stats && stats.durationMinutes ? Math.round(stats.durationMinutes / 60) : 0,
        fechaTerminoPropuesta: stats ? `Duración: ${Math.round(stats.durationMinutes / 60)}h ${stats.durationMinutes % 60}min` : '-',
        solicitante: `Espectadores: ${livestream.viewerCount || 0}`
      };
    });
  }

  private formatPlatform(platform: string): string {
    const platforms: { [key: string]: string } = {
      'instagram': 'Instagram',
      'facebook': 'Facebook',
      'youtube': 'YouTube',
      'tiktok': 'TikTok',
      'twitch': 'Twitch'
    };
    return platforms[platform.toLowerCase()] || platform;
  }

  private truncateId(id: string): string {
    return id.length > 10 ? `${id.substring(0, 8)}...` : id;
  }

  cargarDatosMock() {
    // Tipos de servicio mock
    this.tiposProcesos = [
      { tproId: 1, tproNombre: 'Consultoría' },
      { tproId: 2, tproNombre: 'Implementación' },
      { tproId: 3, tproNombre: 'Soporte' },
      { tproId: 4, tproNombre: 'Desarrollo' }
    ];

    // Empresas mock
    this.empresas = [
      { emprCodigo: 1, empNombre: 'OTIC SOFOFA' },
      { emprCodigo: 2, empNombre: 'Nexia Chile' },
      { emprCodigo: 3, empNombre: 'Tech Solutions SpA' },
      { emprCodigo: 4, empNombre: 'Innovación y Desarrollo SA' },
      { emprCodigo: 5, empNombre: 'Corporación Minera' },
      { emprCodigo: 6, empNombre: 'Retail Express SA' }
    ];
 
  }

  toggleExpand(proyecto: DataSource) {
    proyecto.expanded = !proyecto.expanded;
  }

  // Función auxiliar para formatear montos
  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(monto);
  }

  navegarCrearProyecto(id?: number) {
    console.log('Navegar a gestionar proceso de selección');
    this._router.navigate(['/potenciales-proyectos/crear'], { queryParams: { proceso: id } });
  }

  navegarDetalleProceso(id: any) { 
    this._router.navigate([`/livestreams/detalle`, id]);
  }

  navegarCandidatos() {
    console.log('Navegar a gestionar proceso de selección');
  }

  getUrgenciaColor(urgencia: string): string {
    switch (urgencia?.toLowerCase()) {
      case 'alta':
        return '#FF001F'; // Rojo
      case 'media':
        return '#FFC93E'; // Amarillo/Naranja
      case 'baja':
        return '#00C56B'; // Verde
      default:
        return '#9CA3AF'; // Gris (fallback)
    }
  }

  selectSubTab(tab: 'otic' | 'futuro') {
    this.subTab = tab;
    this.mainTabIndex = 0;
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }
}
