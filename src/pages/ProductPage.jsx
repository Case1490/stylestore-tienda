import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../store/cartStore'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore(s => s.addItem)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTalla, setSelectedTalla] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) navigate('/catalogo')
        else {
          setProduct(data)
          if (data.tallas?.length) setSelectedTalla(data.tallas[0])
          if (data.colores?.length) setSelectedColor(data.colores[0])
        }
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, quantity, selectedTalla, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const outOfStock = product.stock === 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={14} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={64} />
            </div>
          )}
        </div>

        {/* Detalles */}
        <div>
          {product.categoria && (
            <p className="text-xs font-medium text-brand-600 uppercase tracking-widest mb-2">
              {product.categoria}
            </p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
          <p className="text-3xl font-bold text-brand-600 mb-4">
            {formatPrice(product.precio)}
          </p>

          {product.descripcion && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.descripcion}</p>
          )}

          {/* Stock */}
          <div className="mb-5">
            {outOfStock ? (
              <span className="text-sm text-red-600 font-medium">Sin stock</span>
            ) : product.stock <= (product.stock_minimo || 5) ? (
              <span className="text-sm text-amber-600 font-medium">
                Últimas {product.stock} unidades
              </span>
            ) : (
              <span className="text-sm text-green-600 font-medium">En stock</span>
            )}
          </div>

          {/* Tallas */}
          {product.tallas?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.tallas.map(talla => (
                  <button
                    key={talla}
                    onClick={() => setSelectedTalla(talla)}
                    className={`px-3.5 py-1.5 text-sm border rounded-lg transition-colors ${
                      selectedTalla === talla
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colores */}
          {product.colores?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Color: <span className="font-normal text-gray-500">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colores.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 text-sm border rounded-lg transition-colors capitalize ${
                      selectedColor === color
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || added}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
          >
            {added ? (
              <><Check size={18} /> Agregado al carrito</>
            ) : outOfStock ? (
              'Sin stock'
            ) : (
              <><ShoppingBag size={18} /> Agregar al carrito</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
