// src/components/Footer.jsx
import { WHATSAPP_PHONE, INSTAGRAM_USER } from '../config/contact';

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="font-display font-semibold text-lg mb-1">La Casa Amarilla</p>
        <p className="text-sm opacity-70">Repostería y pastelería artesanal</p>

        <div className="flex justify-center gap-6 mt-6">
          
            <a href={"https://api.whatsapp.com/send?phone=" + WHATSAPP_PHONE}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold hover:text-[#E8A33D] dark:hover:text-[#96562A] transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.488 1.449 5.412 1.451 5.428 0 9.85-4.417 9.853-9.842.002-2.628-1.01-5.1-2.852-6.946C17.162 1.868 14.693.85 12.012.85c-5.432 0-9.854 4.416-9.857 9.843A9.782 9.782 0 003.62 15.6l-.37 1.354 1.435-.374 1.488.882zm11.421-7.143c-.307-.153-1.815-.896-2.096-.998-.281-.102-.485-.153-.689.153-.204.306-.791.998-.969 1.203-.178.204-.357.229-.664.077-1.125-.563-1.921-.98-2.686-2.296-.201-.344.201-.32.576-1.071.077-.153.038-.286-.019-.393-.057-.107-.485-1.173-.664-1.606-.174-.419-.365-.362-.501-.369l-.428-.008c-.148 0-.388.056-.592.28-.204.224-.778.76-.778 1.852 0 1.091.797 2.145.908 2.296.112.152 1.569 2.395 3.8 3.359.531.23 1.002.38 1.346.488.533.169 1.019.145 1.402.089.428-.063 1.815-.742 2.071-1.458.255-.715.255-1.327.179-1.453-.077-.127-.282-.204-.589-.357z"/>
            </svg>
            WhatsApp
          </a>

          
            <a href={"https://instagram.com/" + INSTAGRAM_USER}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold hover:text-[#F2A88C] dark:hover:text-[#A34E3C] transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            Instagram
          </a>
        </div>

        <p className="text-xs opacity-50 mt-8">
          © {new Date().getFullYear()} La Casa Amarilla. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}