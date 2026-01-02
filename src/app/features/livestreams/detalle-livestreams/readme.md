Quiero que trabajes en este componente (detalle-livestreams), yo lo copie de otro proyecto y lo pegué acá...

pero la idea es la siguiente...

actualmente es un formulario, yo no quiero esto, yo quiero que se muestren los datos que vendrán del backend...

así que reemplaza los campos para formularios como input, por un tipo label o text o lo que aplique

son tres componentes hijos, tab-costeo, tab-identificacion y indices-proyectos

en indices-proyectos estarán los datos generales del livestream de venta (montos totales, etc.)

y en los tabs, se reparirá según esta lógica:

Dashboard de Métricas de Livestream
Necesito crear un dashboard completo para mostrar las métricas de un livestream. El endpoint GET /api/livestreams/:id/stats devuelve la siguiente estructura de datos:

📊 Estructura del Response
{
  "success": true,
  "data": {
    "livestream": {
      "id": "string",
      "title": "string",
      "platform": "instagram" | "tiktok" | "youtube" | "other",
      "viewerCount": number,
      "startedAt": "ISO date",
      "endedAt": "ISO date | null",
      "isActive": boolean
    },
    "stats": {
      "totalSales": number,
      "confirmedSales": number,
      "pendingSales": number,
      "cancelledSales": number,
      "totalRevenue": number,
      "totalUnitsSold": number,
      "averageTicket": number,
      "durationMinutes": number,
      "isActive": boolean,
      "totalEstimatedAmount": number,
      "totalClosedAmount": number,
      "averageCartAmount": number,
      "averageProductsPerCart": number,
      "closureRate": number,
      "totalCustomers": number,
      "totalProductsSold": number,
      "averageProductsPerCustomer": number
    },
    "topProducts": [
      {
        "liveItemId": "string",
        "categoryName": "string",
        "price": number,
        "quantity": number,
        "totalRevenue": number,
        "imageUrl": "string | null"
      }
    ],
    "topCustomers": [
      {
        "customerId": "string",
        "customerName": "string",
        "totalPurchases": number,
        "totalSpent": number,
        "productsCount": number
      }
    ],
    "attributesWithPercentages": {
      "[attributeName]": [
        {
          "value": "string",
          "count": number,
          "revenue": number,
          "percentage": number
        }
      ]
    }
  }
}

Componentes a Crear
1. Header del Livestream
Mostrar:

Título del live
Plataforma (con icono)
Estado (Activo/Cerrado)
Duración en formato legible (ej: "5 horas 55 minutos")
Fecha de inicio
2. Grid de Métricas Principales (Cards)
Crear cards destacadas con:

Monto Total Vendido: stats.totalRevenue (formato moneda)
Ventas Totales: stats.totalSales
Clientes Únicos: stats.totalCustomers
Productos Vendidos: stats.totalProductsSold
Ticket Promedio: stats.averageTicket (formato moneda)
Tasa de Conversión: stats.closureRate (formato porcentaje con 2 decimales)
3. Barra de Progreso: Monto Vendido vs Estimado
Mostrar:

stats.totalClosedAmount (monto confirmado) vs stats.totalEstimatedAmount (total del inventario)
Usar una barra de progreso visual
Mostrar porcentaje: (totalClosedAmount / totalEstimatedAmount) * 100
Labels: "$X de $Y vendido" y "Inventario restante: $Z"
4. Métricas Secundarias (Grid pequeño)
Ventas Confirmadas: stats.confirmedSales (color verde)
Ventas Pendientes: stats.pendingSales (color amarillo)
Ventas Canceladas: stats.cancelledSales (color rojo)
Productos por Carrito: stats.averageProductsPerCart (formato decimal)
Productos por Cliente: stats.averageProductsPerCustomer (formato decimal)
5. Tabla: Productos Más Vendidos
Columnas:

Imagen del producto (usar imageUrl o placeholder)
Categoría (categoryName)
Precio unitario (price - formato moneda)
Cantidad vendida (quantity)
Revenue total (totalRevenue - formato moneda)
Ordenar por quantity descendente. Mostrar los primeros 10.

6. Tabla: Clientes que Más Compraron
Columnas:

Nombre del cliente (customerName)
Total de compras (totalPurchases)
Productos comprados (productsCount)
Total gastado (totalSpent - formato moneda)
Ordenar por totalSpent descendente. Mostrar los primeros 10.

7. Gráficos de Torta/Dona por Atributo
Para cada key en attributesWithPercentages, crear un gráfico circular:

Título: Nombre del atributo (ej: "Color", "Talla", "Prenda")
Datos: usar el campo percentage de cada valor
Labels: usar el campo value
Tooltip: mostrar count (cantidad) y revenue (revenue en formato moneda)
Colores: usar hexCode si existe, o una paleta de colores predeterminada

Consideraciones de UX
Formato de Moneda: Usar formato chileno (ej: $5.500 con punto para miles)
Números: Usar separadores de miles para legibilidad
Porcentajes: Mostrar con máximo 2 decimales
Estado del Live:
Si isActive === true: badge verde "En Vivo"
Si isActive === false: badge gris "Finalizado"
Loading States: Mostrar skeleton loaders mientras carga la data
Empty States: Si los arrays están vacíos, mostrar mensaje apropiado
Responsive: El dashboard debe funcionar en móvil y desktop
Colores:
Verde: para métricas positivas y confirmadas
Amarillo/Naranja: para pendientes
Rojo: para canceladas
Azul: para información neutral

 Librerías Sugeridas
Gráficos: Chart.js con react-chartjs-2 o Recharts
Tablas: TanStack Table o una tabla personalizada
Iconos: Lucide React o Heroicons
Formato de números: Intl.NumberFormat o librería como numeral.js
Por favor, crea un componente completo LivestreamDashboard que consuma este endpoint y renderice todos estos elementos de manera organizada y visualmente atractiva.