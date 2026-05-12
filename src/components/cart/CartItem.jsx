import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore()

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Imagen */}
      <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        {item.product.imagen_url ? (
          <img
            src={item.product.imagen_url}
            alt={item.product.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.product.nombre}</p>
        <div className="flex flex-wrap gap-x-3 mt-1">
          {item.talla && (
            <span className="text-xs text-gray-500">Talla: {item.talla}</span>
          )}
          {item.color && (
            <span className="text-xs text-gray-500">Color: {item.color}</span>
          )}
        </div>
        <p className="text-sm font-semibold text-brand-600 mt-1">
          {formatPrice(item.product.precio)}
        </p>

        {/* Cantidad */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.key, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.key, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Subtotal + eliminar */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <button
          onClick={() => removeItem(item.key)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Eliminar producto"
        >
          <Trash2 size={16} />
        </button>
        <p className="text-sm font-semibold text-gray-900">
          {formatPrice(item.product.precio * item.quantity)}
        </p>
      </div>
    </div>
  )
}
