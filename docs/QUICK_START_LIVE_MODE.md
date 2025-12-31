# 🚀 Guía de Inicio Rápido - Modo Live

## 📦 Instalación y Ejecución

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:4200`

### 3. Acceder al Modo Live

Hay dos formas de acceder al Modo Live:

#### Opción A: Desde el Header (Recomendado)
1. Inicia sesión en la aplicación
2. En el header superior, busca el botón rojo parpadeante que dice **"LIVE"** 🔴
3. Haz clic en el botón para acceder directamente

#### Opción B: URL Directa
Navega directamente a: `http://localhost:4200/live-mode`

## 🎮 Cómo Usar el Modo Live

### Paso 1: Verificar que el Live Esté Activo
- Verás el badge **"LIVE"** parpadeando en rojo
- El cronómetro estará corriendo
- Las métricas mostrarán 0 al inicio

### Paso 2: Agregar Productos a un Carrito

En el formulario de la derecha:

1. **Comprador**: Escribe el nombre del comprador (ej: "Juan Pérez")
2. **Producto**: Selecciona un producto del dropdown
3. **Color**: Selecciona un color
4. **Talla**: Selecciona una talla
5. **Precio**: Se autocompleta, pero puedes ajustarlo
6. **Cantidad**: Ajusta la cantidad (por defecto 1)
7. Haz clic en **"Agregar al Carrito"**

**Nota**: Si el nombre del comprador es nuevo, se creará un nuevo carrito. Si ya existe, se agregará al carrito existente.

### Paso 3: Gestionar Carritos

En la sección izquierda verás todos los carritos:

#### Ver Detalles de un Carrito
- Haz clic en cualquier carrito para abrir el modal con detalles completos
- En el modal puedes:
  - Ver todos los productos
  - Eliminar productos individuales
  - Cambiar el estado del carrito

#### Filtrar Carritos
- **Por estado**: Usa los botones de filtro (Todos, Pendiente, Pagado, Cancelado)
- **Por nombre**: Usa el campo de búsqueda para encontrar un comprador específico

#### Cambiar Estado de Carrito
- **Marcar como Pagado**: Botón verde (cuando el cliente paga)
- **Cancelar**: Botón rojo (si el cliente cancela)
- **Marcar Pendiente**: Botón amarillo (para revertir estado)

#### Eliminar Carrito
- Usa el botón "Eliminar" para eliminar un carrito completo

### Paso 4: Monitorear Métricas en Tiempo Real

En el header del Live verás:

- 💰 **Total Recaudado**: Suma de todos los carritos (excepto cancelados)
- 📦 **Unidades Vendidas**: Total de productos en los carritos
- 🛒 **Número de Carritos**: Cantidad total de carritos activos
- ⏱️ **Cronómetro**: Tiempo transcurrido desde el inicio

### Paso 5: Cerrar el Live

Cuando termines la transmisión:

1. Haz clic en **"Cerrar Live"**
2. Confirma la acción
3. El formulario se desactivará
4. Las ventas quedarán registradas

**⚠️ Importante**: Una vez cerrado el live, no podrás agregar más productos. Solo usuarios con permisos especiales podrían modificar los datos después.

## 🎨 Estados de Carrito

| Estado | Color | Significado |
|--------|-------|-------------|
| 🟡 **Pendiente** | Amarillo/Naranja | Venta registrada, esperando confirmación de pago |
| 🟢 **Pagado** | Verde | Pago confirmado por el cliente |
| 🔴 **Cancelado** | Rojo | Venta cancelada (no cuenta para totales) |

## 📱 Responsive

El Modo Live está optimizado para diferentes dispositivos:

- **Desktop**: Vista de 2 columnas (carritos | formulario)
- **Tablet/Mobile**: Vista de 1 columna (formulario arriba, carritos abajo)

## 🔧 Configuración del Backend

Asegúrate de que el backend esté corriendo en: `http://localhost:3000`

La URL se configura en: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🎯 Endpoints Necesarios

El Modo Live requiere que el backend tenga los siguientes endpoints:

### Products
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID

### Customers
- `GET /api/customers` - Obtener todos los clientes
- `POST /api/customers` - Crear nuevo cliente
- `GET /api/customers?search=query` - Buscar clientes

### Livestreams
- `POST /api/livestreams/start` - Iniciar livestream
- `POST /api/livestreams/:id/end` - Finalizar livestream
- `GET /api/livestreams/active` - Obtener livestream activo

### Sales
- `GET /api/sales` - Obtener todas las ventas
- `POST /api/sales` - Crear nueva venta
- `PATCH /api/sales/:id/status` - Actualizar estado de venta
- `GET /api/sales?livestreamId=id` - Obtener ventas por livestream

## 🐛 Troubleshooting

### El botón LIVE no aparece en el header
- Verifica que el archivo `header.component.ts` tenga importado `RouterLink`
- Asegúrate de que la ruta `/live-mode` esté configurada en `app.routes.ts`

### Los productos no cargan
- Verifica que el backend esté corriendo
- Revisa la consola del navegador para ver errores de red
- Verifica que la URL del API en `environment.ts` sea correcta

### El cronómetro no funciona
- Asegúrate de que el componente se haya inicializado correctamente
- Revisa la consola para errores de JavaScript

### No puedo cambiar el estado de un carrito
- Verifica que el Live esté activo (no cerrado)
- Revisa los permisos del usuario

## 📚 Documentación Adicional

Para más detalles técnicos, consulta:
- `LIVE_MODE_IMPLEMENTATION.md` - Documentación completa de la implementación
- `readme.md` - Documentación general del proyecto

## 🎉 ¡Disfruta usando el Modo Live!

Si tienes preguntas o encuentras problemas, revisa la documentación o contacta al equipo de desarrollo.
