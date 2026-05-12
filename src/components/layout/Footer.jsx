import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-bold text-lg">Style<span className="text-brand-600">Store</span></p>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              Ropa y accesorios con estilo. Envíos a todo el país.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-gray-600">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-gray-900">Tienda</p>
              <Link to="/catalogo" className="hover:text-gray-900">Catálogo</Link>
              <Link to="/catalogo?categoria=ropa" className="hover:text-gray-900">Ropa</Link>
              <Link to="/catalogo?categoria=accesorios" className="hover:text-gray-900">Accesorios</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-gray-900">Cuenta</p>
              <Link to="/auth" className="hover:text-gray-900">Ingresar</Link>
              <Link to="/mis-pedidos" className="hover:text-gray-900">Mis pedidos</Link>
              <Link to="/carrito" className="hover:text-gray-900">Carrito</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} StyleStore. Proyecto de portafolio.
        </div>
      </div>
    </footer>
  )
}
