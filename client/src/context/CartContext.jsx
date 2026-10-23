// client/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'casaAmarillaCart';

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Aseguramos que cada elemento tenga un cartItemId único
    return parsed.map((item) => ({
      ...item,
      cartItemId: item.cartItemId || (item.options ? `${item.product.id}-${JSON.stringify(item.options)}` : `${item.product.id}`),
    }));
  } catch (err) {
    console.error('No se pudo leer el carrito guardado:', err);
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCartFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('No se pudo guardar el carrito:', err);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, options = null) => {
    const cartItemId = options
      ? `${product.id}-${JSON.stringify(options)}`
      : `${product.id}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, product, quantity, options }];
    });
  };

  const removeFromCart = (cartItemIdOrId) => {
    setItems((prev) =>
      prev.filter(
        (item) => item.cartItemId !== cartItemIdOrId && item.product.id !== cartItemIdOrId
      )
    );
  };

  const updateQuantity = (cartItemIdOrId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemIdOrId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemIdOrId || item.product.id === cartItemIdOrId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const getItemPrice = (item) => {
    // Si la opción define un precio específico (como tamaño de caja de conchas o tamaño de rosca)
    if (item.options && typeof item.options.price === 'number') {
      return item.options.price;
    }
    return item.product.price;
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * getItemPrice(item),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}