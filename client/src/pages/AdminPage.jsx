// client/src/pages/AdminPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/store';
import ProductForm from '../components/admin/ProductForm';
import DiscontinuedList from '../components/admin/DiscontinuedList';
import StatusMessage from '../components/StatusMessage';
import PedidosTab from '../components/admin/PedidosTab';
import HeroTab from '../components/admin/HeroTab';
import NoIndex from '../components/NoIndex';

export default function AdminPage({ products, onFetchProducts, loading, error }) {
  const navigate = useNavigate();
  const { authFetch, logout } = useAuth();
  const [tab, setTab] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState('');

  const activeProducts = products.filter((p) => p.status === 'active');
  const discontinuedProducts = products.filter((p) => p.status === 'discontinued');
  const isFeedbackError = feedback.toLowerCase().startsWith('error');

  const handleAddOrEdit = async (formData) => {
    try {
      if (editingProduct) {
        const res = await authFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingProduct, ...formData, status: 'active' }),
        });
        if (res.ok) {
          setFeedback('Producto actualizado correctamente en la base de datos.');
          setEditingProduct(null);
          onFetchProducts();
          setTab('list');
        } else {
          const err = await res.json();
          setFeedback(`Error: ${err.error || 'No se pudo actualizar.'}`);
        }
      } else {
        const res = await authFetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setFeedback('Producto agregado correctamente a la base de datos.');
          onFetchProducts();
          setTab('list');
        } else {
          const err = await res.json();
          setFeedback(`Error: ${err.error || 'No se pudo guardar.'}`);
        }
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error de conexión con el servidor backend.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleReactivate = async (productId, assignment) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;
    try {
      const res = await authFetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetProduct, ...assignment, status: 'active' }),
      });
      if (res.ok) {
        setFeedback('Producto activado y asignado correctamente.');
        onFetchProducts();
        setTab('list');
      } else {
        const err = await res.json();
        setFeedback(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error al reactivar el producto.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDiscontinue = async (productId) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;
    try {
      const res = await authFetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetProduct, status: 'discontinued' }),
      });
      if (res.ok) {
        setFeedback('Producto movido a la sección de fuera de temporada.');
        onFetchProducts();
      } else {
        const err = await res.json();
        setFeedback(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error al descontinuar el producto.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getCategoryLabel = (product) => {
    const cat = CATEGORIES[product.category];
    if (!cat) return '—';
    let label = cat.label;
    if (product.subcategory && cat.subcategories?.[product.subcategory]) {
      label += ` / ${cat.subcategories[product.subcategory].label}`;
    }
    if (product.type) {
      const typesSource = product.subcategory
        ? cat.subcategories?.[product.subcategory]?.types
        : cat.types;
      if (typesSource?.[product.type]) label += ` / ${typesSource[product.type].label}`;
    }
    return label;
  };

  const renderProductListSkeleton = () => (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-[74px] bg-surface border border-border rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <>
    <NoIndex />
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">Panel de Administrador</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-border hover:border-caramel text-ink rounded-full font-medium text-sm transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {feedback && (
        <div
          className={`mb-6 px-4 py-3 border-l-4 rounded-lg text-sm ${
            isFeedbackError ? 'border-rust bg-rust/10 text-rust' : 'border-gold bg-surface-2 text-ink'
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-8 border-b border-border">
        {[
          { key: 'add', label: editingProduct ? 'Editar producto' : 'Agregar producto' },
          { key: 'list', label: `Productos activos (${activeProducts.length})` },
          { key: 'discontinued', label: `Fuera de temporada (${discontinuedProducts.length})` },
          { key: 'pedidos', label: 'Pedidos' },
          { key: 'hero', label: 'Banner principal' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              if (t.key !== 'add') setEditingProduct(null);
            }}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-caramel text-ink' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'add' && (
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">
            {editingProduct ? `Editando: ${editingProduct.name}` : 'Nuevo producto'}
          </h2>
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleAddOrEdit}
            onCancel={editingProduct ? () => setEditingProduct(null) : null}
          />
        </div>
      )}

      {tab === 'list' && (
        error ? (
          <StatusMessage
            type="error"
            message="No se pudieron cargar los productos."
            onRetry={onFetchProducts}
          />
        ) : loading ? (
          renderProductListSkeleton()
        ) : (
          <div className="flex flex-col gap-3">
            {activeProducts.length === 0 && (
              <p className="text-ink-soft text-center py-8">
                No hay productos activos en la base de datos. ¡Prueba agregando uno!
              </p>
            )}
            {activeProducts.map((product) => (
              <div
                key={product.id}
                className="bg-surface border border-border rounded-xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"%3E%3Crect width="56" height="56" fill="%23FDF8ED"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink truncate">{product.name}</h3>
                  <p className="text-xs text-ink-soft">{getCategoryLabel(product)}</p>
                  <span className="font-hand text-lg font-bold text-caramel">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingProduct(product); setTab('add'); }}
                    className="px-3 py-1.5 bg-surface-2 hover:bg-gold/15 border border-border hover:border-caramel text-ink rounded-lg text-sm font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDiscontinue(product.id)}
                    className="px-3 py-1.5 bg-rust/10 hover:bg-rust/20 text-rust rounded-lg text-sm font-medium transition-colors"
                  >
                    Descontinuar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'discontinued' && (
        error ? (
          <StatusMessage
            type="error"
            message="No se pudieron cargar los productos."
            onRetry={onFetchProducts}
          />
        ) : loading ? (
          renderProductListSkeleton()
        ) : (
          <DiscontinuedList products={discontinuedProducts} onReactivate={handleReactivate} />
        )
      )}

      {tab === 'hero' && <HeroTab />}
      {tab === 'pedidos' && <PedidosTab />}
    </div>
    </>
  );
}