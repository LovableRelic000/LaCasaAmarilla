// client/src/components/admin/CategoryManagerTab.jsx
import { useState } from 'react';
import { CATEGORIES, saveStoredCategories } from '../../data/store';

const ICON_OPTIONS = [
  { id: 'cake', label: 'Pastel / Panqué', icon: '🧁' },
  { id: 'cookie', label: 'Concha / Pan dulce', icon: '🍪' },
  { id: 'bread', label: 'Pan de barra', icon: '🍞' },
  { id: 'croissant', label: 'Danés / Hojaldre', icon: '🥐' },
  { id: 'sandwich', label: 'Hamburguesa / Bollos', icon: '🍔' },
  { id: 'sparkles', label: 'Especialidad', icon: '✨' },
  { id: 'circle-dot', label: 'Rosca', icon: '🍩' },
  { id: 'calendar', label: 'Temporada', icon: '🍂' },
  { id: 'utensils', label: 'Banquetes', icon: '🍽️' },
];

export default function CategoryManagerTab({ onCategoryUpdated }) {
  const [categories, setCategories] = useState(CATEGORIES);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    id: '',
    label: '',
    description: '',
    icon: 'cookie',
    isSeasonal: false,
  });

  const [feedback, setFeedback] = useState('');

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleLabelChange = (val) => {
    setForm((prev) => ({
      ...prev,
      label: val,
      id: editingId ? prev.id : slugify(val),
    }));
  };

  const handleEdit = (catId) => {
    const target = categories[catId];
    if (!target) return;
    setEditingId(catId);
    setForm({
      id: catId,
      label: target.label || '',
      description: target.description || '',
      icon: target.icon || 'cookie',
      isSeasonal: Boolean(target.isSeasonal),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      id: '',
      label: '',
      description: '',
      icon: 'cookie',
      isSeasonal: false,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.label || !form.id) {
      alert('Por favor ingresa al menos el nombre y el identificador de la categoría.');
      return;
    }

    const updated = {
      ...categories,
      [form.id]: {
        ...(categories[form.id] || {}),
        id: form.id,
        label: form.label,
        description: form.description,
        icon: form.icon,
        isSeasonal: form.isSeasonal,
        subcategories: categories[form.id]?.subcategories || null,
      },
    };

    setCategories(updated);
    saveStoredCategories(updated);
    if (onCategoryUpdated) onCategoryUpdated(updated);

    setFeedback(`Categoría "${form.label}" guardada con éxito.`);
    handleCancel();
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleDelete = (catId) => {
    if (['conchas', 'panques', 'roscas'].includes(catId)) {
      alert('Esta categoría es parte esencial de la panadería y no puede ser eliminada.');
      return;
    }
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${categories[catId]?.label}"?`)) {
      return;
    }

    const updated = { ...categories };
    delete updated[catId];
    setCategories(updated);
    saveStoredCategories(updated);
    if (onCategoryUpdated) onCategoryUpdated(updated);
    setFeedback('Categoría eliminada.');
    setTimeout(() => setFeedback(''), 3500);
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div className="p-3 bg-gold/15 border-l-4 border-caramel rounded-r-lg text-sm text-ink font-medium">
          {feedback}
        </div>
      )}

      {/* Formulario de nueva/edición de categoría */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-lg text-ink mb-1">
          {editingId ? `Editar Categoría: ${form.label}` : 'Crear Nueva Categoría'}
        </h3>
        <p className="text-xs text-ink-soft mb-6">
          Las categorías creadas aparecerán de inmediato en el menú de navegación y en la página principal.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                placeholder="ej. Galletas Artesanales"
                value={form.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
                Identificador URL (slug) *
              </label>
              <input
                type="text"
                placeholder="ej. galletas-artesanales"
                value={form.id}
                onChange={(e) => setForm((p) => ({ ...p, id: slugify(e.target.value) }))}
                disabled={Boolean(editingId)}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
              Descripción para la vitrina
            </label>
            <textarea
              rows={2}
              placeholder="Breve reseña sobre estos panes para tentar al cliente..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3.5 py-2 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
                Ícono representativo
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, icon: item.id }))}
                    className={`p-2 rounded-xl text-xl border transition-all ${
                      form.icon === item.id
                        ? 'border-caramel bg-caramel/15 shadow-sm'
                        : 'border-border bg-surface-2 hover:border-caramel/40'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSeasonal}
                  onChange={(e) => setForm((p) => ({ ...p, isSeasonal: e.target.checked }))}
                  className="rounded border-border text-caramel focus:ring-caramel h-4 w-4"
                />
                <span className="text-sm font-semibold text-ink">
                  ¿Es una categoría de temporada o festiva?
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full font-bold text-sm shadow-sm transition-all"
            >
              {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 border border-border text-ink rounded-full font-semibold text-sm hover:border-caramel transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de categorías existentes */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-lg text-ink mb-4">
          Categorías Actuales ({Object.keys(categories).length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(categories).map(([key, cat]) => {
            const iconObj = ICON_OPTIONS.find((i) => i.id === cat.icon);
            return (
              <div
                key={key}
                className="p-4 rounded-xl border border-border bg-surface-2 flex items-start justify-between gap-3 shadow-sm hover:border-caramel/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 bg-surface rounded-xl border border-border shadow-xs">
                    {iconObj ? iconObj.icon : '🥖'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold text-ink text-base">
                        {cat.label}
                      </h4>
                      {cat.isSeasonal && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          Temporada
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-caramel font-mono">/categoria/{key}</span>
                    <p className="text-xs text-ink-soft mt-1 line-clamp-2">
                      {cat.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(key)}
                    className="p-1.5 text-ink-soft hover:text-caramel rounded-md transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(key)}
                    className="p-1.5 text-ink-soft hover:text-rust rounded-md transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
