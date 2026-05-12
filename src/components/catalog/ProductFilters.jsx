import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SlidersHorizontal } from 'lucide-react'

export default function ProductFilters({ filters, onChange }) {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    supabase
      .from('productos')
      .select('categoria')
      .eq('activo', true)
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map(p => p.categoria).filter(Boolean))]
          setCategorias(unique)
        }
      })
  }, [])

  return (
    <aside className="w-full md:w-56 shrink-0">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={16} className="text-gray-500" />
        <span className="font-medium text-sm text-gray-700">Filtros</span>
      </div>

      {/* Categoría */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Categoría</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onChange({ ...filters, categoria: '' })}
            className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
              !filters.categoria
                ? 'bg-brand-50 text-brand-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, categoria: cat })}
              className={`text-left text-sm px-2 py-1.5 rounded-lg transition-colors capitalize ${
                filters.categoria === cat
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Disponibilidad</p>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.soloDisponibles}
            onChange={e => onChange({ ...filters, soloDisponibles: e.target.checked })}
            className="rounded text-brand-600 focus:ring-brand-500"
          />
          Solo con stock
        </label>
      </div>

      {/* Ordenar */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ordenar por</p>
        <select
          value={filters.orden}
          onChange={e => onChange({ ...filters, orden: e.target.value })}
          className="input text-sm"
        >
          <option value="nombre">Nombre A-Z</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="reciente">Más recientes</option>
        </select>
      </div>
    </aside>
  )
}
