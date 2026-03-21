import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { Language } from '../types';

const images = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=90',
  'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=90',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=90',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=90',
];

const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  const panX = (mousePosition.x - 0.5) * -15;
  const panY = (mousePosition.y - 0.5) * -15;
  const isRtl = language === Language.AR;
  const sliderTranslateX = isRtl ? currentIndex * 100 : -currentIndex * 100;

  const heroWords = (t.heroTitle || '').split(' ');

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[900px] sm:min-h-screen lg:h-screen w-full overflow-hidden text-white flex items-center justify-center pt-40 pb-48 lg:pt-32 lg:pb-40"
    >
      {/* Background Slideshow */}
      <div
        className="absolute top-0 left-0 w-full h-full flex transition-transform duration-[1500ms] ease-in-out"
        style={{ transform: `translateX(${sliderTranslateX}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${src})`,
                transform: `scale(1.1) translate(${panX}px, ${panY}px)`,
                transition: 'transform 0.5s cubic-bezier(0.1, 0, 0, 1)'
              }}
            />
            {/* Darker/Lush Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-50 dark:to-slate-950 transition-colors duration-500"></div>
          </div>
        ))}
      </div>

      {/* Decorative Interactive Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-brand-500/20 rounded-full blur-2xl floating-bubble"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${10 + i * 2}s`,
              transform: `translate(${panX * (0.5 + i * 0.2)}px, ${panY * (0.5 + i * 0.2)}px)`
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 mt-16 lg:mt-24">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] sm:text-sm font-bold animate-fade-in shadow-xl">
             <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
             <span className="uppercase tracking-widest">{isRtl ? 'تنظيف متميز معتمد' : 'Licensed Premium Cleaning'}</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] sm:leading-[1] [text-wrap:balance]">
             {heroWords.map((word, i) => {
                const isHighlighted = word === 'Dubai’s' || word === 'Premium' || word === 'تميز' || word === 'دبي';
                return (
                  <span 
                    key={i} 
                    className="inline-block reveal-text" 
                    style={{ animationDelay: `${200 + i * 100}ms` }}
                  >
                    {isHighlighted ? <span className="text-brand-500">{word}</span> : word}&nbsp;
                  </span>
                );
             })}
          </h1>
          
          <p 
            className="text-base sm:text-xl md:text-2xl text-slate-100/90 max-w-2xl mx-auto leading-relaxed font-medium reveal-text [text-wrap:balance]" 
            style={{ animationDelay: '800ms' }}
          >
            {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-4 sm:pt-8 reveal-text" style={{ animationDelay: '1000ms' }}>
            <a href="#booking" className="w-full sm:w-auto animate-soap-bubble bg-brand-500 hover:bg-brand-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all shadow-2xl shadow-brand-500/40 text-center ring-4 ring-brand-500/20 active:scale-95">
              {t.heroCta}
            </a>
            <a href="#services" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all text-center group">
              {t.navServices}
              <span className="inline-block transition-transform group-hover:translate-x-1 ms-2">→</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Dynamic Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-60 hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 p-1 flex justify-center">
            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;