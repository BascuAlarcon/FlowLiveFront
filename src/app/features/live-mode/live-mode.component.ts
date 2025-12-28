// src/app/features/live-mode/live-mode.component.ts

import { Component, OnInit, OnDestroy, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subscription, forkJoin } from 'rxjs';
import { 
  LiveItem, 
  ProductCategory, 
  Customer, 
  Sale,
  SaleItem,
  AddItemToCartDto,
  CreateLiveItemDto
} from '@core/models/interfaces';
import { NotificationService } from '@core/services/notification.service';
import { LiveItemsService } from '@features/liveitems/liveitems.service';
import { CategoriesService } from '@features/categories/categories.service';
import { CustomersService } from '@features/customers/customers.service';
import { CartsService } from '@features/carts/carts.service';

@Component({
  selector: 'app-live-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './live-mode.component.html',
  styleUrls: ['./live-mode.component.scss', '../../../assets/styles/styles-seleccion.scss']
})
export class LiveModeComponent implements OnInit, OnDestroy {
  // Signals para estado reactivo
  carts = signal<Sale[]>([]);
  liveItems = signal<LiveItem[]>([]);
  categories = signal<ProductCategory[]>([]);
  customers = signal<Customer[]>([]);
  categoryAttributes = signal<any[]>([]); // Atributos dinámicos de la categoría
  
  // Estado del Live
  liveStartTime = signal<Date>(new Date());
  elapsedTime = signal<string>('00:00:00');
  livestreamId = signal<string | null>(null);
  isLiveActive = signal<boolean>(true);
  loading = signal<boolean>(false);

  // Formulario de agregar item al carrito
  selectedCustomerId = signal<string>('');
  selectedCustomerName = signal<string>('');
  selectedLiveItemId = signal<string>('');
  selectedQuantity = signal<number>(1);
  selectedPrice = signal<number>(0);
  showNewCustomerForm = signal<boolean>(false);
  newCustomerName = signal<string>('');
  newCustomerContact = signal<string>('');
  
  // Formulario dinámico de atributos
  attributesForm: FormGroup = new FormGroup({});
  readonly CATEGORY_ID = 'cmjod8ngf0000iolpwh6246zu'; // ID de categoría hardcoded

  // Filtros
  filterStatus = signal<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  searchCustomer = signal<string>('');

  // Computed values
  filteredCarts = computed(() => {
    let filtered = this.carts();
    
    // Filtrar solo carritos activos (reserved) por defecto
    filtered = filtered.filter(cart => cart.status === 'reserved');

    console.log('Carts before filter:', filtered);
    
    if (this.searchCustomer()) {
      const search = this.searchCustomer().toLowerCase();
      filtered = filtered.filter(cart => 
        cart.Customer?.name.toLowerCase().includes(search)
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
        return sum + (cart.SaleItem?.reduce((itemSum: any, item: any) => itemSum + item.quantity, 0) || 0);
      }, 0);
  });

  pendingCount = computed(() => {
    return this.carts().filter(cart => cart.status === 'reserved').length;
  });

  // Modal
  selectedCart = signal<Sale | null>(null);
  showCartModal = signal<boolean>(false);

  // Subscriptions
  private timerSubscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private liveItemsService: LiveItemsService,
    private categoriesService: CategoriesService,
    private customersService: CustomersService,
    private cartsService: CartsService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.startTimer();
    
    // Simular livestream ID (en producción vendría del backend)
    this.livestreamId.set('cmjodqp4k00089ul2kgljez4f');
    
    this.notificationService.success('Modo Live activado');
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  private loadInitialData(): void {
    this.loading.set(true);
    
    forkJoin({
      liveItems: this.liveItemsService.getAll({ 
        status: 'available',
        livestreamId: this.livestreamId() || undefined
      }),
      attributes: this.categoriesService.getAttributes(this.CATEGORY_ID),
      customers: this.customersService.getAll(),
      carts: this.cartsService.getActiveCarts()
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data: any) => {
        // Transformar LiveItems - verificar si es array o tiene estructura {data: []}
        let liveItemsData = data.liveItems;
        if (!Array.isArray(liveItemsData)) {
          liveItemsData = liveItemsData?.data || [];
        }
        const transformedLiveItems = this.transformLiveItems(liveItemsData);
        this.liveItems.set(transformedLiveItems);
        
        // Otros datos
        this.categoryAttributes.set(data.attributes.data || data.attributes || []);
        this.customers.set(data.customers.data || data.customers || []);
        this.carts.set(data.carts.data || data.carts || []);
        
        this.buildAttributesForm();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.notificationService.error('Error al cargar los datos del live');
        this.loading.set(false);
      }
    });
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

  /**
   * Agregar LiveItem al carrito de un cliente
   * Primero crea el LiveItem basado en los atributos del formulario,
   * luego lo agrega al carrito del cliente
   */
  addItemToCart(): void {
    const customerId = this.selectedCustomerId();
    const quantity = this.selectedQuantity();
    const price = this.selectedPrice();

    // Validaciones
    if (!customerId) {
      this.notificationService.error('Debe seleccionar un comprador');
      return;
    }
    if (!this.isAttributesFormValid()) {
      this.notificationService.error('Debe completar todos los atributos requeridos');
      return;
    }
    if (quantity <= 0) {
      this.notificationService.error('La cantidad debe ser mayor a 0');
      return;
    }
    if (price <= 0) {
      this.notificationService.error('El precio debe ser mayor a 0');
      return;
    }

    this.loading.set(true);

    // Preparar atributos del formulario
    const attributesFormValues = this.getAttributesFormValues();

    // Crear el LiveItem
    const createLiveItemDto: CreateLiveItemDto = {
      categoryId: this.CATEGORY_ID,
      livestreamId: this.livestreamId() || undefined,
      price: price,
      quantity: quantity,
      attributes: attributesFormValues
    };

    this.liveItemsService.create(createLiveItemDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          // Extraer el liveItem de la respuesta (puede venir directo o en response.data)
          const createdLiveItem = response.data || response;
          
          // Ahora agregamos el LiveItem al carrito
          const addItemDto: AddItemToCartDto = {
            customerId,
            liveItemId: createdLiveItem.id,
            quantity: quantity,
            livestreamId: this.livestreamId() || undefined
          };

          this.cartsService.addItemToCart(addItemDto)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (cartResponse: any) => {
                // Extraer el cart de la respuesta
                const updatedCart = cartResponse.data || cartResponse;
                
                // Actualizar lista de carritos
                const cartIndex = this.carts().findIndex(c => c.id === updatedCart.id);
                if (cartIndex !== -1) {
                  const updated = [...this.carts()];
                  updated[cartIndex] = updatedCart;
                  this.carts.set(updated);
                  this.notificationService.success('Item agregado al carrito existente');
                } else {
                  this.carts.set([...this.carts(), updatedCart]);
                  this.notificationService.success('Nuevo carrito creado');
                }

                // Agregar el LiveItem creado a la lista (transformado para consistencia)
                const currentItems = this.liveItems();
                const transformedItem = this.transformLiveItems([createdLiveItem])[0];
                this.liveItems.set([...currentItems, transformedItem]);
                
                // Limpiar formulario
                this.resetForm();
                this.loading.set(false);
              },
              error: (error) => {
                console.error('Error agregando item al carrito:', error);
                this.notificationService.error(error.error?.error || 'Error al agregar item al carrito');
                this.loading.set(false);
              }
            });
        },
        error: (error) => {
          console.error('Error creando LiveItem:', error);
          this.notificationService.error(error.error?.error || 'Error al crear el item');
          this.loading.set(false);
        }
      });
  }

  /**
   * Crear nuevo cliente rápido
   */
  createNewCustomer(): void {
    const name = this.newCustomerName().trim();
    const contact = this.newCustomerContact().trim();

    if (!name) {
      this.notificationService.error('Debe ingresar un nombre');
      return;
    }

    this.loading.set(true);

    this.customersService.create({ name, contact: contact || undefined })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customer) => {
          this.customers.set([...this.customers(), customer]);
          this.selectedCustomerId.set(customer.id);
          this.selectedCustomerName.set(customer.name);
          this.showNewCustomerForm.set(false);
          this.newCustomerName.set('');
          this.newCustomerContact.set('');
          this.notificationService.success('Cliente creado exitosamente');
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creando cliente:', error);
          this.notificationService.error('Error al crear cliente');
          this.loading.set(false);
        }
      });
  }

  private refreshLiveItems(): void {
    this.liveItemsService.getAll({ 
      status: 'available',
      livestreamId: this.livestreamId() || undefined
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          let items = response;
          if (!Array.isArray(items)) {
            items = items?.data || [];
          }
          const transformedItems = this.transformLiveItems(items);
          this.liveItems.set(transformedItems);
        },
        error: (error) => {
          console.error('Error refrescando items:', error);
        }
      });
  }

  /**
   * Transformar LiveItems del backend al formato del front
   * Convierte precio de string a number y simplifica estructura de atributos
   */
  private transformLiveItems(items: any[]): LiveItem[] {
    return items.map(item => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      attributes: item.attributes?.map((attr: any) => ({
        id: attr.id,
        liveItemId: attr.liveItemId,
        attributeValueId: attr.attributeValueId,
        attributeValue: attr.attributeValue ? {
          id: attr.attributeValue.id,
          attributeId: attr.attributeValue.attributeId,
          value: attr.attributeValue.value,
          hexCode: attr.attributeValue.hexCode,
          order: attr.attributeValue.order,
          isActive: attr.attributeValue.isActive,
          createdAt: attr.attributeValue.createdAt
        } : undefined,
        customValue: attr.textValue || attr.numberValue?.toString() || null,
        createdAt: attr.createdAt
      })) || []
    }));
  }

  private refreshCarts(): void {
    this.cartsService.getActiveCarts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (carts) => {
          this.carts.set(carts);
        },
        error: (error) => {
          console.error('Error refrescando carritos:', error);
        }
      });
  }

  /**
   * Construir formulario dinámico basado en los atributos de la categoría
   */
  private buildAttributesForm(): void {
    const group: any = {};
    
    this.categoryAttributes().forEach((attribute: any) => {
      const validators = attribute.isRequired ? [Validators.required] : [];
      
      // Valor inicial depende del tipo
      let initialValue: any = '';
      if (attribute.type === 'number') {
        initialValue = null;
      }
      
      group[attribute.id] = new FormControl(initialValue, validators);
    });
    
    this.attributesForm = new FormGroup(group);
  }

  /**
   * Obtener valores del formulario de atributos formateados para crear LiveItem
   */
  getAttributesFormValues(): { attributeValueId?: string; customValue?: string }[] {
    const values: { attributeValueId?: string; customValue?: string }[] = [];
    const formValues = this.attributesForm.value;
    
    this.categoryAttributes().forEach((attribute: any) => {
      const value = formValues[attribute.id];
      
      if (value !== null && value !== undefined && value !== '') {
        if (attribute.type === 'select') {
          // Para SELECT: buscar el attributeValueId correspondiente
          const attributeValue = attribute.values?.find((v: any) => v.value === value);
          if (attributeValue) {
            values.push({
              attributeValueId: attributeValue.id
            });
          }
        } else {
          // Para TEXT y NUMBER: usar customValue
          values.push({
            customValue: String(value)
          });
        }
      }
    });
    
    return values;
  }

  /**
   * Verificar si el formulario de atributos es válido
   */
  isAttributesFormValid(): boolean {
    return this.attributesForm.valid;
  }

  private resetForm(): void {
    this.selectedCustomerId.set('');
    this.selectedCustomerName.set('');
    this.selectedLiveItemId.set('');
    this.selectedQuantity.set(1);
    this.selectedPrice.set(0);
    this.attributesForm.reset();
  }

  /**
   * Abrir modal de detalle de carrito
   */
  openCartModal(cart: Sale): void {
    console.log('Opening cart modal for cart:', cart);
    this.selectedCart.set(cart);
    this.showCartModal.set(true);
  }

  closeCartModal(): void {
    this.showCartModal.set(false);
    this.selectedCart.set(null);
  }

  /**
   * Confirmar carrito (convertir a venta)
   */
  confirmCart(cart: Sale): void {
    if (!confirm(`¿Confirmar carrito de ${cart.Customer?.name}? Se convertirá en venta y no podrá editarse.`)) {
      return;
    }

    this.loading.set(true);

    this.cartsService.confirmCart(cart.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (confirmedSale) => {
          // Remover carrito de la lista (ya no es 'reserved')
          const updated = this.carts().filter(c => c.id !== cart.id);
          this.carts.set(updated);
          
          this.notificationService.success('Carrito confirmado como venta');
          this.closeCartModal();
          this.refreshLiveItems(); // Items pasan a 'sold'
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error confirmando carrito:', error);
          this.notificationService.error('Error al confirmar carrito');
          this.loading.set(false);
        }
      });
  }

  /**
   * Cancelar carrito (liberar items)
   */
  cancelCart(cart: Sale): void {
    if (!confirm(`¿Cancelar carrito de ${cart.Customer?.name}? Los items serán liberados.`)) {
      return;
    }

    this.loading.set(true);

    this.cartsService.cancelCart(cart.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Remover carrito de la lista
          const updated = this.carts().filter(c => c.id !== cart.id);
          this.carts.set(updated);
          
          this.notificationService.success('Carrito cancelado. Items liberados.');
          this.closeCartModal();
          this.refreshLiveItems(); // Items vuelven a 'available'
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error cancelando carrito:', error);
          this.notificationService.error('Error al cancelar carrito');
          this.loading.set(false);
        }
      });
  }

  /**
   * Quitar item del carrito
   */
  removeItemFromCart(cart: Sale, itemId: string): void {
    if (!confirm('¿Eliminar este item del carrito?')) {
      return;
    }

    this.loading.set(true);

    this.cartsService.removeItemFromCart(cart.id, itemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedCart) => {
          // Actualizar carrito en la lista
          const updated = this.carts().map(c => 
            c.id === cart.id ? updatedCart : c
          );
          this.carts.set(updated);
          
          // Si era el modal abierto, actualizarlo
          if (this.selectedCart()?.id === cart.id) {
            this.selectedCart.set(updatedCart);
          }
          
          this.notificationService.success('Item eliminado del carrito');
          this.refreshLiveItems(); // Item vuelve a 'available'
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error eliminando item:', error);
          this.notificationService.error('Error al eliminar item');
          this.loading.set(false);
        }
      });
  }

  /**
   * Cerrar el live
   */
  closeLive(): void {
    if (!confirm('¿Está seguro de cerrar el Live? Los carritos pendientes quedarán guardados.')) {
      return;
    }

    this.isLiveActive.set(false);
    this.notificationService.success('Live cerrado. Carritos guardados.');
    
    // En modo real, aquí se llamaría a un endpoint para finalizar el livestream
  }

  /**
   * Seleccionar customer del dropdown
   */
  onCustomerChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const customerId = select.value;
    
    if (customerId === 'new') {
      this.showNewCustomerForm.set(true);
      this.selectedCustomerId.set('');
      this.selectedCustomerName.set('');
      return;
    }

    this.showNewCustomerForm.set(false);
    this.selectedCustomerId.set(customerId);
    
    const customer = this.customers().find(c => c.id === customerId);
    if (customer) {
      this.selectedCustomerName.set(customer.name);
    }
  }

  /**
   * Get attribute display for LiveItem
   */
  getItemAttributes(item: LiveItem): string {
    if (!item.attributes || item.attributes.length === 0) {
      return 'Sin atributos';
    }
    
    return item.attributes
      .map(attr => attr.attributeValue?.value || attr.customValue)
      .filter(Boolean)
      .join(' • ');
  }

  /**
   * Get category name (por ahora retorna nombre genérico)
   */
  getCategoryName(categoryId: string): string {
    return 'Ropa'; // Por ahora hardcoded, podemos obtener del backend si es necesario
  }

  /**
   * Get item display name for cart preview
   */
  getItemDisplayName(saleItem: any): string {
    if (!saleItem.LiveItem) return 'Item';
    
    const categoryName = this.getCategoryName(saleItem.LiveItem.categoryId);
    const attributes = this.getItemAttributes(saleItem.LiveItem);
    
    return `${categoryName}${attributes ? ' - ' + attributes : ''}`;
  }

  /**
   * Seleccionar valor de atributo mediante botón
   */
  selectAttributeValue(attributeId: string, value: string): void {
    const control = this.attributesForm.get(attributeId);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
    }
  }
}
