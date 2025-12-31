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
  id: number;
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
      const stats = livestream.stats;
      const isActive = stats?.isActive ?? !livestream.endedAt;
      const totalRevenue = stats?.totalRevenue || livestream.totalSalesAmount || 0;
      const confirmedRevenue = stats ? (stats.confirmedSales / (stats.totalSales || 1)) * totalRevenue : 0;
      const pendingRevenue = totalRevenue - confirmedRevenue;
      
      return {
        id: index + 1,
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

    // Datos de proyectos mock
    this.dataSource.data = [
      {
        id: 1,
        numero: 1,
        tipoProceso: 'Selección Regular',
        nombreEmpresa: 'OTIC SOFOFA',
        cargo: 'Gerente de Proyectos',
        solicitante: 'Juan Pérez',
        estado: 'En Progreso',
        fechaSolicitud: '01/01/2024',
        responsable: 'María González',
        urgencia: 'Alta',
        nombreProyecto: 'Implementación ERP',
        tipoServicio: 'Implementación',
        fechaInicio: '01/01/2024',
        fechaFin: '30/06/2024',
        montoTotal: 45000000,
        facturado: 30000000,
        porFacturar: 15000000,
        expanded: false,
        tipoVenta: 'Directa',
        tipoFinanciamiento: 'Sence',
        contrato: 'Contrato Marco 2024',
        margen: 35,
        fechaTerminoPropuesta: '15/12/2023'
      },
      {
        id: 2,
        numero: 2,
        tipoProceso: 'Selección Express',
        nombreEmpresa: 'Nexia Chile',
        cargo: 'Analista Financiero',
        solicitante: 'Ana Torres',
        estado: 'Finalizado',
        fechaSolicitud: '15/02/2024',
        responsable: 'Carlos Pérez',
        urgencia: 'Media',
        nombreProyecto: 'Consultoría Financiera',
        tipoServicio: 'Consultoría',
        fechaInicio: '15/02/2024',
        fechaFin: '15/08/2024',
        montoTotal: 25000000,
        facturado: 25000000,
        porFacturar: 0,
        expanded: false,
        tipoVenta: 'Por Licitación',
        tipoFinanciamiento: 'Propio',
        contrato: 'Contrato Específico 2024-02',
        margen: 42,
        fechaTerminoPropuesta: '30/01/2024'
      },
      {
        id: 3,
        numero: 3,
        tipoProceso: 'Selección Regular',
        nombreEmpresa: 'Tech Solutions SpA',
        cargo: 'Desarrollador Full Stack',
        solicitante: 'Pedro Gómez',
        estado: 'En Progreso',
        fechaSolicitud: '10/03/2024',
        responsable: 'Ana Martínez',
        urgencia: 'Alta',
        nombreProyecto: 'Desarrollo Portal Web',
        tipoServicio: 'Desarrollo',
        fechaInicio: '10/03/2024',
        fechaFin: '10/09/2024',
        montoTotal: 32000000,
        facturado: 16000000,
        porFacturar: 16000000,
        expanded: false,
        tipoVenta: 'Directa',
        tipoFinanciamiento: 'Franquicia Tributaria',
        contrato: 'Orden de Compra 15234',
        margen: 38,
        fechaTerminoPropuesta: '25/02/2024'
      },
      {
        id: 4,
        numero: 4,
        tipoProceso: 'Selección Regular',
        nombreEmpresa: 'Innovación y Desarrollo SA',
        cargo: 'Ingeniero de Soporte',
        solicitante: 'Laura Díaz',
        estado: 'Activo',
        fechaSolicitud: '01/01/2024',
        responsable: 'Rolando García',
        urgencia: 'Baja',
        nombreProyecto: 'Soporte Técnico Anual',
        tipoServicio: 'Soporte',
        fechaInicio: '01/01/2024',
        fechaFin: '31/12/2024',
        montoTotal: 18000000,
        facturado: 12000000,
        porFacturar: 6000000,
        expanded: false,
        tipoVenta: 'Renovación',
        tipoFinanciamiento: 'Propio',
        contrato: 'Contrato Anual 2024',
        margen: 45,
        fechaTerminoPropuesta: '15/11/2023'
      },
      {
        id: 5,
        numero: 5,
        tipoProceso: 'Selección Express',
        nombreEmpresa: 'Corporación Minera',
        cargo: 'Auditor Senior',
        solicitante: 'Roberto Campos',
        estado: 'Finalizado',
        fechaSolicitud: '05/04/2024',
        responsable: 'Patricia Silva',
        urgencia: 'Media',
        nombreProyecto: 'Auditoría Procesos',
        tipoServicio: 'Consultoría',
        fechaInicio: '05/04/2024',
        fechaFin: '05/07/2024',
        montoTotal: 28000000,
        facturado: 28000000,
        porFacturar: 0,
        expanded: false,
        tipoVenta: 'Por Licitación',
        tipoFinanciamiento: 'Sence',
        contrato: 'Licitación Pública 2024-03',
        margen: 40,
        fechaTerminoPropuesta: '20/03/2024'
      },
      {
        id: 6,
        numero: 6,
        tipoProceso: 'Selección Regular',
        nombreEmpresa: 'Retail Express SA',
        cargo: 'Consultor CRM',
        solicitante: 'Claudia Reyes',
        estado: 'En Progreso',
        fechaSolicitud: '20/05/2024',
        responsable: 'Luis Rojas',
        urgencia: 'Alta',
        nombreProyecto: 'Implementación CRM',
        tipoServicio: 'Implementación',
        fechaInicio: '20/05/2024',
        fechaFin: '20/11/2024',
        montoTotal: 52000000,
        facturado: 20000000,
        porFacturar: 32000000,
        expanded: false,
        tipoVenta: 'Directa',
        tipoFinanciamiento: 'Mixto',
        contrato: 'Contrato Servicio 2024-05',
        margen: 33,
        fechaTerminoPropuesta: '10/05/2024'
      },
      {
        id: 7,
        numero: 7,
        tipoProceso: 'Selección Regular',
        nombreEmpresa: 'OTIC SOFOFA',
        cargo: 'Especialista Cloud',
        solicitante: 'Fernando Ruiz',
        estado: 'En Progreso',
        fechaSolicitud: '01/06/2024',
        responsable: 'María González',
        urgencia: 'Media',
        nombreProyecto: 'Migración Cloud',
        tipoServicio: 'Implementación',
        fechaInicio: '01/06/2024',
        fechaFin: '01/12/2024',
        montoTotal: 38000000,
        facturado: 15000000,
        porFacturar: 23000000,
        expanded: false,
        tipoVenta: 'Directa',
        tipoFinanciamiento: 'Sence',
        contrato: 'Contrato Adicional 2024-06',
        margen: 37,
        fechaTerminoPropuesta: '15/05/2024'
      },
      {
        id: 8,
        numero: 8,
        tipoProceso: 'Selección Express',
        nombreEmpresa: 'Tech Solutions SpA',
        cargo: 'Instructor Técnico',
        solicitante: 'Mónica Vargas',
        estado: 'Finalizado',
        fechaSolicitud: '10/07/2024',
        responsable: 'Jorge Morales',
        urgencia: 'Baja',
        nombreProyecto: 'Capacitación Personal',
        tipoServicio: 'Consultoría',
        fechaInicio: '10/07/2024',
        fechaFin: '10/08/2024',
        montoTotal: 8000000,
        facturado: 8000000,
        porFacturar: 0,
        expanded: false,
        tipoVenta: 'Directa',
        tipoFinanciamiento: 'Franquicia Tributaria',
        contrato: 'Orden de Servicio 8821',
        margen: 48,
        fechaTerminoPropuesta: '25/06/2024'
      }
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

  navegarDetalleProceso(id: number) {
    console.log(`Navegar al detalle del proceso con ID: ${id}`);
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
