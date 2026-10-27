// client/src/components/conchas/ConchaBoxBuilder.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const FLAVORS = [
  {
    id: 'fresa',
    name: 'Fresa',
    colorClass: 'bg-rose-400 text-white',
    crustColor: '#F43F5E',
    baseColor: '#FFE4E6',
    accentText: 'text-rose-600 dark:text-rose-400',
    description: 'Cubierta dulce de fresa silvestre',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    colorClass: 'bg-amber-900 text-amber-50',
    crustColor: '#532914',
    baseColor: '#3E1C0A',
    accentText: 'text-amber-800 dark:text-amber-300',
    description: 'Pasta de cacao oscuro y azúcar',
  },
  {
    id: 'vainilla',
    name: 'Vainilla',
    colorClass: 'bg-amber-300 text-amber-950',
    crustColor: '#EAB308',
    baseColor: '#FEF08A',
    accentText: 'text-amber-600 dark:text-amber-400',
    description: 'Tradicional cubierta aromática de vainilla',
  },
];

const BOX_SIZES = [
  { size: 6, label: 'Media Docena', pieces: 6, price: 110, gridCols: 'grid-cols-3' },
  { size: 12, label: 'Docena Completa', pieces: 12, price: 210, gridCols: 'grid-cols-4 sm:grid-cols-6' },
];

function ConchaGraphic({ flavorId, size = 'md' }) {
  const flavor = FLAVORS.find((f) => f.id === flavorId);
  const sizeClass =
    size === 'lg'
      ? 'w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14'
      : size === 'sm'
      ? 'w-7 h-7 sm:w-8 sm:h-8'
      : 'w-8 h-8 sm:w-10 sm:h-10';

  if (!flavor) {
    return (
      <div
        className={`${sizeClass} rounded-full border-2 border-dashed border-border flex items-center justify-center text-ink-soft/40 transition-all`}
      >
        <span className="text-xs font-bold">+</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClass} rounded-full shadow-sm sm:shadow-md flex items-center justify-center overflow-hidden transition-transform transform hover:scale-105 flex-shrink-0`}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${flavor.baseColor}, ${flavor.crustColor})`,
        border: '2px solid rgba(255, 255, 255, 0.5)',
      }}
      title={`Concha de ${flavor.name}`}
    >
      {/* Patrón concha (arcos tradicionales) */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full opacity-70 p-0.5 sm:p-1 pointer-events-none"
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <path d="M50 15 C 30 15, 20 40, 20 80" />
        <path d="M50 15 C 40 25, 35 50, 35 85" />
        <path d="M50 15 C 50 35, 50 60, 50 88" />
        <path d="M50 15 C 60 25, 65 50, 65 85" />
        <path d="M50 15 C 70 15, 80 40, 80 80" />
        <path d="M22 45 Q 50 35, 78 45" />
        <path d="M20 65 Q 50 55, 80 65" />
      </svg>
      <span className="sr-only">Concha de {flavor.name}</span>
    </div>
  );
}

export default function ConchaBoxBuilder({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedBoxSize, setSelectedBoxSize] = useState(6);
  // Array of flavor IDs representing each slot in the box
  const [boxSlots, setBoxSlots] = useState(Array(6).fill(null));
  const [activeFlavor, setActiveFlavor] = useState('vainilla');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentBoxConfig = BOX_SIZES.find((b) => b.size === selectedBoxSize) || BOX_SIZES[0];
  const filledCount = boxSlots.filter(Boolean).length;
  const isFull = filledCount === selectedBoxSize;

  // Counts by flavor
  const counts = {
    fresa: boxSlots.filter((f) => f === 'fresa').length,
    chocolate: boxSlots.filter((f) => f === 'chocolate').length,
    vainilla: boxSlots.filter((f) => f === 'vainilla').length,
  };

  const handleSizeChange = (newSize) => {
    setSelectedBoxSize(newSize);
    setBoxSlots((prev) => {
      if (newSize > prev.length) {
        return [...prev, ...Array(newSize - prev.length).fill(null)];
      } else {
        return prev.slice(0, newSize);
      }
    });
  };

  // Add one concha of a flavor to the first empty slot
  const addFlavor = (flavorId) => {
    const emptyIndex = boxSlots.findIndex((s) => s === null);
    if (emptyIndex !== -1) {
      const next = [...boxSlots];
      next[emptyIndex] = flavorId;
      setBoxSlots(next);
      setActiveFlavor(flavorId);
    }
  };

  // Remove one concha of a flavor
  const removeFlavor = (flavorId) => {
    const lastIndex = [...boxSlots].reverse().findIndex((s) => s === flavorId);
    if (lastIndex !== -1) {
      const actualIndex = boxSlots.length - 1 - lastIndex;
      const next = [...boxSlots];
      next[actualIndex] = null;
      setBoxSlots(next);
    }
  };

  // Click slot directly
  const handleSlotClick = (index) => {
    const next = [...boxSlots];
    if (next[index]) {
      next[index] = null;
    } else {
      next[index] = activeFlavor;
    }
    setBoxSlots(next);
  };

  // Preset: fill evenly
  const handleFillEvenly = () => {
    const next = [];
    const perFlavor = Math.floor(selectedBoxSize / 3);
    const remainder = selectedBoxSize % 3;

    for (let i = 0; i < perFlavor; i++) next.push('vainilla');
    for (let i = 0; i < perFlavor; i++) next.push('chocolate');
    for (let i = 0; i < perFlavor + remainder; i++) next.push('fresa');

    setBoxSlots(next);
  };

  const handleClear = () => {
    setBoxSlots(Array(selectedBoxSize).fill(null));
  };

  const handleAddToCart = () => {
    if (!isFull) return;

    const breakdown = [];
    if (counts.vainilla > 0) breakdown.push(`${counts.vainilla} Vainilla`);
    if (counts.chocolate > 0) breakdown.push(`${counts.chocolate} Chocolate`);
    if (counts.fresa > 0) breakdown.push(`${counts.fresa} Fresa`);
    const summary = breakdown.join(', ');

    const itemProduct = {
      ...(product || {
        id: 301,
        name: 'Caja de Conchas Tradicionales',
        image: '/img/products/caja-conchas.jpg',
        category: 'conchas',
      }),
      price: currentBoxConfig.price,
    };

    addToCart(itemProduct, 1, {
      boxSize: selectedBoxSize,
      boxLabel: currentBoxConfig.label,
      flavors: counts,
      summary,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-2 sm:p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="concha-builder-title"
        className="bg-surface border border-border rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera fija del constructor (siempre visible) */}
        <div className="p-3.5 sm:p-4 border-b border-border bg-surface-2 flex items-center justify-between flex-shrink-0">
          <div className="pr-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-gold/20 text-caramel">
                Interactivo
              </span>
              <h2 id="concha-builder-title" className="font-display text-lg sm:text-2xl font-bold text-ink">
                Arma tu Caja de Conchas
              </h2>
            </div>
            <p className="text-ink-soft text-xs sm:text-sm mt-0.5 line-clamp-1">
              Selecciona tu tamaño y llena la caja con tus sabores favoritos
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-surface border border-border hover:bg-surface-2 text-ink transition-colors flex-shrink-0 shadow-sm"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Cuerpo scrolleable del modal */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Selector de tamaño de caja (al inicio, visible inmediatamente) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
              1. Selecciona el tamaño de la caja:
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {BOX_SIZES.map((box) => (
                <button
                  key={box.size}
                  type="button"
                  onClick={() => handleSizeChange(box.size)}
                  className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                    selectedBoxSize === box.size
                      ? 'border-caramel bg-caramel/10 shadow-sm'
                      : 'border-border hover:border-caramel/50 bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-ink text-sm sm:text-base">{box.label}</span>
                    <span className="font-hand text-base sm:text-lg font-bold text-caramel">
                      ${box.price} MXN
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-ink-soft block mt-0.5">
                    {box.pieces} conchas artesanales
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Caja visual de panadería */}
          <div className="bg-surface-2 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-border shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-caramel animate-pulse" />
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  Caja de panadería ({filledCount}/{selectedBoxSize} conchas)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillEvenly}
                  className="text-xs text-caramel hover:underline font-semibold"
                >
                  Surtido parejo
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-ink-soft hover:text-rust font-semibold"
                >
                  Vaciar
                </button>
              </div>
            </div>

            {/* Grid de la caja con conchas visuales */}
            <div className={`grid ${currentBoxConfig.gridCols} gap-2 sm:gap-3 justify-items-center py-1 sm:py-2`}>
              {boxSlots.map((flavorId, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSlotClick(idx)}
                  className="flex flex-col items-center gap-1 focus:outline-none group"
                >
                  <ConchaGraphic flavorId={flavorId} size="lg" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-ink-soft group-hover:text-caramel transition-colors truncate max-w-[70px] text-center">
                    {flavorId
                      ? FLAVORS.find((f) => f.id === flavorId)?.name
                      : `Espacio ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>

            {/* Barra de progreso */}
            <div className="mt-3 pt-2.5 border-t border-border/60">
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border">
                <div
                  className="bg-gradient-to-r from-gold to-caramel h-full transition-all duration-300"
                  style={{ width: `${(filledCount / selectedBoxSize) * 100}%` }}
                />
              </div>
              <p className="text-[11px] sm:text-xs text-ink-soft text-center mt-1.5 font-medium">
                {isFull
                  ? '✓ ¡Tu caja está completa y lista para ordenar!'
                  : `Agrega ${selectedBoxSize - filledCount} conchas más para completar la caja.`}
              </p>
            </div>
          </div>

          {/* Panel de sabores y controles +/- */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
              2. Elige las cantidades por sabor:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FLAVORS.map((flavor) => {
                const count = counts[flavor.id];
                return (
                  <div
                    key={flavor.id}
                    className="p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-border bg-surface flex items-center justify-between sm:flex-col sm:items-stretch gap-2 shadow-sm hover:border-caramel/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ConchaGraphic flavorId={flavor.id} size="sm" />
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-ink">{flavor.name}</h4>
                        <span className="text-[10px] sm:text-[11px] text-ink-soft hidden sm:block leading-tight">
                          {flavor.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t-0 sm:border-t border-border sm:pt-2">
                      <span className="text-[11px] text-ink-soft font-medium hidden sm:inline">Cantidad:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => removeFlavor(flavor.id)}
                          disabled={count === 0}
                          className="w-7 h-7 rounded-full bg-surface-2 hover:bg-border text-ink font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          aria-label={`Quitar concha de ${flavor.name}`}
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-bold text-sm text-ink">{count}</span>
                        <button
                          type="button"
                          onClick={() => addFlavor(flavor.id)}
                          disabled={isFull}
                          className="w-7 h-7 rounded-full bg-gold hover:brightness-95 text-[#2B1B12] font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                          aria-label={`Agregar concha de ${flavor.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer fijo con total y botón de compra (siempre visible) */}
        <div className="p-3.5 sm:p-4 border-t border-border bg-surface-2 flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            <span className="text-[10px] sm:text-xs text-ink-soft font-medium uppercase tracking-wider block">
              Total ({currentBoxConfig.label})
            </span>
            <span className="font-hand text-2xl sm:text-3xl font-bold text-caramel">
              ${currentBoxConfig.price}.00 MXN
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-5 py-2.5 sm:py-3 border border-border hover:border-gold text-ink rounded-full font-semibold text-xs sm:text-sm transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isFull || addedSuccess}
              className={`px-4 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : isFull
                  ? 'bg-gold hover:brightness-95 text-[#2B1B12]'
                  : 'bg-border text-ink-soft cursor-not-allowed'
              }`}
            >
              {addedSuccess ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>¡Caja agregada!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Agregar al Carrito</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
