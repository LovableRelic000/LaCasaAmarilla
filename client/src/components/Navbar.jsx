// src/components/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/store';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `font-medium text-sm transition-colors ${isActive ? 'text-caramel' : 'text-ink-soft hover:text-ink'}`;

  const mobileLinkClass = ({ isActive }) =>
    `text-left px-3 py-2.5 rounded-lg font-medium transition-colors ${
      isActive ? 'text-caramel bg-gold/10' : 'text-ink hover:bg-surface-2'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => { navigate('/'); setMenuOpen(false); }}
            className="flex items-center gap-2.5"
          >
            <img src="/logo.png" alt="La Casa Amarilla" className="h-10 w-10 object-contain rounded-full" />
            <span className="font-display text-lg font-semibold text-ink tracking-tight">
              La Casa Amarilla
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={linkClass}>Inicio</NavLink>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <NavLink key={key} to={`/categoria/${key}`} className={linkClass}>
                {cat.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:flex" />

            <button
              onClick={() => navigate('/carrito')}
              className="relative p-2 text-ink hover:text-caramel transition-colors"
              aria-label="Carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-caramel text-surface text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-ink" aria-label="Menú" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-1 pb-4">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
              Inicio
            </NavLink>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <NavLink key={key} to={`/categoria/${key}`} onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                {cat.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between px-3 pt-3 mt-2 border-t border-border">
              <span className="text-sm text-ink-soft">Tema</span>
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}