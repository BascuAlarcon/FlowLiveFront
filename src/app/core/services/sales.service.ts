import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Sale {
  id: string;
  customerId: string;
  sellerId: string;
  livestreamId: string;
  items: SaleItem[];
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSaleDto {
  customerId: string;
  sellerId: string;
  livestreamId: string;
  items: SaleItem[];
  notes?: string;
}

export interface UpdateSaleDto {
  status?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private readonly apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las ventas
   */
  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  /**
   * Obtiene una venta por ID
   * @param id - ID de la venta
   */
  getById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva venta
   * @param data - Datos de la venta
   */
  create(data: CreateSaleDto): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, data);
  }

  /**
   * Actualiza una venta
   * @param id - ID de la venta
   * @param data - Datos a actualizar
   */
  update(id: string, data: UpdateSaleDto): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Elimina una venta
   * @param id - ID de la venta
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
