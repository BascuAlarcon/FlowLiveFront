import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  totalLivestreams: number;
  activeLivestreams: number;
  averageOrderValue: number;
  topSellingProducts: TopProduct[];
  recentSales: RecentSale[];
}

export interface SalesMetrics {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  salesByDay: SalesByDay[];
  salesByMonth: SalesByMonth[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
}

export interface RecentSale {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface SalesByDay {
  date: string;
  sales: number;
  revenue: number;
}

export interface SalesByMonth {
  month: string;
  sales: number;
  revenue: number;
}

export interface PaymentMetrics {
  totalPending: number;
  totalConfirmed: number;
  totalCancelled: number;
  paymentMethods: PaymentMethodMetric[];
}

export interface PaymentMethodMetric {
  method: string;
  count: number;
  totalAmount: number;
}

export interface LivestreamMetrics {
  livestreamId: string;
  title: string;
  totalSales: number;
  totalRevenue: number;
  viewerCount: number;
  conversionRate: number;
  date: string;
}

export interface MonthlyMetrics {
  month: string;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  livestreamsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly apiUrl = `${environment.apiUrl}/metrics`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las métricas generales del dashboard
   */
  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard`);
  }

  /**
   * Obtiene métricas de ventas por período
   * @param startDate - Fecha inicial (formato: YYYY-MM-DD)
   * @param endDate - Fecha final (formato: YYYY-MM-DD)
   */
  getSalesMetrics(startDate?: string, endDate?: string): Observable<SalesMetrics> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    
    return this.http.get<SalesMetrics>(`${this.apiUrl}/sales`, { params });
  }

  /**
   * Obtiene los productos más vendidos
   * @param limit - Número máximo de productos a retornar
   */
  getTopProducts(limit: number = 10): Observable<TopProduct[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-products`, { params });
  }

  /**
   * Obtiene los mejores clientes por monto gastado
   * @param limit - Número máximo de clientes a retornar
   */
  getTopCustomers(limit: number = 10): Observable<TopCustomer[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TopCustomer[]>(`${this.apiUrl}/top-customers`, { params });
  }

  /**
   * Obtiene métricas de pagos por estado y método
   */
  getPaymentMetrics(): Observable<PaymentMetrics> {
    return this.http.get<PaymentMetrics>(`${this.apiUrl}/payments`);
  }

  /**
   * Obtiene métricas de livestreams ordenados por ventas
   * @param limit - Número máximo de livestreams a retornar
   */
  getLivestreamMetrics(limit: number = 10): Observable<LivestreamMetrics[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<LivestreamMetrics[]>(`${this.apiUrl}/livestreams`, { params });
  }

  /**
   * Obtiene métricas mensuales
   * @param month - Mes en formato YYYY-MM
   */
  getMonthlyMetrics(month: string): Observable<MonthlyMetrics> {
    const params = new HttpParams().set('month', month);
    return this.http.get<MonthlyMetrics>(`${this.apiUrl}/monthly`, { params });
  }
}
