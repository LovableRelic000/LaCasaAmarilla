// client/src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStoredCategories } from '../data/store';
import { getCategoryIconComponent, TemporadaIcon } from './icons/BakeryIcons';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState(getStoredCategories);
  const dropdownRef = useRef(null);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCategories(getStoredCategories());
    setCategoriesOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `font-medium text-sm transition-colors whitespace-nowrap ${
      isActive ? 'text-caramel font-semibold' : 'text-ink-soft hover:text-ink'
    }`;

  const isCategoryActive = location.pathname.startsWith('/categoria/');
  const seasonalCat = categories['temporada'];

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo y Nombre */}
          <button
            onClick={() => {
              navigate('/');
              setMenuOpen(false);
            }}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <img
              src="/logo.png"
              alt="La Casa Amarilla"
              className="h-10 w-10 object-contain rounded-full border border-gold/40 shadow-xs"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-display text-lg sm:text-xl font-bold text-ink tracking-tight">
              La Casa Amarilla
            </span>
          </button>

          {/* Navegación Desktop limpia con Dropdown de Categorías */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>

            {/* Dropdown de Categorías (engloba todas las categorías) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1.5 font-medium text-sm transition-colors ${
                  isCategoryActive && !location.pathname.includes('/temporada')
                    ? 'text-caramel font-semibold'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                <span>Categorías</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesOpen ? 'rotate-180 text-caramel' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-72 bg-surface border border-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-bold text-ink-soft/70 uppercase tracking-wider px-3 py-1.5 border-b border-border mb-1">
                    Catálogo de Panes
                  </div>
                  <div className="max-h-[380px] overflow-y-auto space-y-0.5">
                    {Object.entries(categories).map(([key, cat]) => {
                      const isActive = location.pathname === `/categoria/${key}`;
                      return (
                        <NavLink
                          key={key}
                          to={`/categoria/${key}`}
                          onClick={() => setCategoriesOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                            isActive
                              ? 'bg-gold/15 text-caramel font-semibold'
                              : 'text-ink hover:bg-surface-2 hover:text-caramel'
                          }`}
                        >
                          <span className="text-caramel flex-shrink-0">
                            {getCategoryIconComponent(cat.icon || key, 'w-5 h-5')}
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate">{cat.label}</span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pestaña destacada de Temporada */}
            {seasonalCat && (
              <NavLink
                to="/categoria/temporada"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                  }`
                }
              >
                <TemporadaIcon className="w-3.5 h-3.5" />
                <span>Temporada</span>
              </NavLink>
            )}
          </nav>

          {/* Iconos a la derecha: Tema, Carrito y Botón móvil */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:flex" />

            {/* Botón Carrito */}
            <button
              onClick={() => navigate('/carrito')}
              className="relative p-2.5 text-ink hover:text-caramel rounded-full hover:bg-surface-2 transition-colors"
              aria-label="Ver carrito de compras"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-caramel text-white text-[11px] rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-bold shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botón Menú Móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-ink rounded-lg hover:bg-surface-2 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú Móvil */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-1 pb-4 pt-2 border-t border-border">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl font-medium text-sm text-ink hover:bg-surface-2 transition-colors"
            >
              Inicio
            </NavLink>

            {/* Acordeón de Categorías en Móvil */}
            <div>
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-ink hover:bg-surface-2 transition-colors"
              >
                <span>Categorías</span>
                <svg
                  className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileCategoriesOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-gold/30 ml-3 mt-1">
                  {Object.entries(categories).map(([key, cat]) => (
                    <NavLink
                      key={key}
                      to={`/categoria/${key}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-soft hover:text-ink hover:bg-surface-2"
                    >
                      <span className="text-caramel">
                        {getCategoryIconComponent(cat.icon || key, 'w-4 h-4')}
                      </span>
                      <span>{cat.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {seasonalCat && (
              <NavLink
                to="/categoria/temporada"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
              >
                <div className="flex items-center gap-2">
                  <TemporadaIcon className="w-4 h-4" />
                  <span>Menú de Temporada</span>
                </div>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                  Festivo
                </span>
              </NavLink>
            )}

            <div className="flex items-center justify-between px-3 pt-3 mt-2 border-t border-border">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                Tema
              </span>
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}