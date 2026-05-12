import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

// ─────────────────────────────────────────────
// STRIPE INTEGRATION NOTE:
// Para activar Stripe real, descomenta el import y
// reemplaza simulatePayment() con la llamada real.
// import { loadStripe } from '@stripe/stripe-js'
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
// ─────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: user?.email || '',
    direccion: '',
    ciudad: '',
    telefono: '',
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const total = items.reduce((sum, i) => sum + i.product.precio * i.quantity, 0)
  const formatPrice = (p) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const createOrder = async (stripeSessionId = 'sim_' + Date.now()) => {
    // 1. Crear la orden
    const { data: orden, error: orderError } = await supabase
      .from('ordenes')
      .insert({
        usuario_id: user.id,
        stripe_session_id: stripeSessionId,
        estado: 'pagado',
        total,
        direccion_envio: `${form.direccion}, ${form.ciudad}`,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Insertar items
    const orderItems = items.map(item => ({
      orden_id: orden.id,
      producto_id: item.product.id,
      cantidad: item.quantity,
      precio_unitario: item.product.precio,
      talla: item.talla,
      color: item.color,
    }))

    const { error: itemsError } = await supabase
      .from('orden_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // 3. Descontar stock de cada producto
    for (const item of items) {
      await supabase.rpc('descontar_stock', {
        producto_id: item.product.id,
        cantidad: item.quantity,
      })
    }

    return orden.id
  }

  const simulatePayment = async () => {
    // Simula un delay de procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 1800))
    // En producción con Stripe, aquí redirigirías a Stripe Checkout:
    // const stripe = await stripePromise
    // const { error } = await stripe.redirectToCheckout({ sessionId })
    return 'sim_' + Date.now()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/auth?redirect=/checkout'); return }
    if (items.length === 0) { navigate('/catalogo'); return }

    const requiredFields = ['nombre', 'apellido', 'email', 'direccion', 'ciudad']
    const missing = requiredFields.find(f => !form[f].trim())
    if (missing) { setError('Por favor completa todos los campos obligatorios.'); return }

    setProcessing(true)
    setError('')

    try {
      const sessionId = await simulatePayment()
      const ordenId = await createOrder(sessionId)
      clearCart()
      navigate('/pedido-exitoso', { state: { ordenId } })
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al procesar tu pedido. Intenta de nuevo.')
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    navigate('/carrito')
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario */}
          <div className="flex-1 space-y-6">
            {/* Datos personales */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Datos de contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="input" placeholder="Juan" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Apellido *</label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} className="input" placeholder="García" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="juan@email.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="input" placeholder="+51 999 999 999" />
                </div>
              </div>
            </div>

            {/* Envío */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Dirección de envío</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Dirección *</label>
                  <input name="direccion" value={form.direccion} onChange={handleChange} className="input" placeholder="Av. Larco 123" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ciudad *</label>
                  <input name="ciudad" value={form.ciudad} onChange={handleChange} className="input" placeholder="Lima" />
                </div>
              </div>
            </div>

            {/* Pago simulado */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-900">Pago</h2>
                <span className="ml-auto text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  Modo prueba
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 space-y-1">
                <p className="font-medium text-gray-700">Tarjeta de prueba Stripe:</p>
                <p>Número: <span className="font-mono text-gray-800">4242 4242 4242 4242</span></p>
                <p>Vencimiento: <span className="font-mono text-gray-800">12/26</span> — CVC: <span className="font-mono text-gray-800">123</span></p>
              </div>
              {/* Campos visuales simulados */}
              <div className="mt-3 space-y-2">
                <input readOnly value="4242 4242 4242 4242" className="input font-mono text-gray-400" />
                <div className="grid grid-cols-2 gap-2">
                  <input readOnly value="12/26" className="input font-mono text-gray-400" />
                  <input readOnly value="123" className="input font-mono text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen pedido */}
          <div className="lg:w-72 shrink-0">
            <div className="card p-5 sticky top-20">
              <h2 className="font-semibold text-gray-900 mb-4">Tu pedido</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.key} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                      {item.product.nombre}
                      {item.talla && ` / ${item.talla}`}
                      {' '}×{item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(item.product.precio * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 mb-5">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={processing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Confirmar pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
