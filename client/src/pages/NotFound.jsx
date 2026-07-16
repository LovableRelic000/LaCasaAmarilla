// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="font-hand text-2xl text-caramel mb-1">se nos quemó el pan...</p>
      <h1 className="font-display text-5xl font-semibold text-ink mb-4">404</h1>
      <p className="text-ink-soft mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-gold hover:brightness-95 text-[#2B1B12] rounded-full font-semibold transition-[filter]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}