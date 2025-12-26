// src/app/features/live-mode/live-mode.component.ts

import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { Cart, CartItem, Product, ProductVariant, Customer } from '@core/models/interfaces';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-live-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-mode.component.html',
  styleUrls: ['./live-mode.component.scss']
})
export class LiveModeComponent implements OnInit, OnDestroy {
  // Signals para estado reactivo
  carts = signal<Cart[]>([]);
  products = signal<Product[]>([]);
  customers = signal<Customer[]>([]);
  
  // Estado del Live
  liveStartTime = signal<Date>(new Date());
  elapsedTime = signal<string>('00:00:00');
  livestreamId = signal<string>('live-demo-' + Date.now());
  isLiveActive = signal<boolean>(true);

  // Formulario de agregar producto
  selectedCustomerName = signal<string>('');
  selectedProductId = signal<string>('');
  selectedColor = signal<string>('');
  selectedSize = signal<string>('');
  selectedPrice = signal<number>(0);
  selectedQuantity = signal<number>(1);

  // Filtros
  filterStatus = signal<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  searchCustomer = signal<string>('');

  // Computed values
  filteredCarts = computed(() => {
    let filtered = this.carts();
    
    if (this.filterStatus() !== 'all') {
      filtered = filtered.filter(cart => cart.status === this.filterStatus());
    }
    
    if (this.searchCustomer()) {
      const search = this.searchCustomer().toLowerCase();
      filtered = filtered.filter(cart => 
        cart.customerName.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  });

  totalRecaudado = computed(() => {
    return this.carts()
      .filter(cart => cart.status !== 'cancelled')
      .reduce((sum, cart) => sum + cart.totalAmount, 0);
  });

  totalUnidadesVendidas = computed(() => {
    return this.carts()
      .filter(cart => cart.status !== 'cancelled')
      .reduce((sum, cart) => {
        return sum + cart.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);
  });

  pendingCount = computed(() => {
    return this.carts().filter(cart => cart.status === 'pending').length;
  });

  paidCount = computed(() => {
    return this.carts().filter(cart => cart.status === 'paid').length;
  });

  cancelledCount = computed(() => {
    return this.carts().filter(cart => cart.status === 'cancelled').length;
  });

  // Modal
  selectedCart = signal<Cart | null>(null);
  showCartModal = signal<boolean>(false);

  // Subscriptions
  private timerSubscription?: Subscription;

  // Opciones disponibles (simuladas - idealmente vendrían de un mantenedor)
  availableColors = ['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Amarillo', 'Rosa', 'Morado'];
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadMockData();
    this.startTimer();
    this.notificationService.success('Livestream iniciado - Modo Demo');
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  private loadMockData(): void {
    // Datos de productos simulados
    const mockProducts: Product[] = [
      {
        id: '1',
        organizationId: 'org-1',
        name: 'Polera Básica',
        description: 'Polera 100% algodón',
        basePrice: 15000,
        sku: 'POL-001',
        imageUrl: null,
        isActive: true,
        stockQuantity: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        organizationId: 'org-1',
        name: 'Pantalón Jeans',
        description: 'Pantalón de mezclilla',
        basePrice: 35000,
        sku: 'PAN-001',
        imageUrl: null,
        isActive: true,
        stockQuantity: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        organizationId: 'org-1',
        name: 'Polerón con Capucha',
        description: 'Polerón tipo hoodie',
        basePrice: 28000,
        sku: 'POL-002',
        imageUrl: null,
        isActive: true,
        stockQuantity: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        organizationId: 'org-1',
        name: 'Zapatillas Deportivas',
        description: 'Zapatillas running',
        basePrice: 45000,
        sku: 'ZAP-001',
        imageUrl: null,
        isActive: true,
        stockQuantity: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        organizationId: 'org-1',
        name: 'Chaqueta Deportiva',
        description: 'Chaqueta cortaviento',
        basePrice: 38000,
        sku: 'CHA-001',
        imageUrl: null,
        isActive: true,
        stockQuantity: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.products.set(mockProducts);

    // Datos de clientes simulados (opcional, por si se quiere autocompletar)
    const mockCustomers: Customer[] = [
      {
        id: '1',
        organizationId: 'org-1',
        name: 'María González',
        username: '@maria_g',
        contact: '+56912345678',
        notes: null,
        lastPurchaseAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        organizationId: 'org-1',
        name: 'Juan Pérez',
        username: '@juanp',
        contact: '+56987654321',
        notes: null,
        lastPurchaseAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.customers.set(mockCustomers);
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date();
      const diff = now.getTime() - this.liveStartTime().getTime();
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      this.elapsedTime.set(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    });
  }

  addProductToCart(): void {
    const customerName = this.selectedCustomerName().trim();
    const productId = this.selectedProductId();
    const color = this.selectedColor();
    const size = this.selectedSize();
    const price = this.selectedPrice();
    const quantity = this.selectedQuantity();
  
    console.log('Valores del formulario:', { 
      customerName, 
      customerNameSignal: this.selectedCustomerName(),
      productId, 
      color, 
      size, 
      price, 
      quantity 
    });

    // Validaciones
    if (!customerName) {
      this.notificationService.error('Debe ingresar un nombre de comprador');
      return;
    }
    if (!productId) {
      this.notificationService.error('Debe seleccionar un producto');
      return;
    }
    if (!color) {
      this.notificationService.error('Debe seleccionar un color');
      return;
    }
    if (!size) {
      this.notificationService.error('Debe seleccionar una talla');
      return;
    }
    if (price <= 0) {
      this.notificationService.error('El precio debe ser mayor a 0');
      return;
    }
    if (quantity <= 0) {
      this.notificationService.error('La cantidad debe ser mayor a 0');
      return;
    }

    const product = this.products().find(p => p.id === productId);
    if (!product) return;

    const cartItem: CartItem = {
      productVariantId: productId, // Simulado
      productName: product.name,
      variantName: `${color} - ${size}`,
      quantity,
      unitPrice: price,
      totalPrice: price * quantity
    };

    // Buscar si ya existe un carrito para este cliente
    const existingCartIndex = this.carts().findIndex(
      cart => cart.customerName.toLowerCase() === customerName.toLowerCase() && cart.status === 'pending'
    );

    if (existingCartIndex !== -1) {
      // Agregar al carrito existente
      const updatedCarts = [...this.carts()];
      updatedCarts[existingCartIndex].items.push(cartItem);
      updatedCarts[existingCartIndex].totalAmount += cartItem.totalPrice;
      this.carts.set(updatedCarts);
      this.notificationService.success(`Producto agregado al carrito de ${customerName}`);
    } else {
      // Crear nuevo carrito
      const newCart: Cart = {
        customerId: '', // Se generará al confirmar
        customerName,
        items: [cartItem],
        totalAmount: cartItem.totalPrice,
        status: 'pending'
      };
      this.carts.set([...this.carts(), newCart]);
      this.notificationService.success(`Nuevo carrito creado para ${customerName}`);
    }

    // Limpiar formulario
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedCustomerName.set('');
    this.selectedProductId.set('');
    this.selectedColor.set('');
    this.selectedSize.set('');
    this.selectedPrice.set(0);
    this.selectedQuantity.set(1);
  }

  openCartModal(cart: Cart): void {
    this.selectedCart.set(cart);
    this.showCartModal.set(true);
  }

  closeCartModal(): void {
    this.showCartModal.set(false);
    this.selectedCart.set(null);
  }

  updateCartStatus(cart: Cart, newStatus: 'pending' | 'paid' | 'cancelled'): void {
    const updatedCarts = this.carts().map(c => 
      c === cart ? { ...c, status: newStatus } : c
    );
    this.carts.set(updatedCarts);
    
    const statusLabels = {
      'pending': 'Pendiente',
      'paid': 'Pagado',
      'cancelled': 'Cancelado'
    };
    this.notificationService.success(`Carrito marcado como ${statusLabels[newStatus]}`);
  }

  deleteCart(cart: Cart): void {
    if (!confirm(`¿Está seguro de eliminar el carrito de ${cart.customerName}?`)) {
      return;
    }
    
    const updatedCarts = this.carts().filter(c => c !== cart);
    this.carts.set(updatedCarts);
    this.notificationService.success('Carrito eliminado');
  }

  removeItemFromCart(cart: Cart, item: CartItem): void {
    const updatedCarts = this.carts().map(c => {
      if (c === cart) {
        const updatedItems = c.items.filter(i => i !== item);
        const newTotal = updatedItems.reduce((sum, i) => sum + i.totalPrice, 0);
        return { ...c, items: updatedItems, totalAmount: newTotal };
      }
      return c;
    });
    this.carts.set(updatedCarts);
    this.notificationService.success('Producto eliminado del carrito');
  }

  closeLive(): void {
    if (!confirm('¿Está seguro de cerrar el Live? Las ventas se congelarán.')) {
      return;
    }

    this.isLiveActive.set(false);
    
    // En modo demo, solo mostramos mensaje
    this.notificationService.success('Live cerrado. Las ventas han sido guardadas localmente.');
    
    // Aquí podrías guardar los datos en localStorage si quieres persistencia
    localStorage.setItem('last-live-carts', JSON.stringify(this.carts()));
    localStorage.setItem('last-live-ended', new Date().toISOString());
  }

  onProductChange(): void {
    const productId = this.selectedProductId();
    const product = this.products().find(p => p.id === productId);
    if (product) {
      this.selectedPrice.set(product.basePrice);
    }
  }

  selectProduct(productId: string): void {
    if (!this.isLiveActive()) return;
    this.selectedProductId.set(productId);
    this.onProductChange();
  }

  selectColor(color: string): void {
    if (!this.isLiveActive()) return;
    this.selectedColor.set(color);
  }

  selectSize(size: string): void {
    if (!this.isLiveActive()) return;
    this.selectedSize.set(size);
  }

  updateCustomerName(name: string): void {
    console.log('Actualizando nombre de cliente:', name);
    this.selectedCustomerName.set(name);
  }
}
