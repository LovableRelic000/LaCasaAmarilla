// src/components/product/ProductCard.jsx
import { isDozenProduct } from '../../utils/productUtils';

export default function ProductCard({ product, onOpen }) {
  const priceNum = Number(product?.price) || 0;
  const isDozen = isDozenProduct(product);
  const isConchaBox = product?.category === 'conchas' || product?.attributes?.isConchaBox;

  return (
    <button
      onClick={() => onOpen(product)}
      className="group bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden text-left flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-caramel/50"
    >
      <div className="aspect-square bg-surface-2 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23FDF8ED"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23C97F3C"%3ELa Casa Amarilla%3C/text%3E%3C/svg%3E';
          }}
        />
        {isDozen && (
          <span className="absolute top-2 left-2 bg-amber-900/80 backdrop-blur-xs text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Docena
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        <div>
          {/* Título: 2 líneas con altura mínima uniforme para que no se corte prematuramente */}
          <h3
            className="font-display font-semibold text-ink text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Subtítulo / Descripción: oculto en móvil para dar espacio limpio al título, visible en pantallas mayores */}
          <p className="hidden sm:block text-xs sm:text-sm text-ink-soft line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Precio destacado al pie */}
        <div className="pt-1 mt-auto flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1">
            <span className="font-hand text-xl sm:text-2xl font-bold text-caramel -rotate-1 inline-block">
              ${priceNum.toFixed(2)}
            </span>
            {isDozen && (
              <span className="text-[10px] sm:text-xs text-ink-soft font-medium">
                /docena
              </span>
            )}
            {isConchaBox && (
              <span className="text-[10px] sm:text-xs text-ink-soft font-medium">
                caja
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}