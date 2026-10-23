// client/src/components/product/ProductModal.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import ConchaBoxBuilder from '../conchas/ConchaBoxBuilder';
import { TemporadaIcon } from '../icons/BakeryIcons';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const attributes = product?.attributes || {};

  // Si es caja de conchas, delegamos directamente al constructor visual
  if (attributes.isConchaBox || product?.category === 'conchas') {
    return <ConchaBoxBuilder product={product} onClose={onClose} />;
  }

  const step = attributes.orderStep || (attributes.hasMinOrder ? attributes.minOrder : 1) || 1;
  const minQty = (attributes.hasMinOrder ? attributes.minOrder : 1) || 1;

  const [quantity, setQuantity] = useState(minQty);
  const [selectedFlavor, setSelectedFlavor] = useState(
    attributes.defaultFlavor || (attributes.flavors ? attributes.flavors[0] : null)
  );
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [customerNotes, setCustomerNotes] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Cálculo de precio según tamaño
  const basePrice = Number(product.price) || 0;
  const selectedSizeObj = attributes.hasSizes && attributes.sizes ? attributes.sizes[selectedSizeIndex] : null;
  const currentUnitPrice = basePrice + (selectedSizeObj?.priceAdjustment || 0);

  const handleAdd = () => {
    const options = {};
    if (selectedFlavor) options.flavor = selectedFlavor;
    if (selectedSizeObj) options.size = selectedSizeObj.label;
    if (customerNotes.trim()) options.customerNotes = customerNotes.trim();
    if (selectedSizeObj) options.price = currentUnitPrice;

    const summaryParts = [];
    if (selectedFlavor) summaryParts.push(`Sabor: ${selectedFlavor}`);
    if (selectedSizeObj) summaryParts.push(selectedSizeObj.label);
    if (options.customerNotes) summaryParts.push(`Nota: "${options.customerNotes}"`);
    if (summaryParts.length > 0) options.summary = summaryParts.join(' | ');

    addToCart(product, quantity, Object.keys(options).length > 0 ? options : null);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="bg-surface rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[92vh] overflow-y-auto border border-border my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video sm:aspect-[4/3] bg-surface-2 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23FDF8ED"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23C97F3C"%3ELa Casa Amarilla%3C/text%3E%3C/svg%3E';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-surface/90 hover:bg-surface text-ink rounded-full p-2.5 shadow-md transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {attributes.isSeasonal && (
            <span className="absolute bottom-3 left-3 bg-amber-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1.5">
              <TemporadaIcon className="w-3.5 h-3.5" />
              <span>Edición de Temporada</span>
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 id="product-modal-title" className="font-display text-2xl font-bold text-ink">
              {product.name}
            </h2>
            <span className="font-hand text-3xl font-bold text-caramel whitespace-nowrap">
              ${(currentUnitPrice * quantity).toFixed(2)}
            </span>
          </div>

          <p className="text-ink-soft text-sm leading-relaxed mb-4">{product.description}</p>

          {/* Avisos de anticipación o peso */}
          <div className="flex flex-wrap gap-2 mb-5">
            {attributes.hasWeight && attributes.weight && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-2 text-ink-soft border border-border">
                <svg className="w-3.5 h-3.5 text-caramel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 8l6-5 6 5M3 13l3-5 3 5a3 3 0 01-6 0zm12 0l3-5 3 5a3 3 0 01-6 0z" />
                </svg>
                <span>{attributes.weight}</span>
              </span>
            )}
            {attributes.requiresAdvanceNotice && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
                <span>Requiere pedido con {attributes.advanceNoticeHours || 24}h de anticipación</span>
              </span>
            )}
            {attributes.hasMinOrder && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-2 text-caramel border border-border">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Venta por incrementos de {step} piezas</span>
              </span>
            )}
          </div>

          {/* Selector de Sabores */}
          {attributes.hasFlavors && attributes.flavors?.length > 0 && (
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
                Elige tu sabor:
              </label>
              <div className="flex flex-wrap gap-2">
                {attributes.flavors.map((flv) => (
                  <button
                    key={flv}
                    type="button"
                    onClick={() => setSelectedFlavor(flv)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selectedFlavor === flv
                        ? 'bg-gold border-gold text-[#2B1B12] shadow-sm'
                        : 'bg-surface border-border text-ink hover:border-caramel'
                    }`}
                  >
                    {flv}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Tamaños */}
          {attributes.hasSizes && attributes.sizes?.length > 0 && (
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
                Tamaño o presentación:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attributes.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      selectedSizeIndex === idx
                        ? 'border-caramel bg-caramel/10 text-ink shadow-sm'
                        : 'border-border bg-surface text-ink hover:border-caramel/50'
                    }`}
                  >
                    <div>{sz.label}</div>
                    <div className="text-[11px] text-caramel mt-0.5 font-bold">
                      ${(basePrice + sz.priceAdjustment).toFixed(2)} MXN
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Alérgenos */}
          {attributes.hasAllergens && attributes.allergens?.length > 0 && (
            <div className="mb-5 text-xs text-ink-soft flex items-center gap-1.5">
              <span className="font-semibold text-ink">Alérgenos:</span>
              <span>{attributes.allergens.join(', ')}</span>
            </div>
          )}

          {/* Notas o dedicatoria */}
          {attributes.allowCustomerNotes && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-ink mb-1">
                Dedicatoria o nota especial (opcional):
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Ej. Feliz cumpleaños Sofía..."
                className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-ink text-xs focus:outline-none focus:ring-2 focus:ring-caramel"
              />
            </div>
          )}

          {/* Controles de Cantidad y Agregar */}
          <div className="pt-4 border-t border-border flex items-center gap-4">
            <div className="flex items-center border border-border rounded-full bg-surface-2">
              <button
                onClick={() => setQuantity((q) => Math.max(minQty, q - step))}
                aria-label="Disminuir cantidad"
                disabled={quantity <= minQty}
                className="w-10 h-10 flex items-center justify-center text-ink hover:text-caramel font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center font-bold text-sm text-ink">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + step)}
                aria-label="Aumentar cantidad"
                className="w-10 h-10 flex items-center justify-center text-ink hover:text-caramel font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedToast}
              className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                addedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gold hover:brightness-95 text-[#2B1B12]'
              }`}
            >
              {addedToast ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Agregado al carrito!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}