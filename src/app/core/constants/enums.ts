// src/app/core/constants/enums.ts

export enum UserRole { 
  JEFATURA_OTIC = 'jefaturaOTIC',
  EJECUTIVO_COMERCIAL = 'ejecutivoComercial',
  JEFATURA_FUTURO_DEL_TRABAJO = 'jefaturaFuturoDelTrabajo',
  SUBGERENTE_GESTION_PERSONAS = 'subgerenteGestionPersonas',
  COORDINADORA_SELECCION = 'coordinadoraSeleccion',
  COORDINADORA_INGRESO = 'coordinadoraIngreso',
  ANALISTA_SELECCION_DO = 'analistaSeleccionDO',
  ASISTENTE_GESTION_PERSONAS = 'asistenteGestionPersonas',
  CANDIDATO = 'candidato',
}


export enum PlanType {
    FREE = 'free',
    PRO = 'pro',
    BRAND = 'brand'
}

export enum UserRole {
    ADMIN = 'admin', // admin podrá ver todo
    SUPPERADMIN = 'superadmin', // admin podrá ver todo
    OWNER = 'owner',
    SELLER = 'seller',
    MODERATOR = 'moderator',
    LOGISTICS = 'logistics'
}

export enum Platform {
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  OTHER = 'other'
}

export enum SaleStatus {
  RESERVED = 'reserved',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum PaymentMethod {
  TRANSFER = 'transfer',
  CASH = 'cash',
  MERCADOPAGO = 'mercadopago',
  PAYPAL = 'paypal'
}

export enum ShipmentStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export enum ShipmentType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup'
}

export enum LiveItemStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold'
}

export enum AttributeType {
  SELECT = 'select',
  TEXT = 'text',
  NUMBER = 'number'
}

export enum MessageType {
  ORDER_CONFIRMED = 'order_confirmed',
  PAYMENT_REMINDER = 'payment_reminder',
  SHIPPED = 'shipped',
  CUSTOM = 'custom'
}

// Helpers para UI
export const LIVEITEM_STATUS_LABELS: Record<LiveItemStatus, string> = {
  [LiveItemStatus.AVAILABLE]: 'Disponible',
  [LiveItemStatus.RESERVED]: 'Reservado',
  [LiveItemStatus.SOLD]: 'Vendido'
};

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SaleStatus.RESERVED]: 'Carrito Activo',
  [SaleStatus.CONFIRMED]: 'Venta Confirmada',
  [SaleStatus.CANCELLED]: 'Cancelada'
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.FAILED]: 'Fallido'
};

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PENDING]: 'Pendiente',
  [ShipmentStatus.PREPARING]: 'Preparando',
  [ShipmentStatus.SHIPPED]: 'Enviado',
  [ShipmentStatus.DELIVERED]: 'Entregado'
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.TRANSFER]: 'Transferencia',
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.MERCADOPAGO]: 'MercadoPago',
  [PaymentMethod.PAYPAL]: 'PayPal'
};

// Colores para badges
export const LIVEITEM_STATUS_COLORS: Record<LiveItemStatus, string> = {
  [LiveItemStatus.AVAILABLE]: 'success',
  [LiveItemStatus.RESERVED]: 'warning',
  [LiveItemStatus.SOLD]: 'secondary'
};

export const SALE_STATUS_COLORS: Record<SaleStatus, string> = {
  [SaleStatus.RESERVED]: 'warning',
  [SaleStatus.CONFIRMED]: 'success',
  [SaleStatus.CANCELLED]: 'danger'
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.FAILED]: 'danger'
};
