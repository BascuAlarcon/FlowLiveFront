import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core'; 
import { UserRole } from '@core/constants/enums';
import { AuthService } from '@core/services/auth.service';

/**
 * Directiva estructural para mostrar/ocultar elementos basándose en el rol del usuario
 * 
 * @example
 * <!-- Mostrar solo para admin -->
 * <button *appHasRole="UserRole.ADMIN">Eliminar</button>
 * 
 * <!-- Mostrar para admin o jefatura -->
 * <button *appHasRole="[UserRole.ADMIN, UserRole.JEFATURA_OTIC]">Editar</button>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole!: UserRole | UserRole[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    console.log('HasRoleDirective - appHasRole:', this.appHasRole);
    const hasAccess = this.authService.hasRole(this.appHasRole);
    console.log('HasRoleDirective - hasAccess:', hasAccess);

    
    if (hasAccess) {
      // Mostrar el elemento
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Ocultar el elemento
      this.viewContainer.clear();
    }
  }
}
