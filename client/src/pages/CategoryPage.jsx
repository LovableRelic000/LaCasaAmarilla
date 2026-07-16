// src/pages/CategoryPage.jsx
import { Link, useParams } from 'react-router-dom';
import { CATEGORIES } from '../data/store';
import { getSectionsForPage } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import StatusMessage from '../components/StatusMessage';

export default function CategoryPage({ products, onOpenProduct, loading, error, onRetry }) {
  const { category, subcategory, type } = useParams();
  const cat = CATEGORIES[category];

  if (!cat) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-soft">Categoría no encontrada.</p>
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
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">{pageTitle}</h1>
      <div className="w-12 h-1 bg-gold rounded-full mb-8" />

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
    </div>
  );
}