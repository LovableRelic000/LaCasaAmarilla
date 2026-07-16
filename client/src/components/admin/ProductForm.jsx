// src/components/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/store';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  subcategory: '',
};

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const { authFetch } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ?? '',
        image: initialData.image || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || '',
      });
    } else {
      setForm(emptyForm);
    }
    setUploadError('');
  }, [initialData]);

  const selectedCategory = CATEGORIES[form.category];

  const subcategoryOptions = selectedCategory?.subcategories
    ? Object.entries(selectedCategory.subcategories)
    : [];

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        next.subcategory = '';
      }
      return next;
    });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no puede pesar más de 5MB.');
      return;
    }

    const body = new FormData();
    body.append('image', file);

    setUploading(true);
    try {
      const res = await authFetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir la imagen.');
      handleChange('image', data.path);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      alert('Por favor completa al menos nombre, descripción, precio y categoría.');
      return;
    }

    if (parseFloat(form.price) < 0) {
      alert('El precio no puede ser un número negativo.');
      return;
    }

    onSubmit({
      ...form,
      price: parseFloat(form.price),
      subcategory: form.subcategory || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1">Nombre</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">Precio (MXN)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => handleChange('price', e.target.value)}
          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">Foto del producto</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-2 border border-border flex-shrink-0 flex items-center justify-center">
            {form.image ? (
              <img src={form.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-ink-soft text-xs text-center px-1">Sin imagen</span>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageSelect}
              disabled={uploading}
              className="w-full text-sm text-ink file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold/15 file:text-ink file:font-semibold hover:file:bg-gold/25 disabled:opacity-60"
            />
            {uploading && <p className="text-xs text-caramel mt-1">Subiendo imagen...</p>}
            {uploadError && <p className="text-xs text-rust mt-1">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
          >
            <option value="">Selecciona...</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Subcategoría</label>
          <select
            value={form.subcategory}
            onChange={(e) => handleChange('subcategory', e.target.value)}
            disabled={subcategoryOptions.length === 0}
            className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel disabled:opacity-50"
          >
            <option value="">
              {subcategoryOptions.length === 0 ? 'No aplica' : 'Selecciona...'}
            </option>
            {subcategoryOptions.map(([key, sub]) => (
              <option key={key} value={key}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2.5 bg-gold hover:brightness-95 disabled:opacity-60 text-[#2B1B12] rounded-full font-semibold transition-[filter]"
        >
          {initialData ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-border hover:border-gold text-ink rounded-full font-semibold transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}