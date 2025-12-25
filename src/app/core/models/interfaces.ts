// src/app/core/models/interfaces.ts

import { 
  PlanType, 
  UserRole, 
  Platform, 
  SaleStatus, 
  PaymentStatus, 
  PaymentMethod, 
  ShipmentStatus, 
  ShipmentType 
} from '../constants/enums';

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  organizations: Organization[];
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Organization
export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product
export interface Product {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  basePrice: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
  stockQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

// ProductVariant
export interface ProductVariant {
  id: string;
  productId: string;
  organizationId: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Customer
export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  username: string | null;
  contact: string | null;
  notes: string | null;
  lastPurchaseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Livestream
export interface Livestream {
  id: string;
  organizationId: string;
  title: string;
  platform: Platform;
  viewerCount: number | null;
  totalSalesAmount: number | null;
  startedAt: string;
  endedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Sale
export interface Sale {
  id: string;
  organizationId: string;
  livestreamId: string | null;
  customerId: string;
  customer?: Customer;
  sellerId: string;
  seller?: User;
  status: SaleStatus;
  totalAmount: number;
  discountAmount: number;
  notes: string | null;
  items?: SaleItem[];
  payments?: Payment[];
  shipment?: Shipment;
  createdAt: string;
  updatedAt: string;
}

// SaleItem
export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product;
  productVariantId: string;
  productVariant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

// Payment
export interface Payment {
  id: string;
  saleId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Shipment
export interface Shipment {
  id: string;
  saleId: string;
  type: ShipmentType;
  status: ShipmentStatus;
  address: string | null;
  trackingCode: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  organizationName: string;
}

export interface LoginResponse {
    data: DataResponse;
}

interface DataResponse{
    token: string;
    user: User;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  basePrice: number;
  sku: string;
  imageUrl?: string;
  stockQuantity?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  basePrice?: number;
  imageUrl?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export interface CreateCustomerDto {
  name: string;
  username?: string;
  contact?: string;
  notes?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  username?: string;
  contact?: string;
  notes?: string;
}

export interface CreateSaleDto {
  customerId: string;
  livestreamId?: string;
  items: {
    productVariantId: string;
    quantity: number;
    unitPrice: number;
  }[];
  discountAmount?: number;
  notes?: string;
}

export interface CreatePaymentDto {
  saleId: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
}

export interface CreateShipmentDto {
  saleId: string;
  type: ShipmentType;
  address?: string;
}

export interface StartLivestreamDto {
  title: string;
  platform: Platform;
}

// Metrics
export interface MonthlyMetrics {
  totalSales: number;
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  averageTicket: number;
  topProducts: ProductMetric[];
}

export interface DailyMetrics {
  date: string;
  totalSales: number;
  totalRevenue: number;
}

export interface ProductMetric {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

// Live Session
export interface LiveSession {
  livestreamId?: string;
  startedAt: Date;
  totalSales: number;
  totalAmount: number;
  pendingSales: number;
}
