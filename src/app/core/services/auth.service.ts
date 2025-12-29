// src/app/core/services/auth.service.ts

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { JwtPayload, LoginDto, LoginResponse, RegisterDto, User } from '../models/interfaces';
import { StorageService } from './storage.service';
import { UserRole } from '@core/constants/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  // Signals para estado reactivo
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  organizationId = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

    private readonly ROLE_KEY = 'userRole';

  /**
   * Guarda el rol del usuario en localStorage
   * @param role - Rol del usuario
   */
  setUserRole(role: UserRole): void {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  /**
   * Obtiene el rol del usuario desde localStorage
   * @returns El rol del usuario o UserRole.GUEST si no existe
   */
  getUserRole(): UserRole {
    return (localStorage.getItem(this.ROLE_KEY) as UserRole);
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param role - Un rol o array de roles permitidos
   * @returns true si el usuario tiene el rol, false en caso contrario
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    const userRole = this.getUserRole();
    console.log("AuthService - User Role:", userRole);
    return Array.isArray(role) ? role.includes(userRole) : role === userRole;
  }

  /**
   * Limpia el rol del usuario del localStorage
   */
  clearUserRole(): void {
    localStorage.removeItem(this.ROLE_KEY);
  } 

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(data: RegisterDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.organizationId.set(null);
    this.router.navigate(['/auth/login']);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  private handleAuthSuccess(response: LoginResponse): void { 
    
    this.storage.saveToken(response.data.token);
    this.storage.saveUser(response.data.user);
    
    const payload = this.decodeToken(response.data.token);
    
    this.currentUser.set(response.data.user);
    this.isAuthenticated.set(true);
    this.organizationId.set(payload?.organizationId || null); 
    console.log(this.currentUser());
    
    this.setUserRole(this.currentUser()!.organizations[0].role as UserRole);
    console.log("User role set to:", this.getUserRole());
  }

  private checkAuthStatus(): void {
    const token = this.storage.getToken();
    const user = this.storage.getUser();

    if (token && user) {
      const payload = this.decodeToken(token);
      
      if (payload && !this.isTokenExpired(payload)) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.organizationId.set(payload.organizationId);
      } else {
        this.logout();
      }
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private isTokenExpired(payload: JwtPayload): boolean {
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  getOrganizationId(): string | null {
    return this.organizationId();
  }
}
