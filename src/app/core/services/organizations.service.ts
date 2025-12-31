import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Organization {
  id: string;
  name: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  plan?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {
  private readonly apiUrl = `${environment.apiUrl}/organizations`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de organizaciones
   */
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  /**
   * Obtiene una organización por ID
   * @param id - ID de la organización
   */
  getOrganizationById(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza una organización
   * @param id - ID de la organización
   * @param data - Datos a actualizar
   */
  updateOrganization(id: string, data: UpdateOrganizationDto): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/${id}`, data);
  }
}
