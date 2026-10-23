// client/src/pages/CategoryPage.jsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStoredCategories } from '../data/store';
import { getSectionsForPage } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import StatusMessage from '../components/StatusMessage';
import ConchaBoxBuilder from '../components/conchas/ConchaBoxBuilder';

export default function CategoryPage({ products, onOpenProduct, loading, error, onRetry }) {
  const { category, subcategory, type } = useParams();
  const categories = getStoredCategories();
  const cat = categories[category];
  const [showConchaBuilder, setShowConchaBuilder] = useState(false);

  if (!cat) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-ink mb-2">Categoría no encontrada</h2>
        <p className="text-ink-soft text-sm mb-6">
          La categoría que buscas no existe o fue modificada.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-gold text-[#2B1B12] rounded-full font-semibold text-sm"
        >
          Regresar al inicio
        </Link>
      </div>
    );
  }

  const sections = getSectionsForPage(products, { category, subcategory, type });

  let pageTitle = cat.label;
  if (subcategory && cat.subcategories?.[subcategory]) {
    pageTitle = cat.subcategories[subcategory].label;
  }
  if (type) {
    const typesSource = subcategory ? cat.subcategories?.[subcategory]?.types : cat.types;
    if (typesSource?.[type]) pageTitle = typesSource[type].label;
  }

  const isConchaCategory = category === 'conchas';
  const conchaProduct = products.find((p) => p.attributes?.isConchaBox || p.category === 'conchas');

  const renderSubnav = () => {
    if (!subcategory && !type && cat.subcategories) {
      return (
        <div className="flex flex-wrap gap-2 mb-10">
          {Object.entries(cat.subcategories).map(([key, sub]) => (
            <Link
              key={key}
              to={`/categoria/${category}/${key}`}
              className="px-4 py-2 rounded-full border border-border text-ink-soft hover:text-ink hover:border-caramel hover:bg-surface-2 font-medium text-sm transition-colors"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      );
    }
    return null;
  };

  const isEmpty = sections.length === 0 || sections.every((s) => s.products.length === 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ink">{pageTitle}</h1>
            {cat.isSeasonal && (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Temporada
              </span>
            )}
          </div>
          {cat.description && (
            <p className="text-sm text-ink-soft mt-1 max-w-2xl">{cat.description}</p>
          )}
        </div>

        {isConchaCategory && (
          <button
            type="button"
            onClick={() => setShowConchaBuilder(true)}
            className="px-5 py-2.5 bg-gold hover:brightness-105 text-[#2B1B12] rounded-full font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <span>🍪</span>
            <span>Armar Caja de Conchas</span>
          </button>
        )}
      </div>

      <div className="w-14 h-1 bg-gold rounded-full mb-8" />

      {renderSubnav()}

      {error ? (
        <StatusMessage
          type="error"
          message="No se pudieron cargar los productos. Verifica tu conexión e inténtalo de nuevo."
          onRetry={onRetry}
        />
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="bg-surface-2 border border-dashed border-border rounded-2xl py-14 text-center">
          <p className="text-ink-soft text-sm">
            No hay productos disponibles en esta sección por el momento.
          </p>
        </div>
      ) : (
        sections.map((section, idx) => {
          if (section.products.length === 0) return null;
          return (
            <div key={idx} className="mb-12">
              {section.title && (
                <h2 className="font-display text-xl font-semibold text-ink mb-4">
                  {section.title}
                </h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {section.products.map((product) => (
                  <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Modal de Conchas si se activa */}
      {showConchaBuilder && (
        <ConchaBoxBuilder
          product={conchaProduct}
          onClose={() => setShowConchaBuilder(false)}
        />
      )}
    </div>
  );
}