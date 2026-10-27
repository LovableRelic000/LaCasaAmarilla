// client/src/components/admin/ProductForm.jsx
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
  // Atributos opcionales
  attributes: {
    hasMinOrder: false,
    minOrder: 1,
    orderStep: 1,
    saleUnitLabel: 'piezas',

    isConchaBox: false,

    hasFlavors: false,
    flavors: [],
    newFlavorInput: '',

    hasSizes: false,
    sizes: [],

    hasWeight: false,
    weight: '',

    hasAllergens: false,
    allergens: [],

    isSeasonal: false,
    seasonalSeason: '',

    requiresAdvanceNotice: false,
    advanceNoticeHours: 24,

    allowCustomerNotes: false,
  },
};

const ALLERGEN_OPTIONS = [
  'Gluten',
  'Lácteos',
  'Huevo',
  'Nuez / Frutos secos',
  'Soya',
  'Ajonjolí',
  'Cacahuate',
];

function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border">
      <div className="pr-4">
        <span className="font-semibold text-sm text-ink block">{label}</span>
        {description && <span className="text-xs text-ink-soft block">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-caramel' : 'bg-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const { authFetch } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [newFlavor, setNewFlavor] = useState('');

  // Nuevos tamaños temporales
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newSizeAdjustment, setNewSizeAdjustment] = useState('');

  useEffect(() => {
    if (initialData) {
      const initialAttrs =
        typeof initialData.attributes === 'string'
          ? JSON.parse(initialData.attributes)
          : initialData.attributes || {};

      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ?? '',
        image: initialData.image || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || '',
        attributes: {
          ...emptyForm.attributes,
          ...initialAttrs,
          flavors: initialAttrs.flavors || [],
          sizes: initialAttrs.sizes || [],
          allergens: initialAttrs.allergens || [],
        },
      });
    } else {
      setForm(emptyForm);
    }
    setUploadError('');
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttrChange = (attrField, value) => {
    setForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attrField]: value,
      },
    }));
  };

  const handleAddFlavor = () => {
    if (!newFlavor.trim()) return;
    const currentFlavors = form.attributes.flavors || [];
    if (!currentFlavors.includes(newFlavor.trim())) {
      handleAttrChange('flavors', [...currentFlavors, newFlavor.trim()]);
    }
    setNewFlavor('');
  };

  const handleRemoveFlavor = (flv) => {
    handleAttrChange(
      'flavors',
      (form.attributes.flavors || []).filter((f) => f !== flv)
    );
  };

  const handleAddSize = () => {
    if (!newSizeLabel.trim()) return;
    const currentSizes = form.attributes.sizes || [];
    handleAttrChange('sizes', [
      ...currentSizes,
      {
        label: newSizeLabel.trim(),
        priceAdjustment: parseFloat(newSizeAdjustment) || 0,
      },
    ]);
    setNewSizeLabel('');
    setNewSizeAdjustment('');
  };

  const handleRemoveSize = (index) => {
    handleAttrChange(
      'sizes',
      (form.attributes.sizes || []).filter((_, i) => i !== index)
    );
  };

  const handleToggleAllergen = (allergen) => {
    const current = form.attributes.allergens || [];
    if (current.includes(allergen)) {
      handleAttrChange(
        'allergens',
        current.filter((a) => a !== allergen)
      );
    } else {
      handleAttrChange('allergens', [...current, allergen]);
    }
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
    if (!form.name || !form.description || form.price === '' || !form.category) {
      alert('Por favor completa nombre, descripción, precio y categoría.');
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
      attributes: form.attributes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 1. SECCIÓN BÁSICA */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold text-lg text-ink border-b border-border pb-2">
          Información Básica
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
              Nombre del Pan / Producto *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej. Panqué Artesanal de Nuez"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
              Precio Base (MXN) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
            Descripción *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={2}
            placeholder="Describe los ingredientes, aroma y textura del pan..."
            className="w-full px-3.5 py-2 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
            Categoría *
          </label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
            required
          >
            <option value="">Selecciona una categoría...</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subida de foto */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
            Fotografía
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-2 border border-border flex-shrink-0 flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-ink-soft text-xs text-center px-1">Sin foto</span>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageSelect}
                disabled={uploading}
                className="w-full text-xs text-ink file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold/15 file:text-ink file:font-semibold hover:file:bg-gold/25 disabled:opacity-60 cursor-pointer"
              />
              {uploading && <p className="text-xs text-caramel mt-1">Subiendo imagen...</p>}
              {uploadError && <p className="text-xs text-rust mt-1">{uploadError}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN DE OPCIONES Y TOGGLES */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-display font-semibold text-lg text-ink">
            Opciones y Variantes del Pan (Toggles)
          </h3>
          <span className="text-xs text-ink-soft">Activa las que correspondan</span>
        </div>

        {/* TOGGLE 1: Incrementos / Venta por docena o mínimo */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Venta por docenas o cantidad mínima"
            description="Para panes como hamburguesa o banquetes vendidos en lotes de 6, 12, etc."
            checked={form.attributes.hasMinOrder}
            onChange={(checked) => handleAttrChange('hasMinOrder', checked)}
          />
          {form.attributes.hasMinOrder && (
            <div className="p-4 bg-surface rounded-xl border border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Cantidad mínima</label>
                <input
                  type="number"
                  min="1"
                  value={form.attributes.minOrder}
                  onChange={(e) => handleAttrChange('minOrder', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Paso de incremento</label>
                <input
                  type="number"
                  min="1"
                  value={form.attributes.orderStep}
                  onChange={(e) => handleAttrChange('orderStep', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Etiqueta</label>
                <input
                  type="text"
                  placeholder="ej. docena (12 pzas)"
                  value={form.attributes.saleUnitLabel}
                  onChange={(e) => handleAttrChange('saleUnitLabel', e.target.value)}
                  className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
                />
              </div>
            </div>
          )}
        </div>

        {/* TOGGLE 2: Selector Interactivo de Conchas */}
        <ToggleSwitch
          label="Activar Selector Visual de Caja (Arma tu caja)"
          description="Abre la caja interactiva de conchas para que el cliente elija sabor por sabor."
          checked={form.attributes.isConchaBox}
          onChange={(checked) => handleAttrChange('isConchaBox', checked)}
        />

        {/* TOGGLE 3: Sabores / Variantes */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Múltiples Sabores o Variantes"
            description="Para panes como panqués (Nuez, Pasas, Plátano, Marmoleado, Limón)."
            checked={form.attributes.hasFlavors}
            onChange={(checked) => handleAttrChange('hasFlavors', checked)}
          />
          {form.attributes.hasFlavors && (
            <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFlavor}
                  onChange={(e) => setNewFlavor(e.target.value)}
                  placeholder="Agregar sabor (ej. Plátano)..."
                  className="flex-1 px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
                />
                <button
                  type="button"
                  onClick={handleAddFlavor}
                  className="px-4 py-1.5 bg-gold text-[#2B1B12] rounded-lg text-xs font-bold"
                >
                  + Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(form.attributes.flavors || []).map((flv) => (
                  <span
                    key={flv}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 border border-border rounded-full text-xs font-medium text-ink"
                  >
                    {flv}
                    <button
                      type="button"
                      onClick={() => handleRemoveFlavor(flv)}
                      className="text-ink-soft hover:text-rust font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TOGGLE 4: Tamaños y Precios */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Tamaños / Presentaciones con Ajuste de Precio"
            description="Para roscas chicas/grandes, porciones individuales o enteras."
            checked={form.attributes.hasSizes}
            onChange={(checked) => handleAttrChange('hasSizes', checked)}
          />
          {form.attributes.hasSizes && (
            <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nombre tamaño (ej. Grande 10-12 pax)"
                  value={newSizeLabel}
                  onChange={(e) => setNewSizeLabel(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 bg-bg border border-border rounded-lg text-xs text-ink"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="+$ extra (ej. 120)"
                    value={newSizeAdjustment}
                    onChange={(e) => setNewSizeAdjustment(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-bg border border-border rounded-lg text-xs text-ink"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1.5 bg-gold text-[#2B1B12] rounded-lg text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {(form.attributes.sizes || []).map((sz, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-2 text-xs border border-border"
                  >
                    <span className="font-medium text-ink">{sz.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-caramel font-bold">
                        {sz.priceAdjustment >= 0 ? `+$${sz.priceAdjustment}` : `-$${Math.abs(sz.priceAdjustment)}`} MXN
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="text-ink-soft hover:text-rust font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TOGGLE 5: Peso Aproximado */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Especificar Peso del Pan"
            description="Informa a los clientes el peso aproximado (ej. 500g, 1kg)."
            checked={form.attributes.hasWeight}
            onChange={(checked) => handleAttrChange('hasWeight', checked)}
          />
          {form.attributes.hasWeight && (
            <div className="p-3 bg-surface rounded-xl border border-border">
              <input
                type="text"
                placeholder="ej. 600g aprox. o 80g por pieza"
                value={form.attributes.weight || ''}
                onChange={(e) => handleAttrChange('weight', e.target.value)}
                className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
              />
            </div>
          )}
        </div>

        {/* TOGGLE 6: Alérgenos */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Información de Alérgenos"
            description="Advierte de ingredientes como gluten, nueces, huevo o lácteos."
            checked={form.attributes.hasAllergens}
            onChange={(checked) => handleAttrChange('hasAllergens', checked)}
          />
          {form.attributes.hasAllergens && (
            <div className="p-3 bg-surface rounded-xl border border-border flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((alg) => {
                const isSelected = (form.attributes.allergens || []).includes(alg);
                return (
                  <button
                    key={alg}
                    type="button"
                    onClick={() => handleToggleAllergen(alg)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-caramel text-surface border-caramel'
                        : 'bg-surface-2 border-border text-ink-soft hover:border-caramel'
                    }`}
                  >
                    {isSelected ? `✓ ${alg}` : `+ ${alg}`}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* TOGGLE 7: Producto de Temporada */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Producto de Temporada"
            description="Muestra el distintivo festivo y lo incluye en la pestaña de Menú de Temporada."
            checked={form.attributes.isSeasonal}
            onChange={(checked) => handleAttrChange('isSeasonal', checked)}
          />
          {form.attributes.isSeasonal && (
            <div className="p-3 bg-surface rounded-xl border border-border">
              <input
                type="text"
                placeholder="Época (ej. Otoño / Día de Muertos o Navidad)"
                value={form.attributes.seasonalSeason || ''}
                onChange={(e) => handleAttrChange('seasonalSeason', e.target.value)}
                className="w-full px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
              />
            </div>
          )}
        </div>

        {/* TOGGLE 8: Pedido con Anticipación */}
        <div className="space-y-3">
          <ToggleSwitch
            label="Requiere Pedido con Anticipación"
            description="Para masas madre, roscas o pedidos especiales que toman más tiempo de fermentación."
            checked={form.attributes.requiresAdvanceNotice}
            onChange={(checked) => handleAttrChange('requiresAdvanceNotice', checked)}
          />
          {form.attributes.requiresAdvanceNotice && (
            <div className="p-3 bg-surface rounded-xl border border-border flex items-center gap-3">
              <span className="text-xs text-ink-soft">Horas de anticipación requeridas:</span>
              <input
                type="number"
                min="1"
                value={form.attributes.advanceNoticeHours || 24}
                onChange={(e) =>
                  handleAttrChange('advanceNoticeHours', parseInt(e.target.value) || 24)
                }
                className="w-24 px-3 py-1.5 bg-bg border border-border rounded-lg text-sm text-ink"
              />
            </div>
          )}
        </div>

        {/* TOGGLE 9: Dedicatoria o Notas */}
        <ToggleSwitch
          label="Permitir Dedicatoria o Nota Especial del Cliente"
          description="Habilita un campo en el modal del cliente para mensajes de pastel o instrucciones de horneado."
          checked={form.attributes.allowCustomerNotes}
          onChange={(checked) => handleAttrChange('allowCustomerNotes', checked)}
        />
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-3 bg-gold hover:brightness-95 disabled:opacity-60 text-[#2B1B12] rounded-full font-bold text-sm transition-all shadow-sm"
        >
          {initialData ? 'Guardar Cambios' : 'Agregar Pan al Catálogo'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-border hover:border-gold text-ink rounded-full font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}