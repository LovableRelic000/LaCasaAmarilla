// src/components/admin/DiscontinuedList.jsx
import { useState } from 'react';
import { CATEGORIES } from '../../data/store';

export default function DiscontinuedList({ products, onReactivate }) {
  const [assigning, setAssigning] = useState(null);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [type, setType] = useState('');

  const startAssign = (product) => {
    setAssigning(product.id);
    setCategory('');
    setSubcategory('');
    setType('');
  };

  const selectedCategory = CATEGORIES[category];
  const subcategoryOptions = selectedCategory?.subcategories
    ? Object.entries(selectedCategory.subcategories)
    : [];

  let typeOptions = [];
  if (selectedCategory) {
    if (subcategory && selectedCategory.subcategories?.[subcategory]?.types) {
      typeOptions = Object.entries(selectedCategory.subcategories[subcategory].types);
    } else if (!selectedCategory.subcategories && selectedCategory.types) {
      typeOptions = Object.entries(selectedCategory.types);
    }
  }

  const handleConfirm = (product) => {
    if (!category) {
      alert('Selecciona una categoría para reactivar el producto.');
      return;
    }
    onReactivate(product.id, {
      category,
      subcategory: subcategory || null,
      type: type || null,
    });
    setAssigning(null);
  };

  if (products.length === 0) {
    return (
      <p className="text-ink-soft text-center py-8">
        No hay productos descontinuados o fuera de temporada.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <div key={product.id} className="bg-surface border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23FDF8ED"/%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink truncate">{product.name}</h3>
              <p className="text-sm text-ink-soft line-clamp-1">{product.description}</p>
              <span className="font-hand text-lg font-bold text-caramel">
                ${product.price.toFixed(2)}
              </span>
            </div>
            {assigning !== product.id && (
              <button
                onClick={() => startAssign(product)}
                className="px-4 py-2 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full text-sm font-semibold transition-[filter] flex-shrink-0"
              >
                Activar
              </button>
            )}
          </div>

          {assigning === product.id && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-ink mb-3">Asignar a una sección:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSubcategory(''); setType(''); }}
                  className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
                >
                  <option value="">Categoría...</option>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>

                <select
                  value={subcategory}
                  onChange={(e) => { setSubcategory(e.target.value); setType(''); }}
                  disabled={subcategoryOptions.length === 0}
                  className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-caramel disabled:opacity-50"
                >
                  <option value="">{subcategoryOptions.length === 0 ? 'No aplica' : 'Subcategoría...'}</option>
                  {subcategoryOptions.map(([key, sub]) => (
                    <option key={key} value={key}>{sub.label}</option>
                  ))}
                </select>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={typeOptions.length === 0}
                  className="px-3 py-2 bg-bg border border-border rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-caramel disabled:opacity-50"
                >
                  <option value="">{typeOptions.length === 0 ? 'No aplica' : 'Tipo...'}</option>
                  {typeOptions.map(([key, t]) => (
                    <option key={key} value={key}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(product)}
                  className="px-4 py-2 bg-gold hover:brightness-95 text-[#2B1B12] rounded-lg text-sm font-semibold transition-[filter]"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setAssigning(null)}
                  className="px-4 py-2 border border-border hover:border-caramel text-ink rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}