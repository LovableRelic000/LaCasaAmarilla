// src/components/admin/PedidosTab.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatusMessage from '../StatusMessage';

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  no_llego: 'No llegó',
};

const STATUS_STYLES = {
  pendiente: 'bg-surface-2 text-ink-soft border-border',
  confirmado: 'bg-gold/15 text-caramel border-gold/40',
  no_llego: 'bg-rust/10 text-rust border-rust/30',
};

const parseItems = (items) => {
  if (Array.isArray(items)) return items;
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function PedidosTab() {
  const { authFetch } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notesDraft, setNotesDraft] = useState({});
  const [view, setView] = useState('activos'); // 'activos' | 'historial'

  const fetchPedidos = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await authFetch('/api/pedidos');
      if (!res.ok) throw new Error('Error al obtener pedidos');
      const data = await res.json();
      const normalizados = data.map((p) => ({
        ...p,
        items: parseItems(p.items),
        archived: !!p.archived,
      }));
      setPedidos(normalizados);
      const drafts = {};
      normalizados.forEach((p) => { drafts[p.id] = p.notas || ''; });
      setNotesDraft(drafts);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const updatePedido = async (id, changes) => {
    try {
      await authFetch(`/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
      fetchPedidos();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <StatusMessage type="error" message="No se pudieron cargar los pedidos." onRetry={fetchPedidos} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-surface border border-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const visibles = pedidos.filter((p) => (view === 'activos' ? !p.archived : p.archived));

  return (
    <div>
      <div className="flex gap-1 mb-5 border-b border-border">
        {[
          { key: 'activos', label: `Activos (${pedidos.filter((p) => !p.archived).length})` },
          { key: 'historial', label: `Historial (${pedidos.filter((p) => p.archived).length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px transition-colors ${
              view === t.key ? 'border-caramel text-ink' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="text-ink-soft text-center py-8">
          {view === 'activos'
            ? 'No hay pedidos activos por el momento.'
            : 'Aún no has archivado ningún pedido.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((pedido) => (
            <div key={pedido.id} className="bg-surface border border-border rounded-xl p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-xs text-ink-soft">
                    {new Date(pedido.created_at).toLocaleString('es-MX', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[pedido.status]}`}>
                    {STATUS_LABELS[pedido.status]}
                  </span>
                </div>
                <span className="font-hand text-2xl font-bold text-caramel">
                  ${Number(pedido.total).toFixed(2)}
                </span>
              </div>

              <ul className="text-sm text-ink mb-3 flex flex-col gap-0.5">
                {pedido.items.length === 0 ? (
                  <li className="text-ink-soft italic">No se pudo leer el detalle de este pedido.</li>
                ) : (
                  pedido.items.map((item, idx) => (
                    <li key={idx} className="flex flex-col">
                      <span>• {item.quantity}x {item.name}</span>
                      {item.options?.summary && (
                        <span className="text-xs text-caramel font-medium pl-3">
                          ↳ {item.options.summary}
                        </span>
                      )}
                    </li>
                  ))
                )}
              </ul>

              <textarea
                value={notesDraft[pedido.id] ?? ''}
                onChange={(e) => setNotesDraft((prev) => ({ ...prev, [pedido.id]: e.target.value }))}
                onBlur={() => updatePedido(pedido.id, { notas: notesDraft[pedido.id] })}
                placeholder="Notas (ej. agregó 3 conchas extra por WhatsApp, mensaje especial en el pastel...)"
                rows={2}
                className="w-full text-sm px-3 py-2 bg-bg border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-caramel mb-3"
              />

              <div className="flex gap-2 flex-wrap items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => updatePedido(pedido.id, { status: key })}
                      disabled={pedido.status === key}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        pedido.status === key
                          ? 'bg-surface-2 text-ink-soft cursor-default'
                          : 'border border-border hover:border-caramel text-ink'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {view === 'activos' ? (
                  <button
                    onClick={() => updatePedido(pedido.id, { archived: true })}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-ink/5 hover:bg-ink/10 text-ink-soft transition-colors"
                  >
                    Archivar
                  </button>
                ) : (
                  <button
                    onClick={() => updatePedido(pedido.id, { archived: false })}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:border-caramel text-ink transition-colors"
                  >
                    Restaurar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}