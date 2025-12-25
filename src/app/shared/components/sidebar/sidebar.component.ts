import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router'; 
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserRole } from '@core/constants/enums';
import { AuthService } from '@core/services/auth.service';
import { HasRoleDirective } from '@shared/directives/has-role.directive'; 
import { UserContextService } from '@core/context/user.context';

interface MenuOption {
  key: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, HasRoleDirective],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  currentUrl: string = '';
  sidebarWidth: number = 60;
  sidebarComprimido: boolean = true;
  isGuest: boolean = false;
  readonly UserRole = UserRole;
  
  private readonly menuOptions: MenuOption[] = [
    { key: 'home', route: '/' },
    { key: 'ProcesosSeleccion', route: '/procesos-seleccion' },
    { key: 'SolicitudesIngreso', route: '/solicitudes-ingreso' },
    { key: 'SolicitudReclutamientoSeleccion', route: '/procesos-seleccion' },
    { key: 'HomeProcesosSeleccion', route: '/home-procesos-seleccion' },
    { key: 'IngresoCandidatos', route: '/portal-ingreso-candidatos/login' },
  ];
  
  activeStates: Record<string, boolean> = {};
  hoverStates: Record<string, boolean> = {};
   
  private lastSelectedKey: string = 'home';

  constructor(
    private readonly _router: Router,
    private readonly _userContext: UserContextService,
    private readonly authService: AuthService,
  ) {
    this.initializeStates();
  }

  async ngOnInit() {
    const user = this._userContext.currentUser?.trabajadorData || null;
    this.isGuest = false; //user?.user?.usGuest ?? false;
    this.definirSeleccionActualSidebar();
  }

  ngAfterViewInit() {
    this._router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        console.log('URL actual:', this.currentUrl);
        this.definirSeleccionActualSidebar();
      });
  }

  // Inicializar estados dinámicamente
  private initializeStates(): void {
    this.menuOptions.forEach(option => {
      this.activeStates[option.key] = option.key === 'home'; // Home activo por defecto
      this.hoverStates[option.key] = false;
    });
  }

  expandSidebar() {
    this.sidebarWidth = 285;
    this.sidebarComprimido = false;
  }

  collapseSidebar() {
    this.sidebarWidth = 60;
    setTimeout(() => {
      this.sidebarComprimido = true;
    }, 300);
  }

  definirSeleccionActualSidebar() {
    if (this.isGuest) return;
    
    const currentRoute = this._router.url;
    console.log('Ruta actual:', currentRoute);

    // Buscar si la última opción seleccionada manualmente coincide con la ruta actual
    const lastOption = this.menuOptions.find(option => option.key === this.lastSelectedKey);
    if (lastOption && lastOption.route === currentRoute) {
      // Si la última opción seleccionada coincide con la ruta actual, mantenerla
      this.activateOption(this.lastSelectedKey, false);
      return;
    }

    // Si no, buscar la primera opción que coincida con la ruta actual
    const matchedOption = this.menuOptions.find(option => option.route === currentRoute);

    if (matchedOption) {
      this.activateOption(matchedOption.key, false);
      this.lastSelectedKey = matchedOption.key;
    } else {
      console.warn('Ruta no reconocida:', currentRoute);
    }
  }

  selectOptionSidebar(optionKey: string) {
    if (this.isGuest) return;

    console.log('Opción seleccionada en el sidebar:', optionKey);

    const selectedOption = this.menuOptions.find(option => option.key === optionKey);

    if (!selectedOption) {
      console.warn('Opción no reconocida:', optionKey);
      return;
    }

    // Guardar la última opción seleccionada manualmente
    this.lastSelectedKey = optionKey;

    // Activar la opción y navegar
    this.activateOption(optionKey, true);
  }

  // Método auxiliar para activar una opción
  private activateOption(optionKey: string, navigate: boolean = true): void {
    const selectedOption = this.menuOptions.find(option => option.key === optionKey);
    
    if (!selectedOption) return;

    // Desactivar todas las opciones
    Object.keys(this.activeStates).forEach(key => {
      this.activeStates[key] = false;
    });

    // Activar la opción seleccionada
    this.activeStates[selectedOption.key] = true;

    // Navegar a la ruta si es necesario
    if (navigate) {
      this._router.navigate([selectedOption.route]);
    }
  }

  // Métodos auxiliares para usar en el template
  isActive(key: string): boolean {
    return this.activeStates[key] || false;
  }

  isHover(key: string): boolean {
    return this.hoverStates[key] || false;
  }

  setHover(key: string, state: boolean): void {
    this.hoverStates[key] = state;
  }

  /**
   * Obtiene el texto del botón fusionado según el rol del usuario
   */
  getProcesosSeleccionText(): string {
    const userRole = this.authService.getUserRole();
    if (userRole === UserRole.JEFATURA_OTIC || userRole === UserRole.EJECUTIVO_COMERCIAL) {
      return 'Procesos de Selección';
    }
    return 'Selección Colaboradores';
  }

  /**
   * Obtiene la ruta del icono según el rol del usuario
   */
  getProcesosSeleccionIcon(isActiveOrHover: boolean): string {
    const userRole = this.authService.getUserRole();
    const suffix = isActiveOrHover ? '-active' : '';
    
    if (userRole === UserRole.JEFATURA_OTIC || userRole === UserRole.EJECUTIVO_COMERCIAL) {
      return `/assets/img/icon-persona-plus${suffix}.svg`;
    }
    return `/assets/img/icon-sidebar-seleccion-colaboradores${suffix}.svg`;
  }

  /**
   * Obtiene la clave de la opción a usar para el botón fusionado
   */
  getProcesosSeleccionKey(): string {
    const userRole = this.authService.getUserRole();
    if (userRole === UserRole.JEFATURA_OTIC || userRole === UserRole.EJECUTIVO_COMERCIAL) {
      return 'ProcesosSeleccion';
    }
    return 'SolicitudReclutamientoSeleccion';
  }
}
