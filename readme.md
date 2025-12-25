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
  grueso de la aplicación


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
- Todo dato de negocio (ventas, productos, clientes, livestreams) está asociado a una organización
- No debe existir acceso cruzado entre organizaciones en la UI

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
│   │   ├── products/
│   │   │   ├── product-list/
│   │   │   ├── product-form/
│   │   │   └── products.service.ts
│   │   ├── customers/
│   │   │   ├── customer-list/
│   │   │   ├── customer-form/
│   │   │   └── customers.service.ts
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
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
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

### 3. Productos
- Lista con búsqueda y filtros
- CRUD completo
- Ver stock disponible
- Activar/desactivar productos

### 4. Clientes
- Lista con búsqueda
- Registro rápido durante venta
- Ver historial de compras

### 5. Ventas
- Lista con filtros por estado, fecha, cliente
- Crear venta (seleccionar cliente + productos)
- Ver detalle de venta
- Registrar pagos
- Cancelar venta
- Ver estado de envío

### 6. 🔴 Modo Live (DIFERENCIADOR)
**Componente optimizado para usar durante transmisiones:**

Features:
- Vista simplificada (sin menú completo)
- Búsqueda rápida de productos
- Stock visible en tiempo real
- Crear venta en 3 pasos:
  1. Seleccionar cliente (o crear rápido)
  2. Agregar productos
  3. Confirmar
- Ver total vendido en la sesión
- Ver ventas pendientes de confirmar
- Timer del livestream
- Optimizado para móvil (touch-friendly)

```typescript
interface LiveSession {
  livestreamId?: string;
  startedAt: Date;
  totalSales: number;
  totalAmount: number;
  pendingSales: number;
}
```

### 7. Livestreams
- Iniciar/finalizar livestream
- Ver ventas asociadas al livestream
- Métricas por livestream

### 8. Métricas
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

#### Product
```typescript
interface Product {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  basePrice: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
  stockQuantity?: number; // calculado
  createdAt: string;
  updatedAt: string;
}
```

#### ProductVariant
```typescript
interface ProductVariant {
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

#### Sale
```typescript
interface Sale {
  id: string;
  organizationId: string;
  livestreamId: string | null;
  customerId: string;
  customer?: Customer; // populated
  sellerId: string;
  seller?: User; // populated
  status: SaleStatus;
  totalAmount: number;
  discountAmount: number;
  notes: string | null;
  items?: SaleItem[]; // populated
  payments?: Payment[]; // populated
  shipment?: Shipment; // populated
  createdAt: string;
  updatedAt: string;
}
```

#### SaleItem
```typescript
interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product; // populated
  productVariantId: string;
  productVariant?: ProductVariant; // populated
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
interface CreateSaleDto {
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

interface CreatePaymentDto {
  saleId: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
}

interface CreateProductDto {
  name: string;
  description?: string;
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

export enum StockMovementType {
  RESERVE = 'reserve',
  SALE = 'sale',
  CANCEL = 'cancel',
  ADJUSTMENT = 'adjustment',
  RETURN = 'return'
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
export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SaleStatus.RESERVED]: 'Reservada',
  [SaleStatus.CONFIRMED]: 'Confirmada',
  [SaleStatus.CANCELLED]: 'Cancelada'
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.FAILED]: 'Fallido'
};

// Colores para badges
export const SALE_STATUS_COLORS: Record<SaleStatus, string> = {
  [SaleStatus.RESERVED]: 'warning',
  [SaleStatus.CONFIRMED]: 'success',
  [SaleStatus.CANCELLED]: 'danger'
};
```

---

## 🛒 Ventas (Core del sistema)

Una venta en la UI:
- DEBE tener un cliente seleccionado
- DEBE tener al menos un producto
- Puede estar asociada a un livestream activo
- Muestra estado visual (badge con color)
- Permite registrar pagos parciales
- Calcula automáticamente totales

### Estados de venta y acciones permitidas:

**RESERVED (Reservada)**
- ✅ Registrar pago
- ✅ Cancelar venta
- ✅ Editar (agregar productos)
- ⚠️ Stock reservado pero no descontado

**CONFIRMED (Confirmada)**
- ✅ Ver detalle
- ✅ Crear envío
- ✅ Imprimir
- ❌ No se puede cancelar si tiene pagos
- ✅ Stock descontado

**CANCELLED (Cancelada)**
- 👁️ Solo lectura
- ℹ️ Stock liberado

### Flujo UI para Crear Venta

```typescript
// 1. Seleccionar o crear cliente
step1: SelectCustomerComponent
  - Buscar cliente existente
  - Botón "Crear cliente rápido" (modal)
  - Continuar a productos

// 2. Agregar productos
step2: AddProductsComponent
  - Buscar productos (con stock visible)
  - Seleccionar variante
  - Agregar cantidad
  - Ver total parcial
  - Lista de items agregados

// 3. Confirmar y crear
step3: ConfirmSaleComponent
  - Resumen (cliente, productos, total)
  - Descuento opcional
  - Notas opcionales
  - Botón "Crear Venta"
```

### Componente de Pago

```typescript
// Modal o sidebar para registrar pago
RegisterPaymentComponent {
  saleId: string;
  pendingAmount: number; // calculado
  
  form: {
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }
}
```

**Validaciones:**
- `amount` no puede ser mayor que el pendiente
- Si `amount` >= `pendingAmount`: mostrar mensaje "Venta será confirmada"
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

## 🔄 Flujo UI de una Venta

### 1. Crear Venta (status: `reserved`)

```
Usuario hace click en "Nueva Venta"
  ↓
Paso 1: Seleccionar Cliente
  - Buscar cliente existente
  - O crear nuevo (modal rápido)
  - Continuar
  ↓
Paso 2: Agregar Productos
  - Buscar producto
  - Ver stock disponible
  - Seleccionar cantidad
  - Agregar a lista
  - Repetir para más productos
  ↓
Paso 3: Confirmar
  - Ver resumen
  - Agregar descuento (opcional)
  - Agregar notas (opcional)
  - Click "Crear Venta"
  ↓
API: POST /api/sales
  - Backend valida stock
  - Crea venta en estado "reserved"
  - Reserva stock
  ↓
UI muestra venta creada
  - Mostrar mensaje de éxito
  - Redirigir a detalle de venta
  - Mostrar botón "Registrar Pago"
```

### 2. Registrar Pago

```
Usuario abre detalle de venta
  ↓
Click "Registrar Pago"
  ↓
Modal con formulario:
  - Monto (máx: monto pendiente)
  - Método de pago
  - Referencia (opcional)
  ↓
API: POST /api/payments
  {
    saleId: "...",
    amount: 100,
    method: "transfer"
  }
  ↓
Backend:
  - Crea payment
  - Si total pagado >= total venta:
    * Cambia sale.status a "confirmed"
    * Descuenta stock
  ↓
UI actualiza venta
  - Refresca detalle
  - Muestra nuevo estado
  - Si está confirmada: habilitar "Crear Envío"
```

### 3. Crear Envío

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

### 4. Cancelar Venta

```
Usuario click "Cancelar Venta"
  ↓
Confirmación (dialog)
  "¿Estás seguro? El stock será liberado"
  ↓
API: PUT /api/sales/:id/cancel
  ↓
Backend:
  - Valida que no tenga pagos confirmados
  - Cambia status a "cancelled"
  - Libera stock reservado
  ↓
UI actualiza venta
  - Muestra badge "Cancelada"
  - Deshabilita acciones
```

---

## 🔒 Validaciones de Stock (Frontend)

Antes de permitir agregar productos a una venta:

```typescript
// ProductSelectorComponent
selectProduct(variant: ProductVariant, quantity: number) {
  if (quantity > variant.stockQuantity) {
    this.notificationService.error(
      `Stock insuficiente. Disponible: ${variant.stockQuantity}`
    );
    return;
  }
  
  // Agregar a lista de items
  this.addItemToSale(variant, quantity);
}
```

**Validaciones adicionales:**
- Mostrar stock en tiempo real junto a cada producto
- Deshabilitar productos sin stock
- Actualizar stock después de crear venta
- Mostrar advertencia si el stock es bajo (< 5 unidades)

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
        path: 'products',
        loadChildren: () => import('./features/products/products.routes')
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers.routes')
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
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de clientes (CRUD)
- ✅ Creación de ventas (wizard de 3 pasos)
- ✅ Registro de pagos
- ✅ Ver detalle de ventas
- ✅ Cancelar ventas
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

### Products
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar (soft delete)

### Customers
- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Detalle cliente
- `POST /api/customers` - Crear cliente
- `PUT /api/customers/:id` - Actualizar cliente

### Sales
- `GET /api/sales` - Listar ventas (con filtros)
- `GET /api/sales/:id` - Detalle venta (con items, payments, shipment)
- `POST /api/sales` - Crear venta
- `PUT /api/sales/:id/cancel` - Cancelar venta

### Payments
- `POST /api/payments` - Registrar pago

### Shipments
- `POST /api/shipments` - Crear envío
- `PUT /api/shipments/:id` - Actualizar estado envío

### Livestreams
- `GET /api/livestreams` - Listar livestreams
- `POST /api/livestreams` - Iniciar livestream
- `PUT /api/livestreams/:id/end` - Finalizar livestream

### Metrics
- `GET /api/metrics/monthly?year=2024&month=12` - Métricas mensuales
- `GET /api/metrics/daily?startDate=...&endDate=...` - Métricas por día
- `GET /api/metrics/top-products?limit=10` - Top productos

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
- El **Modo Live** debe ser extremadamente rápido (< 3 clicks para venta)
- Optimizar para **touch devices** (botones grandes, gestos)
- Implementar **búsqueda con debounce** (300ms)
- Guardar **filtros en query params** para compartir URLs
- Los **decimales** vienen del backend como strings, convertir a number para cálculos
- Las **fechas** vienen en formato ISO 8601, usar date-fns para formatear
- Implementar **retry logic** en HTTP requests críticos

---

**Versión:** 1.0 Frontend  
**Última actualización:** Diciembre 2024  
**Framework:** Angular 17+  
**Enfoque:** Multi-tenant SaaS para Live Commerce