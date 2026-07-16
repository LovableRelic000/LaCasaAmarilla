// src/components/product/ProductModal.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="bg-surface rounded-2xl shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-square bg-surface-2 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23FDF8ED"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23C97F3C"%3ELa Casa Amarilla%3C/text%3E%3C/svg%3E';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-surface/90 hover:bg-surface rounded-full p-2 shadow-md"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h2 id="product-modal-title" className="font-display text-2xl font-semibold text-ink mb-2">
            {product.name}
          </h2>
          <p className="text-ink-soft mb-4">{product.description}</p>
          <span className="font-hand text-3xl font-bold text-caramel -rotate-1 inline-block mb-6">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-ink font-medium text-sm">Cantidad</span>
            <div className="flex items-center border border-border rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
                className="w-9 h-9 flex items-center justify-center text-ink hover:text-caramel font-bold text-lg"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-ink">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
                className="w-9 h-9 flex items-center justify-center text-ink hover:text-caramel font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-3.5 rounded-full font-semibold text-[#2B1B12] bg-gold hover:brightness-95 transition-[filter] shadow-sm"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}