// client/src/pages/CartPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WHATSAPP_PHONE, INSTAGRAM_USER } from '../config/contact';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice, getItemPrice } = useCart();
  const [copied, setCopied] = useState(false);

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
    let mensaje = '🥖 *PEDIDO - LA CASA AMARILLA*\n';
    mensaje += 'Hola, me gustaría confirmar el siguiente pedido desde el sitio web:\n\n';

    items.forEach((item, index) => {
      const { product, quantity, options } = item;
      const unitPrice = getItemPrice(item);
      const subtotal = (unitPrice * quantity).toFixed(2);
      mensaje += `*${index + 1}. ${quantity}x ${product.name}* — $${subtotal} MXN\n`;

      const optionsText = formatItemOptions(options);
      if (optionsText) {
        mensaje += `   ↳ _${optionsText}_\n`;
      }
    });

    mensaje += `\n💰 *Total estimado:* $${totalPrice.toFixed(2)} MXN\n\n`;
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
      setTimeout(() => setCopied(false), 3000);
      setTimeout(() => {
        window.open(`https://instagram.com/${INSTAGRAM_USER}`, '_blank');
      }, 1200);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Carrito de compras</h1>
          <p className="text-sm text-ink-soft mt-1">
            Revisa tus selecciones antes de confirmar tu pedido
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-caramel hover:underline"
        >
          + Seguir agregando
        </button>
      </div>

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

      {/* Resumen del pedido y botón WhatsApp */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <span className="text-ink font-medium">Total estimado del pedido</span>
          <span className="font-hand text-3xl font-bold text-caramel">
            ${totalPrice.toFixed(2)} MXN
          </span>
        </div>

        <p className="text-xs text-ink-soft mb-6 leading-relaxed">
          * Al enviar tu pedido, nos pondremos en contacto contigo para confirmar la hora de horneado, entrega o recolección en sucursal.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 py-3.5 px-6 rounded-full font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Pedir por WhatsApp
          </button>

          <button
            onClick={handleInstagramOrder}
            className="flex-1 py-3.5 px-6 rounded-full font-semibold text-ink border border-border hover:border-caramel hover:bg-surface-2 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current text-rose-500" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            {copied ? '¡Copiado! Abriendo Instagram...' : 'Copiar y pedir por Instagram'}
          </button>
        </div>
      </div>
    </div>
  );
}