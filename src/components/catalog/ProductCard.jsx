import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)

  const isLowStock = product.stock > 0 && product.stock <= (product.stock_minimo || 5)
  const outOfStock = product.stock === 0

  return (
    <Link to={`/producto/${product.id}`} className="group block">
      <div className="card hover:border-gray-200 transition-all duration-200 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={48} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {outOfStock && (
              <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
                Agotado
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                Últimas unidades
              </span>
            )}
          </div>

          {/* Quick add */}
          {!outOfStock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-2 right-2 bg-white hover:bg-brand-600 hover:text-white text-gray-800 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
              aria-label="Agregar al carrito"
            >
              <ShoppingBag size={16} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {product.categoria && (
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {product.categoria}
            </p>
          )}
          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.nombre}
          </p>
          <p className="text-sm font-semibold text-brand-600 mt-1.5">
            {formatPrice(product.precio)}
          </p>
        </div>
      </div>
    </Link>
  )
}
