import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/catalog/ProductCard'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .gt('stock', 0)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setFeatured(data || [])
        setLoading(false)
      })
  }, [])

  const categorias = [
    { label: 'Ropa', value: 'ropa', emoji: '👕' },
    { label: 'Accesorios', value: 'accesorios', emoji: '👜' },
    { label: 'Calzado', value: 'calzado', emoji: '👟' },
    { label: 'Novedades', value: '', emoji: '✨' },
  ]

  return (
    <div>
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: `url('/hero.jpg')`,  // 👈 Cambia esto por tu imagen
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Degradado: oscuro a la izquierda, transparente a la derecha */}
        {/* En mobile: oscuro arriba, semitransparente abajo */}
        <div
          className="absolute inset-0"
          style={{
            background: `
        linear-gradient(
          to right,
          rgba(17, 24, 39, 0.97) 0%,
          rgba(17, 24, 39, 0.85) 40%,
          rgba(17, 24, 39, 0.4) 70%,
          rgba(17, 24, 39, 0.05) 100%
        )
      `,
          }}
        />

        {/* Versión mobile: degradado vertical en pantallas pequeñas */}
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background: `
        linear-gradient(
          to bottom,
          rgba(17, 24, 39, 0.92) 0%,
          rgba(17, 24, 39, 0.75) 60%,
          rgba(17, 24, 39, 0.4) 100%
        )
      `,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-3">
              Nueva temporada
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Moda que<br />
              <span className="text-brand-400">te define</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Descubre nuestra colección de ropa y accesorios con estilo. Envíos a todo el país.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-primary flex items-center gap-2">
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <Link to="/catalogo?categoria=novedades" className="btn-secondary text-gray-900">
                Novedades
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Explorar por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias.map(cat => (
            <Link
              key={cat.label}
              to={`/catalogo${cat.value ? `?categoria=${cat.value}` : ''}`}
              className="card p-5 text-center hover:border-brand-200 hover:bg-brand-50 transition-colors group"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="font-medium text-gray-800 group-hover:text-brand-700">
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Productos nuevos</h2>
          <Link
            to="/catalogo"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No hay productos disponibles aún.</p>
            <p className="text-sm mt-1">Agrega productos desde el panel de inventario.</p>
          </div>
        )}
      </section>
    </div>
  )
}
