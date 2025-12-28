// src/app/core/models/interfaces.ts

import { 
  PlanType, 
  UserRole, 
  Platform, 
  SaleStatus, 
  PaymentStatus, 
  PaymentMethod, 
  ShipmentStatus, 
  ShipmentType,
  LiveItemStatus,
  AttributeType
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

// Product (Deprecated - usar LiveItems)
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

// ProductVariant (Deprecated - usar LiveItems)
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

// ===== NUEVO MODELO: LiveItems y Categorías =====

// ProductCategory
export interface ProductCategory {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  attributes?: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}

// CategoryAttribute
export interface CategoryAttribute {
  id: string;
  categoryId: string;
  name: string;
  type: AttributeType;
  isRequired: boolean;
  order: number;
  values?: AttributeValue[];
  createdAt: string;
}

// AttributeValue
export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
  hexCode: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// LiveItem (⭐ Core)
export interface LiveItem {
  id: string;
  organizationId: string;
  categoryId: string;
  category?: ProductCategory;
  livestreamId: string | null;
  price: number;
  quantity: number;
  status: LiveItemStatus;
  imageUrl: string | null;
  notes: string | null;
  attributes?: LiveItemAttributeValue[];
  createdAt: string;
  updatedAt: string;
}

// LiveItemAttributeValue
export interface LiveItemAttributeValue {
  id: string;
  liveItemId: string;
  attributeValueId: string | null;
  attributeValue?: AttributeValue;
  customValue: string | null;
  createdAt: string;
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

// Sale (Carrito/Venta)
export interface Sale {
  id: string;
  organizationId: string;
  livestreamId: string | null;
  customerId: string;
  Customer?: Customer;
  sellerId: string;
  seller?: User;
  status: SaleStatus; // 'reserved' = carrito, 'confirmed' = venta
  totalAmount: number;
  discountAmount: number;
  notes: string | null;
  SaleItem?: SaleItem[];
  payments?: Payment[];
  shipment?: Shipment;
  createdAt: string;
  updatedAt: string;
}

// SaleItem (actualizado para LiveItems)
export interface SaleItem {
  id: string;
  saleId: string;
  liveItemId: string;
  LiveItem?: LiveItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
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

// ===== LiveItems =====
export interface CreateLiveItemDto {
  categoryId: string;
  livestreamId?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  notes?: string;
  attributes: {
    attributeValueId?: string;
    customValue?: string;
  }[];
}

export interface UpdateLiveItemDto {
  price?: number;
  quantity?: number;
  imageUrl?: string;
  notes?: string;
  status?: LiveItemStatus;
}

// ===== Categories =====
export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateCategoryAttributeDto {
  name: string;
  type: AttributeType;
  isRequired: boolean;
  order?: number;
}

export interface CreateAttributeValueDto {
  value: string;
  hexCode?: string;
  order?: number;
}

// ===== Carts =====
export interface AddItemToCartDto {
  customerId: string;
  liveItemId: string;
  quantity: number;
  livestreamId?: string;
}

export interface CartResponse {
  id: string; // saleId
  customerId: string;
  customer?: Customer;
  livestreamId: string | null;
  items: SaleItem[];
  totalAmount: number;
  status: SaleStatus;
  createdAt: string;
  updatedAt: string;
}

// ===== Auth =====
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

// Cart (Carrito) for Live Mode
export interface Cart {
  customerId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  notes?: string;
}

// Cart Item
export interface CartItem {
  productVariantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Quick Add Product Form
export interface QuickAddProductForm {
  customerName: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
}
