import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { SERVICE_PACKAGES, SERVICE_TRANSLATIONS, WHATSAPP_NUMBER } from '../constants';
import { CheckIcon, BubblesIcon } from './icons';

const ServiceCard: React.FC<{ pkg: any; t: any; language: any }> = ({ pkg, t, language }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  const getTranslatedText = (key: string) => {
    return SERVICE_TRANSLATIONS[key]?.[language] || key;
  };
  
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.whatsappMessage)}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group flex flex-col rounded-[40px] shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border card-glow scroll-reveal service-card ${
        pkg.popular 
          ? 'border-brand-500 ring-4 ring-brand-500/10' 
          : 'border-slate-100 dark:border-slate-800'
      } bg-white dark:bg-slate-900`}
    >
      {pkg.popular && (
        <div className="bg-brand-500 text-white text-center py-2 text-[10px] font-black uppercase tracking-[0.2em]">
          Most Requested Tier
        </div>
      )}
      
      <div className="p-10 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{getTranslatedText(pkg.nameKey)}</h3>
          {pkg.popular && <BubblesIcon className="h-6 w-6 text-brand-500 animate-pulse" />}
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
          {getTranslatedText(pkg.descriptionKey)}
        </p>

        <div className="mb-10">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-transform group-hover:scale-110 origin-left duration-300">
              {getTranslatedText(pkg.priceKey).replace(/[^\d]/g, '')}
            </span>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
              AED {getTranslatedText(pkg.pricePeriodKey)}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-10 flex-grow">
          {pkg.featuresKey.map((featureKey: string) => (
            <div key={featureKey} className="flex items-start gap-3 group/feat">
              <div className="flex-shrink-0 mt-0.5 transition-transform group-hover/feat:scale-125">
                <CheckIcon className="h-5 w-5 text-brand-500" />
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors group-hover/feat:text-brand-600">
                {getTranslatedText(featureKey)}
              </p>
            </div>
          ))}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
            pkg.popular
              ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          {t.getQuote}
        </a>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.service-card').forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 150);
          });
          entry.target.querySelector('.section-header')?.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20 section-header scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t.servicesTitle}</h2>
          <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t.servicesSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
          {SERVICE_PACKAGES.map((pkg) => (
            <ServiceCard key={pkg.id} pkg={pkg} t={t} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;