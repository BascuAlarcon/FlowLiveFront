// src/app/features/sales/sales.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Sale, CreateSaleDto } from '@core/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private readonly apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  create(sale: CreateSaleDto): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, sale);
  }

  updateStatus(id: string, status: string): Observable<Sale> {
    return this.http.patch<Sale>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByLivestream(livestreamId: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}?livestreamId=${livestreamId}`);
  }
}
