import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import CartItem from '../components/cart/CartItem'

export default function CartPage() {
  const items = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const total = items.reduce((sum, i) => sum + i.product.precio * i.quantity, 0)
  const formatPrice = (p) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p)

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-400 text-sm mb-8">Agrega productos desde el catálogo</p>
        <Link to="/catalogo" className="btn-primary inline-flex">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tu carrito ({items.reduce((s, i) => s + i.quantity, 0)} artículos)
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1">
          <div className="card p-4">
            {items.map(item => (
              <CartItem key={item.key} item={item} />
            ))}
          </div>
          <button
            onClick={clearCart}
            className="mt-3 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="lg:w-72 shrink-0">
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Proceder al pago <ArrowRight size={16} />
            </button>
            <Link
              to="/catalogo"
              className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
