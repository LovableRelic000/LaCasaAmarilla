// src/components/Footer.jsx
import { WHATSAPP_PHONE, INSTAGRAM_USER } from '../config/contact';

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="font-display font-semibold text-lg mb-1">La Casa Amarilla</p>
        <p className="text-sm opacity-70">Repostería y panadería artesanal</p>

        <div className="flex justify-center items-center gap-8 mt-6">
          {/* Enlace WhatsApp con logo oficial SVG */}
          <a
            href={"https://api.whatsapp.com/send?phone=" + WHATSAPP_PHONE}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 text-sm font-semibold hover:text-[#25D366] transition-colors duration-200"
            aria-label="Contactar por WhatsApp"
          >
            <span className="p-2 rounded-full bg-white/10 group-hover:bg-[#25D366]/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#25D366]"
                aria-hidden="true"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.01 4.54-3.69 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.87-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.16 1.73 2.64 4.19 3.71.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>

          {/* Enlace Instagram */}
          <a
            href={"https://instagram.com/" + INSTAGRAM_USER}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 text-sm font-semibold hover:text-[#E1306C] transition-colors duration-200"
            aria-label="Visitar perfil de Instagram"
          >
            <span className="p-2 rounded-full bg-white/10 group-hover:bg-[#E1306C]/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#E1306C]"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </span>
            <span>Instagram</span>
          </a>
        </div>

        <p className="text-xs opacity-50 mt-8">
          © {new Date().getFullYear()} La Casa Amarilla. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}