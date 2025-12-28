// src/app/features/liveitems/liveitems.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  LiveItem, 
  CreateLiveItemDto, 
  UpdateLiveItemDto 
} from '@core/models/interfaces';

export interface LiveItemsFilters {
  status?: 'available' | 'reserved' | 'sold';
  categoryId?: string;
  livestreamId?: string;
  page?: number;
  limit?: number;
}

export interface LiveItemsStats {
  totalItems: number;
  available: number;
  reserved: number;
  sold: number;
  totalValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class LiveItemsService {
  private readonly apiUrl = `${environment.apiUrl}/liveitems`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los LiveItems con filtros opcionales
   */
  getAll(filters?: LiveItemsFilters): Observable<LiveItem[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
      if (filters.livestreamId) params = params.set('livestreamId', filters.livestreamId);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<LiveItem[]>(this.apiUrl, { params });
  }

  /**
   * Obtener estadísticas de LiveItems
   */
  getStats(): Observable<LiveItemsStats> {
    return this.http.get<LiveItemsStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Obtener un LiveItem por ID
   */
  getById(id: string): Observable<LiveItem> {
    return this.http.get<LiveItem>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo LiveItem
   */
  create(liveItem: CreateLiveItemDto): Observable<LiveItem> {
    return this.http.post<LiveItem>(this.apiUrl, liveItem);
  }

  /**
   * Actualizar un LiveItem
   */
  update(id: string, liveItem: UpdateLiveItemDto): Observable<LiveItem> {
    return this.http.patch<LiveItem>(`${this.apiUrl}/${id}`, liveItem);
  }

  /**
   * Eliminar un LiveItem
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Agregar atributo a un LiveItem
   */
  addAttribute(liveItemId: string, attributeData: { attributeValueId?: string; customValue?: string }): Observable<LiveItem> {
    return this.http.post<LiveItem>(`${this.apiUrl}/${liveItemId}/attributes`, attributeData);
  }

  /**
   * Eliminar atributo de un LiveItem
   */
  removeAttribute(liveItemId: string, attributeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${liveItemId}/attributes/${attributeId}`);
  }
}
