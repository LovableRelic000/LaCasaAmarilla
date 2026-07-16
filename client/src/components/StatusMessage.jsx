// src/components/StatusMessage.jsx
export default function StatusMessage({ type = 'error', message, onRetry }) {
  const isError = type === 'error';
  return (
    <div
      className={`rounded-2xl border py-12 px-6 text-center ${
        isError ? 'bg-rust/10 border-rust/30' : 'bg-surface-2 border-dashed border-border'
      }`}
    >
      <p className={`text-sm mb-4 ${isError ? 'text-rust' : 'text-ink-soft'}`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full text-sm font-semibold transition-[filter]"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}