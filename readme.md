## todo
agregar header
  notificaciones, perfil conectado, live y logo
header
  directos
    tabla
      detalle
mantenedor
  usuarios
  productos
live
  función clave de la aplicación
  La pantalla se separa en 2, a la izquierda estan los "carritos" y a la derecha esta la 
  sección que permite agregar un producto al "carrito"
    La secció derecha, será pickers de opciones:
      Comprador: Nombre de la persona (habrá una parte para elegir los compradores de este mismo live y poder seleccionarlos, si el nombre es nuevo, un nuevo carro, si no, se agrega al carro de esa persona)
      Producto : Polera / Pantalon / Poleron / ETC (mantenedor)
      Color    : Rojo / Azul / Morado / Rosado / ETC (mantenedor)
      Talla    : S / M / L / ETC (mantenedor)
      Precio   : Esto se escribe (es el precio de venta)
      Cantidad : Cantidad que se vende
  Al presionar un carrito, se habré un modal con los datos de la persona y los productos, estos se podrán modificar
  Debe dar la sensación de que se esta en "Live"
    Cronometro de tiempo
    Tit-Tac rojo que diga Live
    Monto total recaudado hasta entonces
    Unidades totales vendidas hasta entonces
    Nombre vendedor y nombre de quien hace la gestión
  Botón para "Cerrar Live", se registran los datos del live 
    Al cerrar el live se congelan las ventas (sólo un usuario con poder debería poder modificarlo)
    Los datos cuentan para métricas y funcionalidades como notificaciones
  Se debe poder filtrar por carritos
  Los carritos tienen estados: Pendientes | Pagado | Cancelado


# Live Commerce SaaS – Frontend

Frontend para una plataforma SaaS orientada a marcas, tiendas y vendedores que realizan ventas en vivo (livestream shopping) en plataformas como Instagram Live y TikTok Live.

La aplicación permite gestionar ventas en tiempo real, clientes, productos, pagos, envíos, métricas y múltiples usuarios por organización, consumiendo una API REST.

---

## 🧱 Stack Tecnológico

- Angular (v17+)
- TypeScript
- RxJS
- Angular Material / Tailwind CSS
- Angular Forms (Reactive)
- JWT Authentication (LocalStorage/SessionStorage)
- HttpClient (HTTP Interceptors)
- Angular Router
- Chart.js / ng2-charts (métricas)
- Signals (para estado reactivo)

---

## 🧠 Contexto del Negocio (IMPORTANTE)

Esta aplicación es **multi-organización (multi-tenant)**:

- Cada usuario pertenece a una o más organizaciones
- El token JWT contiene `organizationId` que se envía en cada request
- Todo dato de negocio (ventas, LiveItems, clientes, livestreams) está asociado a una organización
- No debe existir acceso cruzado entre organizaciones en la UI

### Modelo de Negocio: Live Shopping

✅ **Items individuales**: Cada producto mostrado es único o tiene pocas unidades (1-3)  
✅ **Sin inventario tradicional**: No hay stock de "productos" sino LiveItems individuales que están disponibles, reservados o vendidos  
✅ **Carritos persistentes**: Un cliente puede pedir items en varios lives diferentes y todo se acumula en un solo carrito hasta que pague  
✅ **Categorías dinámicas**: Los atributos varían según la categoría (ropa tiene talla/color, joyas tienen material/tamaño, etc.)

El foco principal es **ventas durante livestreams**, por lo que la UI debe priorizar:
- rapidez y fluidez
- formularios simples
- acciones en pocos clicks
- feedback inmediato
- actualización en tiempo real
- modo "live" optimizado para móvil

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── organization.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── notification.service.ts
│   │   ├── models/
│   │   │   └── interfaces.ts (tipos compartidos)
│   │   └── constants/
│   │       └── enums.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.service.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.service.ts
│   │   ├── categories/
│   │   │   ├── category-list/
│   │   │   ├── category-form/
│   │   │   └── categories.service.ts
│   │   ├── liveitems/
│   │   │   ├── liveitem-list/
│   │   │   ├── liveitem-form/
│   │   │   └── liveitems.service.ts
│   │   ├── customers/
│   │   │   ├── customer-list/
│   │   │   ├── customer-form/
│   │   │   └── customers.service.ts
│   │   ├── carts/
│   │   │   ├── cart-list/
│   │   │   ├── cart-detail/
│   │   │   └── carts.service.ts
│   │   ├── sales/
│   │   │   ├── sale-list/
│   │   │   ├── sale-form/
│   │   │   ├── sale-detail/
│   │   │   └── sales.service.ts
│   │   ├── live-mode/
│   │   │   ├── live-mode.component.ts (CORE - modo livestream)
│   │   │   ├── quick-sale/
│   │   │   └── live-stats/
│   │   ├── payments/
│   │   │   └── payments.service.ts
│   │   ├── shipments/
│   │   │   ├── shipment-list/
│   │   │   └── shipments.service.ts
│   │   ├── livestreams/
│   │   │   ├── livestream-list/
│   │   │   └── livestreams.service.ts
│   │   └── metrics/
│   │       ├── metrics-dashboard/
│   │       └── metrics.service.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   ├── loader/
│   │   │   └── confirm-dialog/
│   │   ├── pipes/
│   │   │   ├── currency-format.pipe.ts
│   │   │   └── date-format.pipe.ts
│   │   └── directives/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.css
```

### Principios de Arquitectura:
- **Core**: Servicios singleton, guards, interceptors (providedIn: 'root')
- **Features**: Módulos lazy-loaded por funcionalidad
- **Shared**: Componentes, pipes, directivas reutilizables
- **Standalone Components**: Usar componentes standalone (Angular 17+)
- **Signals**: Para estado reactivo y performance

---

## 🔐 Autenticación y Autorización

- Autenticación con JWT almacenado en LocalStorage
- `AuthGuard` para proteger rutas privadas
- `AuthInterceptor` que:
  - agrega `Authorization: Bearer <token>` a cada request
  - agrega `X-Organization-Id` header con el organizationId del token
  - maneja refresh token (opcional MVP)
- `ErrorInterceptor` para manejar:
  - 401: redirigir a login
  - 403: mostrar mensaje de acceso denegado
  - 500: mostrar error genérico

Roles soportados (para UI condicional):
- owner: acceso total
- seller: crear ventas, ver productos
- moderator: ver todo, sin modificar
- logistics: solo envíos

### Estructura del Token JWT (decodificado):
```typescript
interface JwtPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: UserRole;
  iat: number;
  exp: number;
}
```

---

## 🔌 Integración con API

### Base URL
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Estructura de Servicios

Cada servicio debe:
- Usar `HttpClient`
- Retornar `Observable<T>`
- Manejar errores con `catchError`
- Usar interfaces tipadas

Ejemplo:
```typescript
@Injectable({ providedIn: 'root' })
export class LiveItemsService {
  private apiUrl = `${environment.apiUrl}/liveitems`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { status?: string; categoryId?: string; livestreamId?: string }): Observable<LiveItem[]> {
    return this.http.get<LiveItem[]>(this.apiUrl, { params: filters as any });
  }

  getById(id: string): Observable<LiveItem> {
    return this.http.get<LiveItem>(`${this.apiUrl}/${id}`);
  }

  create(liveItem: CreateLiveItemDto): Observable<LiveItem> {
    return this.http.post<LiveItem>(this.apiUrl, liveItem);
  }

  update(id: string, liveItem: UpdateLiveItemDto): Observable<LiveItem> {
    return this.http.patch<LiveItem>(`${this.apiUrl}/${id}`, liveItem);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

---

## 📱 Componentes Principales

### 1. Login/Register
- Formularios reactivos con validación
- Guardar JWT en LocalStorage al login exitoso
- Decodificar JWT y extraer `organizationId` y `role`
- Redirigir a dashboard

### 2. Dashboard
- Métricas del mes actual
- Ventas pendientes de pago
- Total vendido hoy
- Gráficos con Chart.js

### 3. Categorías
- Lista de categorías de productos
- CRUD completo
- Gestión de atributos dinámicos (Color, Talla, Material, etc.)
- Valores de atributos por categoría

### 4. LiveItems (Items para Vender)
- Lista con búsqueda y filtros por estado, categoría, livestream
- Crear items individuales con atributos dinámicos
- Ver estado: disponible, reservado, vendido
- Asociar items a livestreams
- Editar precio y atributos

### 5. Clientes
- Lista con búsqueda
- Registro rápido durante venta
- Ver historial de compras

### 6. Carritos (⭐ Core del Sistema)
- Ver carritos activos (status: reserved)
- Carrito por cliente (persistente entre lives)
- Agregar LiveItems al carrito durante transmisiones
- Ver items reservados en el carrito
- Confirmar carrito → convierte a venta (status: confirmed)
- Cancelar carrito → libera items

### 7. Ventas
- Lista con filtros por estado, fecha, cliente
- Ver detalle de venta confirmada
- Registrar pagos
- Ver estado de envío
- Ventas provienen de carritos confirmados

### 8. 🔴 Modo Live (DIFERENCIADOR)
**Componente optimizado para usar durante transmisiones:**

Features:
- Vista simplificada (sin menú completo)
- Búsqueda rápida de LiveItems disponibles
- Ver estado de items en tiempo real (disponible/reservado/vendido)
- Agregar items a carritos en 2 pasos:
  1. Seleccionar cliente (o crear rápido)
  2. Seleccionar LiveItem → agregar al carrito
- Ver carritos activos en la sesión
- Ver total vendido en la sesión
- Timer del livestream
- Optimizado para móvil (touch-friendly)
- Pantalla dividida: carritos a la izquierda, selector de items a la derecha

```typescript
interface LiveSession {
  livestreamId?: string;
  startedAt: Date;
  totalSales: number;
  totalAmount: number;
  pendingSales: number;
}
```

### 9. Livestreams
- Iniciar/finalizar livestream
- Ver carritos y ventas asociados al livestream
- Métricas por livestream

### 10. Métricas
- Dashboard con gráficos
- Filtros por fecha
- Total vendido vs pagado
- Top productos
- Ticket promedio

---

## 🗄️ Modelo de Datos (Interfaces TypeScript)

El frontend debe replicar los modelos del backend como interfaces TypeScript.

### Tipos de Datos Estándar
- **IDs**: `string` (cuid del backend)
- **Precios/Montos**: `number` (se reciben como string del backend, convertir a number)
- **Timestamps**: `string` (ISO 8601, convertir a Date cuando sea necesario)
- **Enums**: TypeScript enums (ver sección Enums)

### Interfaces Principales

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

#### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### ProductCategory
```typescript
interface ProductCategory {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  attributes?: CategoryAttribute[]; // populated
  createdAt: string;
  updatedAt: string;
}
```

#### CategoryAttribute
```typescript
interface CategoryAttribute {
  id: string;
  categoryId: string;
  name: string;
  type: AttributeType; // 'select' | 'text' | 'number'
  isRequired: boolean;
  order: number;
  values?: AttributeValue[]; // populated
  createdAt: string;
}
```

#### AttributeValue
```typescript
interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
  hexCode: string | null; // para colores
  order: number;
  isActive: boolean;
  createdAt: string;
}
```

#### LiveItem (⭐ Core)
```typescript
interface LiveItem {
  id: string;
  organizationId: string;
  categoryId: string;
  category?: ProductCategory; // populated
  livestreamId: string | null;
  price: number;
  quantity: number; // típicamente 1-3
  status: LiveItemStatus; // 'available' | 'reserved' | 'sold'
  imageUrl: string | null;
  notes: string | null;
  attributes?: LiveItemAttributeValue[]; // populated
  createdAt: string;
  updatedAt: string;
}
```

#### LiveItemAttributeValue
```typescript
interface LiveItemAttributeValue {
  id: string;
  liveItemId: string;
  attributeValueId: string;
  attributeValue?: AttributeValue; // populated
  customValue: string | null; // para atributos tipo 'text' o 'number'
  createdAt: string;
}
```

#### Customer
```typescript
interface Customer {
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
```

#### Livestream
```typescript
interface Livestream {
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
```

#### Sale (Carrito/Venta)
```typescript
interface Sale {
  id: string;
  organizationId: string;
  livestreamId: string | null;
  customerId: string;
  customer?: Customer; // populated
  sellerId: string;
  seller?: User; // populated
  status: SaleStatus; // 'reserved' (carrito) | 'confirmed' (venta) | 'cancelled'
  totalAmount: number;
  discountAmount: number;
  notes: string | null;
  items?: SaleItem[]; // populated
  payments?: Payment[]; // populated
  shipment?: Shipment; // populated
  createdAt: string;
  updatedAt: string;
}

/**
 * NOTA: Sale funciona como:
 * - Carrito cuando status = 'reserved' (editable, items reservados)
 * - Venta cuando status = 'confirmed' (no editable, items vendidos)
 * - Un cliente solo puede tener 1 carrito activo a la vez
 * - El carrito persiste entre diferentes livestreams
 */
```

#### SaleItem
```typescript
interface SaleItem {
  id: string;
  saleId: string;
  liveItemId: string;
  liveItem?: LiveItem; // populated
  quantity: number; // cantidad del LiveItem
  unitPrice: number; // precio al momento de agregar
  totalPrice: number; // unitPrice * quantity
  notes: string | null;
  createdAt: string;
}
```

#### Payment
```typescript
interface Payment {
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
```

#### Shipment
```typescript
interface Shipment {
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
```

### DTOs (Data Transfer Objects)

```typescript
interface AddItemToCartDto {
  customerId: string;
  liveItemId: string;
  quantity: number;
  livestreamId?: string;
}

interface CreateLiveItemDto {
  categoryId: string;
  livestreamId?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  notes?: string;
  attributes: {
    attributeValueId?: string; // para atributos tipo 'select'
    customValue?: string; // para atributos tipo 'text' o 'number'
  }[];
}

interface CreateCategoryDto {
  name: string;
  description?: string;
}

interface CreatePaymentDto {
  saleId: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
}

interface CreateCustomerDto {
  name: string;
  username?: string;
  contact?: string;
}
```

---

## 🎨 ENUMS (TypeScript)

```typescript
// src/app/core/constants/enums.ts

export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  BRAND = 'brand'
}

export enum UserRole {
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

export enum MessageType {
  ORDER_CONFIRMED = 'order_confirmed',
  PAYMENT_REMINDER = 'payment_reminder',
  SHIPPED = 'shipped',
  CUSTOM = 'custom'
}
```

### Helpers para Enums

```typescript
// Traducción de estados para UI
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
```

---

## 🛒 Carritos y Ventas (Core del sistema)

### Concepto Clave: Carritos Persistentes

Un **Sale** puede ser:
- **Carrito** cuando `status = 'reserved'` (editable)
- **Venta** cuando `status = 'confirmed'` (no editable)

### Reglas de Negocio:

✅ **Un cliente puede tener SOLO 1 carrito activo** (`status=reserved`) a la vez  
✅ **El carrito persiste entre diferentes livestreams**  
✅ **Items de varios lives se acumulan en el mismo carrito**  
✅ **LiveItems pasan de `available` → `reserved` al agregar al carrito**  
✅ **LiveItems pasan de `reserved` → `sold` al confirmar el carrito**

### Estados y acciones permitidas:

**RESERVED (Carrito Activo)**
- ✅ Agregar más LiveItems
- ✅ Quitar items (libera LiveItems)
- ✅ Registrar pago parcial
- ✅ Confirmar carrito → convierte a venta
- ✅ Cancelar → libera todos los LiveItems
- ⚠️ LiveItems en estado `reserved`

**CONFIRMED (Venta Confirmada)**
- ✅ Ver detalle
- ✅ Crear envío
- ✅ Imprimir
- ❌ No se puede editar
- ✅ LiveItems en estado `sold`

**CANCELLED (Cancelada)**
- 👁️ Solo lectura
- ℹ️ LiveItems liberados

### Flujo UI para Agregar Items a Carrito (Durante Live)

```typescript
// 1. Seleccionar cliente
SelectCustomerComponent
  - Buscar cliente existente (muestra si tiene carrito activo)
  - Botón "Crear cliente rápido" (modal)
  - Automáticamente obtiene o crea su carrito

// 2. Seleccionar LiveItem
SelectLiveItemComponent
  - Listar LiveItems disponibles (status='available')
  - Filtrar por categoría
  - Ver atributos (color, talla, etc.)
  - Ver precio
  - Botón "Agregar al Carrito"

// 3. Agregar al carrito
API: POST /api/carts/items
  {
    customerId: "...",
    liveItemId: "...",
    quantity: 1,
    livestreamId: "..."
  }
  
  Resultado:
  - LiveItem pasa a estado 'reserved'
  - Se agrega al carrito del cliente
  - UI actualiza vista de carritos activos
```

### Componente de Pago (Confirmar Carrito)

```typescript
// Modal para registrar pago y confirmar carrito
RegisterPaymentComponent {
  cartId: string; // Sale con status='reserved'
  totalAmount: number;
  
  form: {
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }
}
```

**Validaciones:**
- `amount` no puede ser mayor que el total
- Si `amount` >= `totalAmount`: confirmar carrito automáticamente
- Backend cambiará Sale a `status='confirmed'`
- Backend cambiará todos los LiveItems a `status='sold'`
- Deshabilitar botón si `amount <= 0`

---

## 📺 Livestreams

Los livestreams en la UI sirven para:
- Activar el "Modo Live"
- Agrupar ventas de una transmisión
- Ver métricas en tiempo real durante el live

### Componente de Livestream

```typescript
interface LivestreamSession {
  id: string;
  title: string;
  platform: Platform;
  startedAt: Date;
  isActive: boolean; // endedAt === null
}

// LiveModeComponent
- Mostrar timer desde startedAt
- Total vendido en esta sesión
- Botón "Finalizar Live"
- Todas las ventas creadas se asocian automáticamente
```

### Iniciar Livestream

```typescript
StartLivestreamComponent {
  form: {
    title: string;
    platform: Platform;
  }
  
  onSubmit() {
    this.livestreamsService.start(this.form).subscribe(livestream => {
      // Guardar livestreamId en servicio global
      // Activar "Modo Live"
      // Redirigir a /live-mode
    });
  }
}
```

---

## 📊 Métricas

Las métricas se calculan en el backend y se consumen via API.

### MetricsService

```typescript
@Injectable({ providedIn: 'root' })
export class MetricsService {
  getMonthlyMetrics(year: number, month: number): Observable<MonthlyMetrics> {
    return this.http.get<MonthlyMetrics>(`${this.apiUrl}/metrics/monthly`, {
      params: { year, month }
    });
  }

  getDailyMetrics(startDate: string, endDate: string): Observable<DailyMetrics[]> {
    return this.http.get<DailyMetrics[]>(`${this.apiUrl}/metrics/daily`, {
      params: { startDate, endDate }
    });
  }

  getTopProducts(limit: number = 10): Observable<ProductMetric[]> {
    return this.http.get<ProductMetric[]>(`${this.apiUrl}/metrics/top-products`, {
      params: { limit }
    });
  }
}
```

### Interfaces de Métricas

```typescript
interface MonthlyMetrics {
  totalSales: number;
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  averageTicket: number;
  topProducts: ProductMetric[];
}

interface DailyMetrics {
  date: string;
  totalSales: number;
  totalRevenue: number;
}

interface ProductMetric {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}
```

### Componente de Dashboard

Usar **Chart.js** o **ng2-charts** para:
- Gráfico de líneas: ventas por día
- Gráfico de barras: top productos
- Cards con números principales
- Filtros por fecha

```typescript
@Component({
  selector: 'app-metrics-dashboard',
  template: `
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Total Vendido</h3>
        <p class="amount">{{ metrics()?.totalRevenue | currency }}</p>
      </div>
      <div class="metric-card">
        <h3>Ticket Promedio</h3>
        <p class="amount">{{ metrics()?.averageTicket | currency }}</p>
      </div>
      <!-- más cards -->
    </div>
    
    <canvas baseChart [data]="chartData" [type]="'line'"></canvas>
  `
})
export class MetricsDashboardComponent {
  metrics = signal<MonthlyMetrics | null>(null);
  
  ngOnInit() {
    this.loadMetrics();
  }
}
```

---

## 🔄 Flujo UI de Carritos y Ventas

### 1. Agregar Item a Carrito (Durante Live)

```
Usuario hace click en "Agregar al Carrito" desde Modo Live
  ↓
Seleccionar Cliente
  - Buscar cliente existente
  - O crear nuevo (modal rápido)
  - Sistema verifica si tiene carrito activo (status='reserved')
  ↓
Seleccionar LiveItem
  - Listar items disponibles (status='available')
  - Filtrar por categoría
  - Ver atributos (color, talla, material, etc.)
  - Ver precio
  ↓
API: POST /api/carts/items
  {
    customerId: "customer_123",
    liveItemId: "item_456",
    quantity: 1,
    livestreamId: "live_789"
  }
  ↓
Backend:
  - Busca o crea carrito para el cliente (Sale con status='reserved')
  - Agrega SaleItem al carrito
  - Cambia LiveItem a status='reserved'
  - Calcula nuevo totalAmount
  ↓
UI actualiza:
  - Refresca vista de carritos activos
  - Muestra mensaje de éxito
  - LiveItem desaparece de items disponibles
  - Aparece en el carrito del cliente
```

### 2. Agregar Más Items al Mismo Carrito (Otro Live)

```
Días después, en otro livestream
  ↓
Cliente pide más items
  ↓
API: POST /api/carts/items (mismo customerId)
  ↓
Backend:
  - Encuentra el carrito ACTIVO del cliente (status='reserved')
  - Agrega nuevos items al MISMO carrito
  - Items se acumulan
  ↓
UI muestra:
  - Carrito actualizado con más items
  - Total acumulado
```

### 3. Confirmar Carrito (Registrar Pago)

```
Usuario abre carrito del cliente
  ↓
Click "Confirmar y Registrar Pago"
  ↓
Modal con formulario:
  - Monto (total del carrito)
  - Método de pago (transferencia, efectivo, etc.)
  - Referencia (opcional)
  ↓
API: POST /api/carts/:cartId/confirm
  + POST /api/payments
  ↓
Backend:
  - Cambia Sale.status a 'confirmed'
  - Cambia todos los LiveItems a status='sold'
  - Crea Payment con el monto
  - Ya no se puede editar
  ↓
UI actualiza:
  - Refresca detalle
  - Muestra badge "Venta Confirmada"
  - Habilita "Crear Envío"
  - Carrito desaparece de carritos activos
```

### 4. Crear Envío

```
Venta confirmada
  ↓
Click "Crear Envío"
  ↓
Modal con formulario:
  - Tipo: Delivery o Pickup
  - Dirección (si delivery)
  ↓
API: POST /api/shipments
  ↓
Backend crea shipment con status "pending"
  ↓
UI muestra envío creado
  - Ver tracking
  - Actualizar estados
```

### 5. Cancelar Carrito

```
Usuario click "Cancelar Carrito"
  ↓
Confirmación (dialog)
  "¿Estás seguro? Todos los items serán liberados"
  ↓
API: POST /api/carts/:cartId/cancel
  ↓
Backend:
  - Cambia Sale.status a 'cancelled'
  - Cambia todos los LiveItems a status='available'
  - Items quedan disponibles para otros clientes
  ↓
UI actualiza:
  - Muestra badge "Cancelada"
  - Deshabilita acciones
  - Carrito desaparece de carritos activos
  - LiveItems vuelven a aparecer como disponibles
```

### 6. Quitar Item del Carrito

```
Usuario en detalle de carrito activo
  ↓
Click icono "eliminar" en un item
  ↓
Confirmación
  ↓
API: DELETE /api/carts/:cartId/items/:itemId
  ↓
Backend:
  - Elimina SaleItem
  - Cambia LiveItem a status='available'
  - Recalcula totalAmount
  ↓
UI actualiza:
  - Refresca carrito
  - LiveItem vuelve a estar disponible
  - Actualiza total
```

---

## 🔒 Validaciones (Frontend)

### Validaciones al Agregar LiveItem a Carrito

```typescript
// LiveItemSelectorComponent
selectLiveItem(item: LiveItem, quantity: number) {
  // 1. Validar estado
  if (item.status !== 'available') {
    this.notificationService.error(
      `Este item no está disponible. Estado actual: ${item.status}`
    );
    return;
  }
  
  // 2. Validar cantidad
  if (quantity > item.quantity) {
    this.notificationService.error(
      `Cantidad no disponible. Máximo: ${item.quantity}`
    );
    return;
  }
  
  // 3. Agregar al carrito
  this.addItemToCart(item, quantity);
}
```

**Validaciones adicionales:**
- Mostrar solo LiveItems con `status='available'`
- Deshabilitar items reservados o vendidos
- Filtrar por livestream activo
- Mostrar atributos claramente (color, talla, etc.)
- Validar que haya cliente seleccionado antes de agregar

---

## 🧪 Buenas Prácticas Frontend

### Estructura de Componentes
- Componentes pequeños y reutilizables
- Usar **Standalone Components** (Angular 17+)
- Separar lógica en servicios
- Usar **Signals** para estado reactivo
- OnPush Change Detection cuando sea posible

### Manejo de Estado
- Estado local: Signals o Reactive Forms
- Estado compartido: Services con BehaviorSubject o Signals
- No usar NgRx para MVP (overkill)

### HTTP y Observables
- Siempre usar `async` pipe en templates
- Manejar errores con `catchError`
- Usar `takeUntilDestroyed()` para evitar memory leaks
- Mostrar loaders durante requests

### Formularios
- Usar Reactive Forms
- Validadores personalizados cuando sea necesario
- Mostrar errores de validación claros
- Deshabilitar submit si form inválido

### UI/UX
- Feedback inmediato (toasts, notifications)
- Confirmaciones para acciones destructivas
- Loaders para operaciones async
- Estados vacíos con ilustraciones
- Responsive design (mobile-first)

### Performance
- Lazy loading de módulos
- TrackBy en *ngFor
- OnPush cuando sea posible
- Debounce en búsquedas

### Seguridad
- Nunca guardar datos sensibles en LocalStorage sin cifrar
- Validar roles antes de mostrar UI
- Logout automático en 401
- Sanitizar inputs

---

## 🚀 Rutas Principales

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
      },
      {
        path: 'categories',
        loadChildren: () => import('./features/categories/categories.routes')
      },
      {
        path: 'liveitems',
        loadChildren: () => import('./features/liveitems/liveitems.routes')
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers.routes')
      },
      {
        path: 'carts',
        loadChildren: () => import('./features/carts/carts.routes')
      },
      {
        path: 'sales',
        loadChildren: () => import('./features/sales/sales.routes')
      },
      {
        path: 'live-mode',
        loadComponent: () => import('./features/live-mode/live-mode.component')
      },
      {
        path: 'livestreams',
        loadChildren: () => import('./features/livestreams/livestreams.routes')
      },
      {
        path: 'metrics',
        loadComponent: () => import('./features/metrics/metrics-dashboard.component')
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
```

---

## 🧠 Instrucciones para GitHub Copilot

Copilot debe:
- Generar código en TypeScript para Angular 17+
- Usar **Standalone Components** (sin NgModules)
- Usar **Signals** para estado reactivo
- Usar **Reactive Forms** para formularios
- Implementar **HttpClient** con interceptors
- Respetar el contexto multi-tenant (enviar organizationId en headers)
- **Entender el modelo de LiveItems**: items individuales, no inventario tradicional
- **Entender carritos persistentes**: un cliente, un carrito activo que persiste entre lives
- Usar async/await en servicios
- Siempre tipar con interfaces
- Implementar manejo de errores robusto
- Crear componentes pequeños y reutilizables
- Usar Angular Material o Tailwind CSS
- Priorizar claridad sobre complejidad
- Optimizar para mobile (touch-friendly)
- Agregar comentarios en código complejo

### Patrón de Servicio Estándar

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private readonly apiUrl = `${environment.apiUrl}/endpoint`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Entity[]> {
    return this.http.get<Entity[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(() => new Error('Algo salió mal'));
  }
}
```

### Patrón de Componente Estándar

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  data = signal<Entity[]>([]);
  loading = signal(false);
  
  constructor(
    private service: ExampleService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.service.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.data.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        }
      });
  }
}
```

---

## 🚀 Objetivo del MVP Frontend

- ✅ Login y Registro con JWT
- ✅ Dashboard con métricas básicas
- ✅ Gestión de categorías (CRUD)
- ✅ Gestión de atributos dinámicos por categoría
- ✅ Gestión de LiveItems (CRUD con estados)
- ✅ Gestión de clientes (CRUD)
- ✅ **Carritos persistentes** (agregar items, quitar items)
- ✅ Confirmar carritos (registrar pago → venta)
- ✅ Ver detalle de ventas confirmadas
- ✅ Cancelar carritos (liberar items)
- ✅ **Modo Live** (diferenciador principal)
- ✅ Iniciar/finalizar livestreams
- ✅ Métricas básicas con gráficos
- ✅ Responsive design (mobile-first)
- ✅ Manejo de errores global
- ✅ Loaders y feedback visual

Todo debe ser extensible para versiones futuras.

---

## 📦 Inicialización del Proyecto

### 1. Crear proyecto Angular

```bash
ng new FlowLiveFront
# Seleccionar:
# - Routing: Yes
# - Stylesheet: CSS (o SCSS)
# - SSR: No
```

### 2. Instalar dependencias

```bash
# Angular Material (opcional)
ng add @angular/material

# Chart.js para métricas
npm install chart.js ng2-charts

# Date utilities
npm install date-fns
```

### 3. Configurar environment

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com/api'
};
```

### 4. Crear estructura base

```bash
# Core
ng g service core/services/auth
ng g guard core/guards/auth
ng g interceptor core/interceptors/auth

# Features
ng g c features/auth/login --standalone
ng g c features/auth/register --standalone
ng g c features/dashboard/dashboard --standalone
ng g c features/live-mode/live-mode --standalone

# Shared
ng g c shared/components/navbar --standalone
ng g c shared/components/loader --standalone
```

---

## 🔥 Prioridades del MVP

### ALTA PRIORIDAD (Semana 1-2)
1. ✅ Auth (Login/Register)
2. ✅ Categorías (Lista + Crear + Atributos)
3. ✅ LiveItems (Lista + Crear con atributos dinámicos)
4. ✅ Clientes (Lista + Crear)
5. ✅ Carritos (Agregar items, ver carritos activos)
6. ✅ Modo Live (versión simple - dividido en 2 columnas)

### MEDIA PRIORIDAD (Semana 3)
7. ✅ Confirmar carritos (registrar pago)
8. ✅ Ver detalle de ventas
9. ✅ Cancelar carritos
10. ✅ Quitar items de carritos
11. ✅ Dashboard con métricas

### BAJA PRIORIDAD (Semana 4)
12. ⚠️ Envíos
13. ⚠️ Livestreams (gestión completa)
14. ⚠️ Filtros avanzados
15. ⚠️ Gráficos detallados

---

## 📦 Inicialización del Proyecto

### 1. Crear proyecto Angular

```bash
ng new FlowLiveFront
# Seleccionar:
# - Routing: Yes
# - Stylesheet: CSS (o SCSS)
# - SSR: No
```

### 2. Instalar dependencias

```bash
# Angular Material (opcional)
ng add @angular/material

# Chart.js para métricas
npm install chart.js ng2-charts

# Date utilities
npm install date-fns
```

### 3. Configurar environment

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com/api'
};
```

### 4. Crear estructura base

```bash
# Core
ng g service core/services/auth
ng g guard core/guards/auth
ng g interceptor core/interceptors/auth

# Features
ng g c features/auth/login --standalone
ng g c features/auth/register --standalone
ng g c features/dashboard/dashboard --standalone
ng g c features/live-mode/live-mode --standalone

# Shared
ng g c shared/components/navbar --standalone
ng g c shared/components/loader --standalone
```

---

## 🔥 Prioridades del MVP

### ALTA PRIORIDAD (Semana 1-2)
1. ✅ Auth (Login/Register)
2. ✅ Productos (Lista + Crear)
3. ✅ Clientes (Lista + Crear)
4. ✅ Ventas (Crear venta básica)
5. ✅ Modo Live (versión simple)

### MEDIA PRIORIDAD (Semana 3)
6. ✅ Registrar pagos
7. ✅ Dashboard con métricas
8. ✅ Ver detalle de venta
9. ✅ Cancelar venta

### BAJA PRIORIDAD (Semana 4)
10. ⚠️ Envíos
11. ⚠️ Livestreams (gestión completa)
12. ⚠️ Filtros avanzados
13. ⚠️ Gráficos detallados

---

## 🔍 Índices Recomendados

Además de los mencionados en cada tabla:

```prisma
// Compuestos para queries frecuentes
@@index([organizationId, status, createdAt]) // sales
@@index([organizationId, isActive, deletedAt]) // products
@@index([productId, isActive]) // product_variants
@@index([customerId, createdAt]) // sales
@@index([livestreamId, status]) // sales
```

---

## 🚨 MVP – Resumen Ejecutivo

El MVP es una **aplicación web Angular** que permite a vendedores y tiendas que venden en livestreams ordenar, registrar y cerrar sus ventas en tiempo real, reemplazando Excel, WhatsApp y notas manuales.

### 🧩 ¿Qué problemas resuelve el MVP?

✔ Ventas desordenadas durante el live  
✔ Pagos no identificados  
✔ Clientes confundidos  
✔ Stock mal controlado  
✔ Falta de visibilidad del dinero vendido  

### 🧱 ¿Qué INCLUYE el MVP?

**1️⃣ Autenticación**
- Login / Registro
- JWT en LocalStorage
- Guards para rutas protegidas

**2️⃣ Productos**
- Lista con búsqueda
- Crear / editar / desactivar
- Ver stock disponible
- ⚠️ Sin variantes todavía

**3️⃣ Clientes**
- Lista con búsqueda
- Registro simple: nombre + usuario (IG/TikTok) + contacto
- Crear cliente rápido desde venta

**4️⃣ Ventas (CORE)**
- Wizard de 3 pasos (cliente → productos → confirmar)
- Agregar múltiples productos
- Total automático
- Estados: Reservada / Pagada / Cancelada
- Ver detalle completo

**5️⃣ Pagos**
- Registrar pagos parciales o totales
- Métodos: Transferencia, Efectivo, MercadoPago, etc.
- Auto-confirmar venta cuando esté pagada

**6️⃣ 🔴 Modo Live (DIFERENCIADOR)**
Un panel optimizado para usar mientras transmiten:
- ⚡ Crear ventas en segundos
- 🔍 Buscar productos rápido
- 📦 Ver stock disponible en tiempo real
- 📋 Ver ventas pendientes
- 💰 Ver total vendido en tiempo real
- ⏱️ Timer del livestream
- 📱 Optimizado para móvil

**🔥 Esto es lo que hace que el MVP valga la pena.**

**7️⃣ Métricas básicas**
- Dashboard con cards
- Total vendido por mes
- Ventas pagadas vs pendientes
- Cantidad de ventas
- Ticket promedio
- Gráfico de ventas por día

### ❌ ¿Qué NO incluye el MVP?

❌ Integración con TikTok / Instagram API  
❌ Variantes de productos (solo producto simple)  
❌ Gestión completa de envíos / logística  
❌ Sistema de roles avanzado  
❌ Automatizaciones  
❌ Mensajería automática  
❌ Reportes avanzados / exports  
❌ Multi-idioma  
❌ Dark mode  

---

## 🎨 Diseño UI/UX

### Principios de Diseño
- **Mobile-first**: El modo live se usa en el celular
- **Minimalista**: Menos clicks, más acciones
- **Feedback inmediato**: Loaders, toasts, animaciones
- **Accesibilidad**: Contrastes, tamaños de fuente, touch targets

### Colores Sugeridos
- **Primary**: Azul vibrante (#2563EB)
- **Success**: Verde (#10B981)
- **Warning**: Amarillo/Naranja (#F59E0B)
- **Danger**: Rojo (#EF4444)
- **Neutral**: Grises (#6B7280, #F3F4F6)

### Componentes Clave
- **Navbar**: Logo + nombre organización + logout
- **Sidebar**: Navegación principal (colapsable en mobile)
- **Cards**: Para métricas y resúmenes
- **Tables**: Para listas (productos, clientes, ventas)
- **Modals**: Para formularios rápidos
- **Badges**: Para estados (reservada, pagada, etc.)
- **Floating Action Button**: En modo live para crear venta rápida

---

## 📝 Endpoints de API (Referencia)

El frontend consume estos endpoints del backend:

### Auth
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Categories
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Ver categoría con atributos
- `POST /api/categories` - Crear categoría
- `PATCH /api/categories/:id` - Actualizar categoría
- `POST /api/categories/:id/attributes` - Crear atributo
- `POST /api/attributes/:id/values` - Agregar valor de atributo

### LiveItems (⭐ Core)
- `GET /api/liveitems` - Listar LiveItems (filtros: status, categoryId, livestreamId)
- `GET /api/liveitems/stats` - Estadísticas de items
- `GET /api/liveitems/:id` - Ver detalle de un item
- `POST /api/liveitems` - Crear nuevo LiveItem
- `PATCH /api/liveitems/:id` - Actualizar item
- `DELETE /api/liveitems/:id` - Eliminar item

### Customers
- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Detalle cliente
- `POST /api/customers` - Crear cliente
- `PATCH /api/customers/:id` - Actualizar cliente

### Carts (⭐ Carritos Persistentes)
- `GET /api/carts` - Listar carritos activos
- `GET /api/carts/customer/:customerId` - Ver carrito de un cliente
- `POST /api/carts/items` - Agregar item al carrito
- `DELETE /api/carts/:cartId/items/:itemId` - Quitar item del carrito
- `POST /api/carts/:cartId/confirm` - Confirmar carrito (cerrar venta)
- `POST /api/carts/:cartId/cancel` - Cancelar carrito (liberar items)

### Sales
- `GET /api/sales` - Listar ventas (confirmadas)
- `GET /api/sales/:id` - Detalle venta (con items, payments, shipment)

### Payments
- `POST /api/payments` - Registrar pago

### Shipments
- `POST /api/shipments` - Crear envío
- `PUT /api/shipments/:id` - Actualizar estado envío

### Livestreams
- `GET /api/livestreams` - Listar livestreams
- `POST /api/livestreams` - Iniciar livestream
- `POST /api/livestreams/:id/end` - Finalizar livestream

### Metrics
- `GET /api/metrics/dashboard` - Métricas generales
- `GET /api/metrics/sales` - Métricas de ventas
- `GET /api/metrics/livestreams/:id` - Métricas de un live

---

## 🔄 Cambios Clave del Backend Reflejados en Frontend

### ❌ Eliminado (ya no existe)
- ~~Products~~ → Reemplazado por **LiveItems**
- ~~ProductVariants~~ → Items individuales con atributos dinámicos
- ~~Stock tradicional~~ → Estados de LiveItems (available/reserved/sold)
- ~~StockMovements~~ → Cambios de estado de LiveItems

### ✅ Nuevo Modelo
- **LiveItems**: Items individuales para vender (1-3 unidades típicamente)
- **ProductCategory**: Categorías de productos (Ropa, Joyas, Maquillaje, etc.)
- **CategoryAttribute**: Atributos dinámicos por categoría (Color, Talla, Material)
- **AttributeValue**: Valores predefinidos para atributos tipo 'select'
- **LiveItemAttributeValue**: Relación entre LiveItem y sus atributos
- **Carritos Persistentes**: Sale con status='reserved' (persiste entre lives)

### 🔑 Conceptos Clave para el Frontend
1. **Items Individuales**: No hay inventario masivo, cada item es único
2. **Carritos que Persisten**: Un cliente puede pedir en varios lives y paga todo junto
3. **Estados de Items**: available → reserved → sold
4. **Atributos Dinámicos**: Cada categoría define sus propios atributos
5. **Sale = Carrito o Venta**: status='reserved' (carrito editable) vs status='confirmed' (venta cerrada)

---

## 📝 Notas Finales

- Usar **Angular Signals** para estado reactivo
- Implementar **lazy loading** en todas las rutas de features
- Usar **OnPush Change Detection** para mejor performance
- Implementar **trackBy** en todos los `*ngFor`
- Agregar **loading states** en todas las operaciones async
- Implementar **error handling** global con interceptor
- Usar **date-fns** para manejo de fechas
- Implementar **confirmación** antes de acciones destructivas
- El **Modo Live** debe ser extremadamente rápido (< 3 clicks para agregar item a carrito)
- Optimizar para **touch devices** (botones grandes, gestos)
- Implementar **búsqueda con debounce** (300ms)
- Guardar **filtros en query params** para compartir URLs
- Los **decimales** vienen del backend como strings, convertir a number para cálculos
- Las **fechas** vienen en formato ISO 8601, usar date-fns para formatear
- Implementar **retry logic** en HTTP requests críticos
- **IMPORTANTE**: Entender que Sale puede ser carrito (reserved) o venta (confirmed)
- **IMPORTANTE**: Un cliente solo tiene 1 carrito activo a la vez
- **IMPORTANTE**: LiveItems son únicos, no hay stock masivo

---

**Versión:** 2.0 Frontend (Actualizado con LiveItems y Carritos Persistentes)  
**Última actualización:** Diciembre 27, 2024  
**Framework:** Angular 17+  
**Enfoque:** Multi-tenant SaaS para Live Shopping con items individuales