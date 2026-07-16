// src/pages/CartPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { WHATSAPP_PHONE, INSTAGRAM_USER } from '../config/contact';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [copied, setCopied] = useState(false);

  const generarTextoPedido = () => {
    let mensaje = "Hola, La Casa Amarilla. Me gustaría realizar el siguiente pedido desde el sitio web:\n\n";
    items.forEach(({ product, quantity }) => {
      mensaje += `• ${quantity}x ${product.name} ($${(product.price * quantity).toFixed(2)} MXN)\n`;
    });
    mensaje += `\nTotal estimado: $${totalPrice.toFixed(2)} MXN\n\n`;
    mensaje += "Quedo al pendiente de su confirmación. ¡Muchas gracias!";
    return mensaje;
  };

  const registrarPedido = async () => {
    try {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            quantity,
            price: product.price,
          })),
          total: totalPrice,
        }),
      });
    } catch (err) {
      console.error('No se pudo registrar el pedido:', err);
      // No bloqueamos el flujo del cliente si esto falla — el mensaje de WhatsApp/Instagram sigue siendo lo importante
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
      console.error("No se pudo copiar el texto automáticamente", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink mb-4">Carrito de compras</h1>
        <div className="bg-surface-2 border border-dashed border-border rounded-2xl py-14">
          <p className="text-ink-soft mb-6">Tu carrito está vacío.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full font-semibold transition-[filter]"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">Carrito de compras</h1>

      <div className="flex flex-col gap-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4 shadow-sm"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
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

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink truncate">{product.name}</h3>
              <p className="text-sm text-ink-soft line-clamp-1">{product.description}</p>
              <span className="font-hand text-xl font-bold text-caramel">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center border border-border rounded-full flex-shrink-0">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-ink hover:text-caramel font-bold"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold text-ink text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-ink hover:text-caramel font-bold"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(product.id)}
              className="text-ink-soft hover:text-rust transition-colors flex-shrink-0"
              aria-label="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface-2 border border-border rounded-xl p-6 flex justify-between items-center mb-6">
        <span className="font-medium text-ink">Total estimado</span>
        <span className="font-hand text-3xl font-bold text-caramel">
          ${totalPrice.toFixed(2)} MXN
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleWhatsAppOrder}
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-95 text-white font-semibold py-3.5 px-6 rounded-full shadow-sm transition-[filter]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.449 5.412 1.451 5.428 0 9.85-4.417 9.853-9.842.002-2.628-1.01-5.1-2.852-6.946C17.162 1.868 14.693.85 12.012.85c-5.432 0-9.854 4.416-9.857 9.843A9.782 9.782 0 003.62 15.6l-.37 1.354 1.435-.374 1.488.882zm11.421-7.143c-.307-.153-1.815-.896-2.096-.998-.281-.102-.485-.153-.689.153-.204.306-.791.998-.969 1.203-.178.204-.357.229-.664.077-1.125-.563-1.921-.98-2.686-2.296-.201-.344.201-.32.576-1.071.077-.153.038-.286-.019-.393-.057-.107-.485-1.173-.664-1.606-.174-.419-.365-.362-.501-.369l-.428-.008c-.148 0-.388.056-.592.28-.204.224-.778.76-.778 1.852 0 1.091.797 2.145.908 2.296.112.152 1.569 2.395 3.8 3.359.531.23 1.002.38 1.346.488.533.169 1.019.145 1.402.089.428-.063 1.815-.742 2.071-1.458.255-.715.255-1.327.179-1.453-.077-.127-.282-.204-.589-.357z"/>
          </svg>
          Enviar pedido por WhatsApp
        </button>

        <button
          onClick={handleInstagramOrder}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-95 text-white font-semibold py-3.5 px-6 rounded-full shadow-sm transition-[filter]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
          {copied ? "¡Copiado! Abriendo Instagram..." : "Copiar pedido e ir a Instagram"}
        </button>
      </div>

      <p className="text-sm text-ink-soft mt-4 text-center">
        El mensaje se abrirá en la app de destino para que puedas agregar notas adicionales (como la fecha de entrega) antes de enviarlo.
      </p>
    </div>
  );
}