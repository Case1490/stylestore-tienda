import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package } from 'lucide-react'

export default function OrderSuccessPage() {
  const { state } = useLocation()

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
      <p className="text-gray-500 mb-2">
        Tu compra fue procesada exitosamente.
      </p>
      {state?.ordenId && (
        <p className="text-xs text-gray-400 mb-8 font-mono">
          Orden #{state.ordenId.slice(0, 8).toUpperCase()}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/mis-pedidos" className="btn-primary flex items-center justify-center gap-2">
          <Package size={16} /> Ver mis pedidos
        </Link>
        <Link to="/catalogo" className="btn-secondary">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
