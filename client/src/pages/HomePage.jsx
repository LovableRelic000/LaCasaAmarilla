// client/src/pages/HomePage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import StatusMessage from '../components/StatusMessage';
import ConchaBoxBuilder from '../components/conchas/ConchaBoxBuilder';
import { getStoredCategories, getFeaturedCategories } from '../data/store';
import { getCategoryIconComponent, ConchaIcon, TemporadaIcon } from '../components/icons/BakeryIcons';

export default function HomePage({ products = [], onOpenProduct, loading, error, onRetry }) {
  const categories = getStoredCategories();
  const featuredCatKeys = getFeaturedCategories();
  const [showConchaBuilder, setShowConchaBuilder] = useState(false);

  const activeProducts = products.filter((p) => p.status === 'active');
  const featured = activeProducts.slice(0, 8);
  const seasonalProducts = activeProducts.filter(
    (p) => p.category === 'temporada' || p.attributes?.isSeasonal
  );

  const conchaBoxProduct = products.find((p) => p.attributes?.isConchaBox || p.category === 'conchas');

  // Filtramos únicamente las 4 categorías seleccionadas para mostrar en Inicio
  const displayedCategories = featuredCatKeys
    .map((key) => categories[key] ? [key, categories[key]] : null)
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div>
      <HeroBanner />

      {/* BANNER ESPECIAL DE ARMA TU CAJA DE CONCHAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#2A1810] via-[#3D2314] to-[#1F120C] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gold/30">
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
              <ConchaIcon className="w-4 h-4" />
              <span>Experiencia Interactiva</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-amber-50 mb-3">
              Arma tu Caja de Conchas a tu Gusto
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed mb-6">
              Elige media docena o docena completa y selecciona pieza por pieza tus sabores favoritos: fresa, chocolate y vainilla.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setShowConchaBuilder(true)}
                className="px-7 py-3.5 bg-gold hover:brightness-105 text-[#2B1B12] rounded-full font-bold text-sm shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
              >
                <ConchaIcon className="w-5 h-5" />
                <span>Personalizar mi caja ahora</span>
              </button>
              <Link
                to="/categoria/conchas"
                className="text-amber-200 hover:text-white text-xs sm:text-sm font-semibold underline underline-offset-4"
              >
                Ver detalles de conchas →
              </Link>
            </div>
          </div>

          {/* Decoración vectorial de fondo sutil */}
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none text-white select-none">
            <ConchaIcon className="w-80 h-80" />
          </div>
        </div>
      </section>

      {/* 4 CATEGORÍAS DESTACADAS EN INICIO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-10">
          <p className="font-hand text-2xl text-caramel -mb-1">horneado con amor</p>
          <h2 className="font-display text-3xl font-bold text-ink">Especialidades de la Casa</h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 max-w-md mx-auto">
            Descubre nuestras preparaciones más representativas horneadas día a día.
          </p>
        </div>

        {/* Grid de exactamente 4 cuadros */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedCategories.map(([key, cat]) => (
            <Link
              key={key}
              to={`/categoria/${key}`}
              className="group bg-surface border border-border rounded-2xl p-6 text-center shadow-xs hover:shadow-md hover:border-caramel hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between min-h-[220px]"
            >
              <div className="p-3.5 rounded-2xl bg-surface-2 text-caramel group-hover:scale-110 group-hover:bg-gold/15 transition-all duration-300 shadow-xs mb-3">
                {getCategoryIconComponent(cat.icon || key, 'w-7 h-7')}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-display text-base sm:text-lg font-bold text-ink group-hover:text-caramel transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-ink-soft mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <span className="text-xs font-semibold text-caramel mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ver variedad →
              </span>
            </Link>
          ))}
        </div>

        {/* Acceso para ver todas las categorías */}
        <div className="text-center mt-8">
          <Link
            to="/categoria/conchas"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-soft hover:text-caramel transition-colors py-2 px-4 rounded-full border border-border hover:border-caramel bg-surface"
          >
            <span>Ver menú completo en el menú superior</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* SECCIÓN ESPECIAL: MENÚ DE TEMPORADA */}
      {seasonalProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="bg-gradient-to-br from-amber-500/10 via-surface to-surface border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <TemporadaIcon className="w-3.5 h-3.5" />
                  <span>Ediciones Limitadas</span>
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mt-0.5 leading-snug">
                  Especiales de Temporada (Pan de Muerto y Festivos)
                </h2>
              </div>
              <Link
                to="/categoria/temporada"
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-amber-500/50 hover:bg-amber-500/15 text-xs font-bold text-ink transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Ver todo el menú festivo</span>
                <span>→</span>
              </Link>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {seasonalProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAVORITOS DE LA CASA */}
      <section className="bg-surface-2 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="font-hand text-2xl text-caramel -mb-1">favoritos de la panadería</p>
            <h2 className="font-display text-3xl font-bold text-ink">Lo Más Pedido</h2>
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

      {/* MODAL DE CONCHAS INTERACTIVO */}
      {showConchaBuilder && (
        <ConchaBoxBuilder
          product={conchaBoxProduct}
          onClose={() => setShowConchaBuilder(false)}
        />
      )}
    </div>
  );
}