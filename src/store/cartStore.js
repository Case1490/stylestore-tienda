import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, talla = null, color = null) => {
        const { items } = get()
        const key = `${product.id}-${talla}-${color}`
        const existing = items.find(i => i.key === key)

        if (existing) {
          set({
            items: items.map(i =>
              i.key === key
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              { key, product, quantity, talla, color },
            ],
          })
        }
      },

      removeItem: (key) => {
        set({ items: get().items.filter(i => i.key !== key) })
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key)
          return
        }
        set({
          items: get().items.map(i =>
            i.key === key ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get totalPrice() {
        return get().items.reduce(
          (sum, i) => sum + i.product.precio * i.quantity,
          0
        )
      },
    }),
    {
      name: 'carrito-tienda',
    }
  )
)
