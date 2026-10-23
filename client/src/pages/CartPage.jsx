// client/src/pages/CartPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WHATSAPP_PHONE, INSTAGRAM_USER } from '../config/contact';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice, getItemPrice } = useCart();
  const [copied, setCopied] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const formatItemOptions = (options) => {
    if (!options) return null;
    if (options.summary) return options.summary;
    const parts = [];
    if (options.flavor) parts.push(`Sabor: ${options.flavor}`);
    if (options.size) parts.push(`Tamaño: ${options.size}`);
    if (options.customerNotes) parts.push(`Nota: "${options.customerNotes}"`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const generarTextoPedido = () => {
    let mensaje = 'PEDIDO - LA CASA AMARILLA\n';
    mensaje += 'Hola, me gustaría confirmar el siguiente pedido desde el sitio web:\n\n';

    items.forEach((item, index) => {
      const { product, quantity, options } = item;
      const unitPrice = getItemPrice(item);
      const subtotal = (unitPrice * quantity).toFixed(2);
      mensaje += `${index + 1}. ${quantity}x ${product.name} — $${subtotal} MXN\n`;

      const optionsText = formatItemOptions(options);
      if (optionsText) {
        mensaje += `   ↳ ${optionsText}\n`;
      }
    });

    mensaje += `\nTotal estimado: $${totalPrice.toFixed(2)} MXN\n\n`;
    mensaje += 'Quedo al pendiente para confirmar método de pago y horario de entrega o recolección. ¡Muchas gracias!';
    return mensaje;
  };

  const registrarPedido = async () => {
    try {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: getItemPrice(item),
            options: item.options || null,
          })),
          total: totalPrice,
        }),
      });
    } catch (err) {
      console.error('No se pudo registrar el pedido en el servidor:', err);
    }
  };

  const handleWhatsAppOrder = async () => {
    await registrarPedido();
    const texto = generarTextoPedido();
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const handleInstagramOrder = async () => {
    await registrarPedido();
    const texto = generarTextoPedido();
    try {
      await navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
      setTimeout(() => {
        window.open(`https://instagram.com/${INSTAGRAM_USER}`, '_blank');
      }, 1000);
    } catch (err) {
      console.error('No se pudo copiar el texto automáticamente', err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink mb-4">Carrito de compras</h1>
        <div className="bg-surface-2 border border-dashed border-border rounded-2xl py-14 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center text-caramel">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-ink-soft mb-6 text-base">Tu carrito está vacío.</p>
          <button
            onClick={() => navigate('/')}
            className="px-7 py-3 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full font-semibold transition-all shadow-sm"
          >
            Explorar nuestro pan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Carrito de compras</h1>
          <p className="text-sm text-ink-soft mt-1">
            Revisa tus selecciones antes de confirmar tu pedido
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-caramel bg-gold/15 hover:bg-gold/25 border border-gold/40 px-3 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>¿Cómo funciona tu pedido?</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
          >
            + Agregar más pan
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => {
          const { cartItemId, product, quantity, options } = item;
          const unitPrice = getItemPrice(item);
          const optionsText = formatItemOptions(options);

          return (
            <div
              key={cartItemId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-4 shadow-sm hover:border-caramel/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0 border border-border/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23FDF8ED"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-ink text-base">
                    {product.name}
                  </h3>
                  {optionsText && (
                    <div className="mt-1 px-2.5 py-1 bg-surface-2 rounded-md border border-border/60 inline-block text-xs font-medium text-caramel">
                      {optionsText}
                    </div>
                  )}
                  <div className="text-xs text-ink-soft mt-1">
                    ${unitPrice.toFixed(2)} MXN c/u
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                {/* Controles de cantidad */}
                <div className="flex items-center border border-border rounded-full bg-surface-2">
                  <button
                    onClick={() => updateQuantity(cartItemId, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-ink hover:text-caramel font-bold text-base transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(cartItemId, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-ink hover:text-caramel font-bold text-base transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal y botón eliminar */}
                <div className="flex items-center gap-3">
                  <span className="font-hand text-xl font-bold text-caramel min-w-[70px] text-right">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(cartItemId)}
                    className="p-1.5 text-ink-soft hover:text-rust rounded-full hover:bg-surface-2 transition-colors"
                    aria-label="Eliminar producto"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen del pedido y botón WhatsApp / Instagram */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-border pb-4">
          <span className="text-ink font-medium">Total estimado del pedido</span>
          <span className="font-hand text-3xl font-bold text-caramel">
            ${totalPrice.toFixed(2)} MXN
          </span>
        </div>

        {/* Banner informativo sobre el proceso de pago/orden */}
        <div className="p-3.5 rounded-xl bg-surface-2 border border-border/80 flex items-start gap-3 mb-6">
          <svg className="w-5 h-5 text-caramel flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-ink-soft leading-relaxed">
            <span className="font-semibold text-ink">Sin pasarelas ni cobros directos en la página:</span>{' '}
            Tu pedido se envía directamente a nuestro equipo por WhatsApp o Instagram para confirmar la hora de horneado y coordinar el pago (transferencia o contra entrega).{' '}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-caramel font-semibold underline hover:text-ink"
            >
              Ver cómo funciona
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Botón WhatsApp */}
          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 py-3.5 px-6 rounded-full font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2.5 shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.01 4.54-3.69 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.57.13-.17.25-.65.81-.8 0.98-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.87-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.16 1.73 2.64 4.19 3.71.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
            </svg>
            <span>Pedir por WhatsApp</span>
          </button>

          {/* Botón Instagram */}
          <button
            onClick={handleInstagramOrder}
            className="flex-1 py-3.5 px-6 rounded-full font-semibold text-ink border border-border hover:border-[#E1306C] hover:bg-surface-2 transition-all flex items-center justify-center gap-2.5"
          >
            <svg className="w-5 h-5 fill-current text-[#E1306C]" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            <span>{copied ? '¡Copiado! Abriendo Instagram...' : 'Copiar y pedir por Instagram'}</span>
          </button>
        </div>
      </div>

      {/* MODAL EXPLICATIVO: CÓMO HACER TU PEDIDO */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-surface border border-border rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-gold/15 text-caramel">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h3 className="font-display text-xl font-bold text-ink">
                  ¿Cómo funciona tu pedido?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-2 text-ink-soft hover:text-ink transition-colors"
                aria-label="Cerrar modal de ayuda"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-ink leading-relaxed">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border">
                <h4 className="font-bold text-caramel mb-1 flex items-center gap-1.5">
                  <span>1.</span>
                  <span>Sin cobros directos en la página</span>
                </h4>
                <p className="text-ink-soft">
                  No solicitamos tarjetas bancarias ni procesamos pagos aquí. Esta web arma tu pedido exacto para que el pan se hornee fresco y personalizado para ti.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30">
                <h4 className="font-bold text-[#1f9349] dark:text-[#25D366] mb-1 flex items-center gap-1.5">
                  <span>2.</span>
                  <span>Por WhatsApp (El método más rápido)</span>
                </h4>
                <p className="text-ink-soft">
                  Al pulsar el botón verde, se abrirá tu WhatsApp con el mensaje <strong>ya escrito automáticamente</strong> con tus piezas, sabores y total. Solo presionas <strong>Enviar</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#E1306C]/10 border border-[#E1306C]/30">
                <h4 className="font-bold text-[#b5184f] dark:text-[#E1306C] mb-1 flex items-center gap-1.5">
                  <span>3.</span>
                  <span>Por Instagram Direct</span>
                </h4>
                <p className="text-ink-soft">
                  Instagram no permite pre-rellenar texto automáticamente por políticas de Meta. Por eso, al pulsar el botón el texto <strong>se copia a tu portapapeles</strong> y te abre nuestro perfil. En el chat, solo da <strong>Pegar (Ctrl+V o mantener presionado)</strong> y envía el mensaje.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border">
                <h4 className="font-bold text-caramel mb-1 flex items-center gap-1.5">
                  <span>4.</span>
                  <span>Confirmación y Entrega</span>
                </h4>
                <p className="text-ink-soft">
                  Nuestro equipo te responderá de inmediato para confirmar el horario de horneado, coordinar la recolección o entrega, y facilitarte los datos de transferencia o pago contra entrega.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-3 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full font-bold text-sm shadow-sm transition-all"
              >
                ¡Entendido, gracias!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}