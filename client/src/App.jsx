// client/src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ADMIN_PATH } from './config/adminPath';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import ProductModal from './components/product/ProductModal';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to={`/${ADMIN_PATH}`} replace />;
  return children;
}

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError(false);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Respuesta no válida del servidor.');
      const data = await res.json();
      const productosNormalizados = data.map((producto) => ({
        ...producto,
        price: Number(producto.price),
      }));
      setProducts(productosNormalizados);
    } catch (error) {
      console.error('Error al conectar con la API de productos:', error);
      setProductsError(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <Breadcrumb />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                onOpenProduct={setSelectedProduct}
                loading={loadingProducts}
                error={productsError}
                onRetry={fetchProducts}
              />
            }
          />
          <Route
            path="/categoria/:category"
            element={
              <CategoryPage
                products={products}
                onOpenProduct={setSelectedProduct}
                loading={loadingProducts}
                error={productsError}
                onRetry={fetchProducts}
              />
            }
          />
          <Route
            path="/categoria/:category/:subcategory"
            element={
              <CategoryPage
                products={products}
                onOpenProduct={setSelectedProduct}
                loading={loadingProducts}
                error={productsError}
                onRetry={fetchProducts}
              />
            }
          />
          <Route
            path="/categoria/:category/:subcategory/:type"
            element={
              <CategoryPage
                products={products}
                onOpenProduct={setSelectedProduct}
                loading={loadingProducts}
                error={productsError}
                onRetry={fetchProducts}
              />
            }
          />
          <Route path="/carrito" element={<CartPage />} />
          <Route path={`/${ADMIN_PATH}`} element={<LoginPage />} />
          <Route
            path={`/${ADMIN_PATH}/panel`}
            element={
              <ProtectedRoute>
                <AdminPage
                  products={products}
                  onFetchProducts={fetchProducts}
                  loading={loadingProducts}
                  error={productsError}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}