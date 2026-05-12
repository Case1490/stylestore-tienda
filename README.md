# StyleStore — Tienda de Ropa y Accesorios

E-commerce integrado con el sistema de inventario existente en Supabase.

## Setup rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env.local
```
Completa `.env.local` con tus credenciales de Supabase (las mismas del inventario):
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (opcional por ahora)
```

### 3. Correr SQL en Supabase
En el SQL Editor de Supabase, ejecuta el archivo `supabase-migrations.sql`.
Esto agrega las tablas `ordenes` y `orden_items`, y la función `descontar_stock`.

### 4. Levantar el proyecto
```bash
npm run dev
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/     Navbar, Footer, Layout
│   ├── catalog/    ProductCard, ProductFilters
│   └── cart/       CartItem
├── pages/
│   ├── HomePage        Hero + productos destacados
│   ├── CatalogPage     Catálogo con filtros y búsqueda
│   ├── ProductPage     Detalle de producto
│   ├── CartPage        Carrito de compras
│   ├── CheckoutPage    Formulario + pago simulado
│   ├── OrderSuccessPage Confirmación de pedido
│   ├── OrdersPage      Historial de pedidos del usuario
│   └── AuthPage        Login y registro
├── store/
│   ├── cartStore.js    Zustand — carrito persistente en localStorage
│   └── authStore.js    Zustand — sesión de usuario
└── lib/
    └── supabase.js     Cliente de Supabase
```

## Integración con el inventario

- La tabla `productos` es compartida. El inventario la gestiona, la tienda la lee.
- Cuando el cliente compra, `descontar_stock()` descuenta el stock automáticamente.
- El admin del inventario puede ver las órdenes directamente en Supabase
  o puedes agregar una sección de "Pedidos" al panel admin.

## Activar Stripe real (cuando quieras)

1. Crea cuenta en stripe.com (gratis)
2. Obtén las claves de prueba en Dashboard → Developers → API keys
3. Agrega `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` en `.env.local`
4. En `CheckoutPage.jsx`, descomenta las líneas indicadas con el comentario `STRIPE INTEGRATION NOTE`
5. Crea una Supabase Edge Function para el webhook de Stripe

## Scripts
```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm run preview  # Preview del build
```
