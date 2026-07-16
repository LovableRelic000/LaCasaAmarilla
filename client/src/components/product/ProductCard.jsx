// src/components/product/ProductCard.jsx
export default function ProductCard({ product, onOpen }) {
  return (
    <button
      onClick={() => onOpen(product)}
      className="group bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden text-left flex flex-col"
    >
      <div className="aspect-square bg-surface-2 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%23FDF8ED"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23C97F3C"%3ELa Casa Amarilla%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display font-semibold text-ink text-base leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-ink-soft line-clamp-2 flex-1">
          {product.description}
        </p>
        <span className="font-hand text-2xl font-bold text-caramel -rotate-1 inline-block self-start">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </button>
  );
}