// src/app/features/carts/carts.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AddItemToCartDto, CartResponse, Sale } from '@core/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  private readonly apiUrl = `${environment.apiUrl}/carts`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los carritos activos (status = 'reserved')
   */
  getActiveCarts(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  /**
   * Obtener el carrito de un cliente específico
   */
  getCustomerCart(customerId: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/customer/${customerId}`);
  }

  /**
   * Agregar un LiveItem al carrito de un cliente
   * Si el cliente no tiene carrito activo, se crea uno nuevo
   * Si ya tiene carrito, se agrega al existente
   */
  addItemToCart(data: AddItemToCartDto): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/items`, data);
  }

  /**
   * Quitar un item del carrito
   * Libera el LiveItem (status vuelve a 'available')
   */
  removeItemFromCart(cartId: string, itemId: string): Observable<Sale> {
    return this.http.delete<Sale>(`${this.apiUrl}/${cartId}/items/${itemId}`);
  }

  /**
   * Confirmar carrito (convertir a venta)
   * - Sale status: reserved → confirmed
   * - LiveItems status: reserved → sold
   * - Ya no se puede editar
   */
  confirmCart(cartId: string): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/${cartId}/confirm`, {});
  }

  /**
   * Cancelar carrito
   * - Sale status: reserved → cancelled
   * - LiveItems status: reserved → available
   * - Items quedan disponibles para otros clientes
   */
  cancelCart(cartId: string): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/${cartId}/cancel`, {});
  }
}
