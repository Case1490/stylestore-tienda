import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/catalog/ProductCard'
import ProductFilters from '../components/catalog/ProductFilters'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [filters, setFilters] = useState({
    categoria: searchParams.get('categoria') || '',
    soloDisponibles: false,
    orden: 'nombre',
  })

  useEffect(() => {
    fetchProducts()
  }, [filters, search])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('productos')
      .select('*')
      .eq('activo', true)

    if (filters.categoria) {
      query = query.ilike('categoria', `%${filters.categoria}%`)
    }
    if (filters.soloDisponibles) {
      query = query.gt('stock', 0)
    }
    if (search) {
      query = query.ilike('nombre', `%${search}%`)
    }

    switch (filters.orden) {
      case 'precio_asc':   query = query.order('precio', { ascending: true }); break
      case 'precio_desc':  query = query.order('precio', { ascending: false }); break
      case 'reciente':     query = query.order('created_at', { ascending: false }); break
      default:             query = query.order('nombre', { ascending: true })
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    if (newFilters.categoria) {
      setSearchParams({ categoria: newFilters.categoria })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? '...' : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <ProductFilters filters={filters} onChange={handleFiltersChange} />

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No se encontraron productos</p>
              <p className="text-sm mt-1">Prueba con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
