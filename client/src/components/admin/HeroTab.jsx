// src/components/admin/HeroTab.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatusMessage from '../StatusMessage';

const MAX_SLIDES = 5;
const emptyForm = { image: '', title: '', subtitle: '' };

export default function HeroTab() {
  const { authFetch } = useAuth();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [draggedId, setDraggedId] = useState(null);

  const fetchSlides = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await authFetch('/api/hero');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSlides(data.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const startEdit = (slide) => {
    setEditing(slide.id);
    setForm({ image: slide.image, title: slide.title, subtitle: slide.subtitle || '' });
  };

  const startNew = () => {
    setEditing('new');
    setForm(emptyForm);
  };

  const cancelForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFeedback('Error: La imagen no puede pesar más de 5MB.');
      return;
    }
    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    try {
      const res = await authFetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir la imagen.');
      setForm((prev) => ({ ...prev, image: data.path }));
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image || !form.title) {
      setFeedback('Error: La imagen y el título son obligatorios.');
      return;
    }
    try {
      const isNew = editing === 'new';
      const payload = { ...form, sort_order: isNew ? slides.length : slides.find((s) => s.id === editing)?.sort_order ?? 0 };
      const res = await authFetch(isNew ? '/api/hero' : `/api/hero/${editing}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar.');
      setFeedback(isNew ? 'Banner agregado correctamente.' : 'Banner actualizado correctamente.');
      cancelForm();
      fetchSlides();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/api/hero/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar.');
      setFeedback('Banner eliminado.');
      fetchSlides();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  // --- Drag and drop para reordenar ---
  const handleDragStart = (id) => setDraggedId(id);

  const handleDragOver = (e, overId) => {
    e.preventDefault();
    if (draggedId === null || draggedId === overId) return;
    setSlides((prev) => {
      const fromIdx = prev.findIndex((s) => s.id === draggedId);
      const toIdx = prev.findIndex((s) => s.id === overId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleDrop = async () => {
    if (draggedId === null) return;
    setDraggedId(null);
    // Persistimos el nuevo orden: cada tarjeta obtiene su índice actual como sort_order
    try {
      await Promise.all(
        slides.map((slide, idx) =>
          authFetch(`/api/hero/${slide.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: slide.image, title: slide.title, subtitle: slide.subtitle, sort_order: idx }),
          })
        )
      );
    } catch (err) {
      console.error(err);
      setFeedback('Error: No se pudo guardar el nuevo orden.');
      fetchSlides();
    }
  };

  if (error) {
    return <StatusMessage type="error" message="No se pudieron cargar los banners." onRetry={fetchSlides} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 bg-surface border border-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const atMax = slides.length >= MAX_SLIDES;
  const isFeedbackError = feedback.toLowerCase().startsWith('error');

  return (
    <div>
      {feedback && (
        <div className={`mb-5 px-4 py-3 border-l-4 rounded-lg text-sm ${
          isFeedbackError ? 'border-rust bg-rust/10 text-rust' : 'border-gold bg-surface-2 text-ink'
        }`}>
          {feedback}
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-ink-soft">{slides.length} de {MAX_SLIDES} banners usados</p>
        {editing === null && (
          <button
            onClick={startNew}
            disabled={atMax}
            title={atMax ? `Ya tienes el máximo de ${MAX_SLIDES} banners` : undefined}
            className="px-4 py-2 bg-gold hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed text-[#2B1B12] rounded-full text-sm font-semibold transition-[filter]"
          >
            + Agregar banner
          </button>
        )}
      </div>
      {slides.length > 1 && (
        <p className="text-xs text-ink-soft mb-4">Arrastra las tarjetas para cambiar el orden en que aparecen.</p>
      )}

      {editing !== null && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-5 mb-5 flex flex-col gap-4">
          <h3 className="font-display font-semibold text-ink">
            {editing === 'new' ? 'Nuevo banner' : 'Editando banner'}
          </h3>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Imagen</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-lg overflow-hidden bg-surface-2 border border-border flex-shrink-0">
                {form.image && <img src={form.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageSelect}
                disabled={uploading}
                className="text-sm text-ink file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold/15 file:text-ink file:font-semibold hover:file:bg-gold/25 disabled:opacity-60"
              />
            </div>
            {uploading && <p className="text-xs text-caramel mt-1">Subiendo imagen...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              maxLength={150}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Subtítulo (opcional)</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
              maxLength={200}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-gold hover:brightness-95 disabled:opacity-60 text-[#2B1B12] rounded-full font-semibold transition-[filter]"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="px-5 py-2.5 border border-border hover:border-caramel text-ink rounded-full font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {slides.map((slide) => (
          <div
            key={slide.id}
            draggable
            onDragStart={() => handleDragStart(slide.id)}
            onDragOver={(e) => handleDragOver(e, slide.id)}
            onDrop={handleDrop}
            onDragEnd={() => setDraggedId(null)}
            className={`bg-surface border border-border rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-move transition-opacity ${
              draggedId === slide.id ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ink-soft flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink truncate">{slide.title}</h3>
              {slide.subtitle && <p className="text-sm text-ink-soft truncate">{slide.subtitle}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => startEdit(slide)}
                className="px-3 py-1.5 bg-surface-2 hover:bg-gold/15 border border-border hover:border-caramel text-ink rounded-lg text-sm font-medium transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                disabled={slides.length <= 1}
                title={slides.length <= 1 ? 'Debe quedar al menos un banner' : undefined}
                className="px-3 py-1.5 bg-rust/10 hover:bg-rust/20 disabled:opacity-40 disabled:cursor-not-allowed text-rust rounded-lg text-sm font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}