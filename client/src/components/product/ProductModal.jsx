// client/src/components/product/ProductModal.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import ConchaBoxBuilder from '../conchas/ConchaBoxBuilder';
import { TemporadaIcon } from '../icons/BakeryIcons';
import { isDozenProduct, parseAttrs } from '../../utils/productUtils';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const attributes = parseAttrs(product);

  // Si es caja de conchas, delegamos directamente al constructor visual
  if (attributes.isConchaBox || product?.category === 'conchas') {
    return <ConchaBoxBuilder product={product} onClose={onClose} />;
  }

  // REGLA ESTRICTA DE DOCENAS:
  // Solo los bollos de banquete y panes de hamburguesa se venden exclusivamente en docenas (12, 24, 36...)
  // Todos los demás panes se venden de 1 en 1 iniciando en 1.
  const isDozen = isDozenProduct(product);
  const step = isDozen ? 12 : 1;
  const minQty = isDozen ? 12 : 1;

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
  const baseUnitPrice = basePrice + (selectedSizeObj?.priceAdjustment || 0);

  // Si es docena, baseUnitPrice es el precio por docena completa (ej. 150),
  // por lo que el precio por pieza es baseUnitPrice / 12
  const unitPrice = isDozen ? baseUnitPrice / 12 : baseUnitPrice;
  const currentTotal = isDozen ? (baseUnitPrice / 12) * quantity : baseUnitPrice * quantity;

  const handleAdd = () => {
    const options = {};
    if (isDozen) {
      options.isDozen = true;
      options.price = unitPrice; // Precio unitario por pieza (ej. $12.50)
      options.pricePerDozen = baseUnitPrice; // Precio por docena (ej. $150.00)
      options.pieces = quantity;
      options.dozens = quantity / 12;
    } else if (selectedSizeObj) {
      options.price = baseUnitPrice;
    }

    if (selectedFlavor) options.flavor = selectedFlavor;
    if (selectedSizeObj) options.size = selectedSizeObj.label;
    if (customerNotes.trim()) options.customerNotes = customerNotes.trim();

    const summaryParts = [];
    if (isDozen) {
      summaryParts.push(`${quantity / 12} ${quantity === 12 ? 'docena' : 'docenas'} (${quantity} pzas)`);
    }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-2 sm:p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="bg-surface rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con imagen y botón cerrar siempre accesible */}
        <div className="aspect-[16/9] sm:aspect-[4/3] max-h-56 sm:max-h-64 bg-surface-2 relative overflow-hidden flex-shrink-0">
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
            className="absolute top-3 right-3 bg-surface/90 hover:bg-surface text-ink rounded-full p-2.5 shadow-md transition-colors z-20"
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

        {/* Contenido scrolleable del producto */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 id="product-modal-title" className="font-display text-xl sm:text-2xl font-bold text-ink">
              {product.name}
            </h2>
            <div className="text-right flex-shrink-0">
              <span className="font-hand text-2xl sm:text-3xl font-bold text-caramel whitespace-nowrap block">
                ${currentTotal.toFixed(2)} MXN
              </span>
              {isDozen && (
                <span className="text-[11px] text-ink-soft block font-medium">
                  ${baseUnitPrice.toFixed(2)} por docena
                </span>
              )}
            </div>
          </div>

          <p className="text-ink-soft text-xs sm:text-sm leading-relaxed mb-4">{product.description}</p>

          {/* LEYENDA DESTACADA PARA VENTA EXCLUSIVA POR DOCENAS */}
          {isDozen && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 mb-4">
              <div className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                <svg className="w-4 h-4 text-caramel flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Venta exclusiva por docenas (12, 24, 36... piezas)</span>
              </div>
              <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                Este pan se elabora exclusivamente en lotes por docena. Cada docena cuesta ${baseUnitPrice.toFixed(2)} MXN (${(baseUnitPrice / 12).toFixed(2)} por pieza).
              </p>
            </div>
          )}

          {/* Avisos adicionales de anticipación o peso */}
          <div className="flex flex-wrap gap-2 mb-4">
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
          </div>

          {/* Selector de Sabores */}
          {attributes.hasFlavors && attributes.flavors?.length > 0 && (
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4 text-xs text-ink-soft flex items-center gap-1.5">
              <span className="font-semibold text-ink">Alérgenos:</span>
              <span>{attributes.allergens.join(', ')}</span>
            </div>
          )}

          {/* Notas o dedicatoria */}
          {attributes.allowCustomerNotes && (
            <div className="mb-4">
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
        </div>

        {/* Footer fijo con Controles de Cantidad y Botón de Agregar (siempre accesible) */}
        <div className="p-3.5 sm:p-5 border-t border-border bg-surface-2 flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div className="flex items-center border border-border rounded-full bg-surface">
            <button
              onClick={() => setQuantity((q) => Math.max(minQty, q - step))}
              aria-label="Disminuir cantidad"
              disabled={quantity <= minQty}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-ink hover:text-caramel font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <div className="px-2 text-center flex flex-col items-center justify-center min-w-[3.5rem]">
              <span className="font-bold text-sm text-ink">{quantity}</span>
              {isDozen && (
                <span className="text-[10px] font-bold text-caramel leading-tight">
                  {quantity / 12} {quantity === 12 ? 'docena' : 'docenas'}
                </span>
              )}
            </div>
            <button
              onClick={() => setQuantity((q) => q + step)}
              aria-label="Aumentar cantidad"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-ink hover:text-caramel font-bold text-lg transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={addedToast}
            className={`flex-1 py-3 px-5 sm:px-6 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
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
                <span>¡Agregado al carrito!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Agregar al carrito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}