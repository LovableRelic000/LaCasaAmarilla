// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import StatusMessage from '../components/StatusMessage';
import { CATEGORIES } from '../data/store';

const CATEGORY_ICONS = {
  'conchas-gourmet': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.5 0-8 3-8 7 0 6 4 10 8 10s8-4 8-10c0-4-3.5-7-8-7z" />
      <path strokeLinecap="round" d="M6 10c1.5-1 3-1.5 6-1.5s4.5.5 6 1.5M5.5 13.5c2-1 4-1.5 6.5-1.5s4.5.5 6.5 1.5M6 17c1.5-.8 3-1.2 6-1.2s4.5.4 6 1.2" />
    </svg>
  ),
  'roles-canela': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" />
      <path strokeLinecap="round" d="M12 5.5a6.5 6.5 0 016.5 6.5M12 8.5a3.5 3.5 0 013.5 3.5M12 11.5a.5.5 0 01.5.5" />
    </svg>
  ),
  pasteles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20v-6a2 2 0 012-2h12a2 2 0 012 2v6M4 20h16M4 20a1 1 0 001 1h14a1 1 0 001-1M8 12V9a2 2 0 012-2h4a2 2 0 012 2v3M12 7V4m0 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
};

export default function HomePage({ products = [], onOpenProduct, loading, error, onRetry }) {
  const featured = products.filter((p) => p.status === 'active').slice(0, 8);

  return (
    <div>
      <HeroBanner />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="text-center mb-10">
          <p className="font-hand text-xl text-caramel -mb-1">nuestras categorías</p>
          <h2 className="font-display text-3xl font-semibold text-ink">Elige tu antojo</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <Link
              key={key}
              to={`/categoria/${key}`}
              className="group bg-surface border border-border rounded-2xl p-7 text-center shadow-sm hover:shadow-md hover:border-caramel hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-caramel inline-flex mb-3 group-hover:scale-110 transition-transform duration-300">
                {CATEGORY_ICONS[key] || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-caramel transition-colors">
                {cat.label}
              </h3>
              <span className="text-xs font-medium text-ink-soft mt-1 block">
                Ver catálogo →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-2 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <p className="font-hand text-xl text-caramel -mb-1">favoritos</p>
            <h2 className="font-display text-3xl font-semibold text-ink">Lo más pedido</h2>
          </div>

          {error ? (
            <StatusMessage
              type="error"
              message="No se pudieron cargar los productos. Verifica tu conexión e inténtalo de nuevo."
              onRetry={onRetry}
            />
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="bg-surface border border-dashed border-border rounded-2xl py-12 text-center max-w-lg mx-auto">
              <p className="text-ink-soft text-sm">
                Estamos preparando nuestras vitrinas.<br />
                ¡Visita el panel de administración para añadir las delicias del día!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}