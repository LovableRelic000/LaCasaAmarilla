// src/components/HeroBanner.jsx
import { useState, useEffect } from 'react';

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => setSlides(data))
      .catch((err) => console.error('Error al cargar el banner principal:', err));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return <section className="w-full h-[60vh] min-h-[380px] bg-caramel" />;
  }

  return (
    <section className="relative w-full h-[60vh] min-h-[380px] overflow-hidden bg-caramel">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent flex items-end sm:items-center justify-center pb-16 sm:pb-0">
            <div className="text-center px-4 max-w-2xl">
              <h1 className="font-display text-3xl sm:text-5xl font-semibold text-bg mb-2">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="font-hand text-xl sm:text-2xl text-bg/90">{slide.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(idx)}
              aria-label={`Ir a slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-7 bg-gold' : 'w-2 bg-bg/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}