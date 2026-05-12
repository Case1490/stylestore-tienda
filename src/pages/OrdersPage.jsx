import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

const ESTADO_LABELS = {
  pendiente:  { label: 'Pendiente',  color: 'bg-amber-50 text-amber-700' },
  pagado:     { label: 'Pagado',     color: 'bg-blue-50 text-blue-700' },
  enviado:    { label: 'Enviado',    color: 'bg-purple-50 text-purple-700' },
  entregado:  { label: 'Entregado', color: 'bg-green-50 text-green-700' },
  cancelado:  { label: 'Cancelado', color: 'bg-red-50 text-red-600' },
}

export default function OrdersPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/auth?redirect=/mis-pedidos'); return }

    supabase
      .from('ordenes')
      .select(`
        *,
        orden_items (
          cantidad,
          precio_unitario,
          talla,
          color,
          productos ( nombre, imagen_url )
        )
      `)
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [user])

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p)

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium text-gray-600">Todavía no tienes pedidos</p>
          <p className="text-sm mt-1 mb-6">Cuando hagas tu primera compra aparecerá aquí</p>
          <Link to="/catalogo" className="btn-primary inline-flex">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const estado = ESTADO_LABELS[order.estado] || ESTADO_LABELS.pendiente
            return (
              <div key={order.id} className="card p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estado.color}`}>
                    {estado.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-3">
                  {order.orden_items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item.productos?.imagen_url && (
                          <img
                            src={item.productos.imagen_url}
                            alt={item.productos.nombre}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 line-clamp-1">{item.productos?.nombre}</p>
                        <p className="text-xs text-gray-400">
                          {[item.talla, item.color].filter(Boolean).join(' · ')} × {item.cantidad}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-700 shrink-0">
                        {formatPrice(item.precio_unitario * item.cantidad)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {order.direccion_envio}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
