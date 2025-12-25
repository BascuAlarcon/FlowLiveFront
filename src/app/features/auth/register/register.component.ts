// src/app/features/auth/register/register.component.ts

import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card card">
        <div class="register-header">
          <h1>FlowLive</h1>
          <p>Crea tu cuenta</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name" class="form-label">Nombre</label>
            <input type="text" id="name" formControlName="name" class="form-control" />
            @if (name?.invalid && name?.touched) {
              <div class="form-error">El nombre es requerido</div>
            }
          </div>

          <div class="form-group">
            <label for="organizationName" class="form-label">Nombre de tu Tienda/Marca</label>
            <input type="text" id="organizationName" formControlName="organizationName" class="form-control" />
            @if (organizationName?.invalid && organizationName?.touched) {
              <div class="form-error">El nombre de la organización es requerido</div>
            }
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" formControlName="email" class="form-control" />
            @if (email?.invalid && email?.touched) {
              <div class="form-error">Email inválido</div>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" id="password" formControlName="password" class="form-control" />
            @if (password?.invalid && password?.touched) {
              <div class="form-error">Mínimo 6 caracteres</div>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-block" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              <span>Creando cuenta...</span>
            } @else {
              <span>Registrarse</span>
            }
          </button>
        </form>

        <div class="register-footer">
          <p>¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-md);
      background: linear-gradient(135deg, var(--primary) 0%, var(--info) 100%);
    }

    .register-card {
      width: 100%;
      max-width: 400px;
    }

    .register-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .register-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: var(--spacing-xs);
    }

    .register-footer {
      text-align: center;
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--gray-200);
      margin-top: var(--spacing-lg);
    }

    .btn-block {
      width: 100%;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  registerForm: FormGroup;
  loading = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      organizationName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService.register(this.registerForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.success('¡Cuenta creada exitosamente!');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
  }

  get name() { return this.registerForm.get('name'); }
  get organizationName() { return this.registerForm.get('organizationName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}
