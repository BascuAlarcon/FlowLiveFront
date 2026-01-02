// src/app/features/livestreams/livestreams.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Livestream, StartLivestreamDto } from '@core/models/interfaces';

export interface CreateLivestreamDto {
  title: string;
  platform: string;
  viewerCount?: number;
  moderatorId?: string;
}

export interface UpdateLivestreamDto {
  title?: string;
  viewerCount?: number;
}

export interface CloseLivestreamDto {
  viewerCount?: number;
}

export interface LivestreamStats {
  totalItems: number;
  soldItems: number;
  totalRevenue: number;
  averageItemPrice: number;
  conversionRate: number;
}

export interface LivestreamDetailedStats {
  livestream: {
    id: string;
    title: string;
    platform: 'instagram' | 'tiktok' | 'youtube' | 'other';
    viewerCount: number;
    startedAt: string;
    endedAt: string | null;
    isActive: boolean;
  };
  stats: {
    totalSales: number;
    confirmedSales: number;
    pendingSales: number;
    cancelledSales: number;
    totalRevenue: number;
    totalUnitsSold: number;
    averageTicket: number;
    durationMinutes: number;
    isActive: boolean;
    totalEstimatedAmount: number;
    totalClosedAmount: number;
    averageCartAmount: number;
    averageProductsPerCart: number;
    closureRate: number;
    totalCustomers: number;
    totalProductsSold: number;
    averageProductsPerCustomer: number;
  };
  topProducts: Array<{
    liveItemId: string;
    categoryName: string;
    price: number;
    quantity: number;
    totalRevenue: number;
    imageUrl: string | null;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalPurchases: number;
    totalSpent: number;
    productsCount: number;
  }>;
  attributesWithPercentages: {
    [attributeName: string]: Array<{
      value: string;
      count: number;
      revenue: number;
      percentage: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LivestreamsService {
  private readonly apiUrl = `${environment.apiUrl}/livestreams`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los livestreams
   */
  getAll(): Observable<Livestream[]> {
    return this.http.get<Livestream[]>(this.apiUrl);
  }

  /**
   * Obtener livestream activo
   */
  getActive(): Observable<Livestream | null> {
    return this.http.get<Livestream | null>(`${this.apiUrl}/active`);
  }

  /**
   * Obtener un livestream por ID
   */
  getById(id: string): Observable<Livestream> {
    return this.http.get<Livestream>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo livestream
   */
  create(data: CreateLivestreamDto): Observable<Livestream> {
    return this.http.post<Livestream>(this.apiUrl, data);
  }

  /**
   * Actualizar un livestream
   */
  update(id: string, data: UpdateLivestreamDto): Observable<Livestream> {
    return this.http.put<Livestream>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Cerrar un livestream
   */
  close(id: string, data: CloseLivestreamDto): Observable<Livestream> {
    return this.http.post<Livestream>(`${this.apiUrl}/${id}/close`, data);
  }

  /**
   * Obtener estadísticas de un livestream
   */
  getStats(id: string): Observable<LivestreamStats> {
    return this.http.get<LivestreamStats>(`${this.apiUrl}/${id}/stats`);
  }

  /**
   * Obtener estadísticas detalladas de un livestream
   */
  getDetailedStats(id: string): Observable<{success: boolean; data: LivestreamDetailedStats}> {
    return this.http.get<{success: boolean; data: LivestreamDetailedStats}>(`${this.apiUrl}/${id}/stats`);
  }

  // Métodos legacy para compatibilidad
  start(data: StartLivestreamDto): Observable<Livestream> {
    return this.create(data as CreateLivestreamDto);
  }

  end(id: string): Observable<Livestream> {
    return this.close(id, {});
  }
}
