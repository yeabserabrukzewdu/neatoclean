import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, useBooking } from '../App';
import { SERVICE_TRANSLATIONS, WHATSAPP_NUMBER } from '../constants';
import { BookingDetails } from '../types';

const Counter: React.FC<{ label: string; value: number; onIncrease: () => void; onDecrease: () => void; }> = ({ label, value, onIncrease, onDecrease }) => (
  <div className="flex-1 group">
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{label}</label>
    <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-inner group-focus-within:border-brand-500 transition-all hover:border-slate-300 dark:hover:border-slate-600">
      <button 
        onClick={onDecrease} 
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-brand-500 transition-all font-bold active:scale-90"
      >
        &minus;
      </button>
      <span className="flex-1 text-center font-black text-lg text-slate-800 dark:text-slate-100">{value}</span>
      <button 
        onClick={onIncrease} 
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-brand-500 transition-all font-bold active:scale-90"
      >
        &#43;
      </button>
    </div>
  </div>
);


    const BookingSection: React.FC = () => {
    const { t, language } = useLanguage();
    const { startBooking } = useBooking();
    const [service, setService] = useState<string>('airbnb');
    const [bedrooms, setBedrooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const getTranslatedText = (key: string) => {
        return SERVICE_TRANSLATIONS[key]?.[language] || '';
    };

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });
      
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);
    
    const handleBookNow = () => {
        startBooking({ service, bedrooms, bathrooms, price: 0 });
    };

    return (
        <section id="booking" className="relative z-30 px-4 sm:px-6 -mt-16 md:-mt-24 pb-12">
            <div className="container mx-auto">
                <div 
                    ref={containerRef}
                    className="scroll-reveal max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-2xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 md:p-12 transition-all"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
                        {/* Service Selection */}
                        <div className="lg:col-span-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">{t.serviceType}</label>
                            <div className="relative group">
                                <select
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                    className="w-full py-4 px-5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[20px] text-sm font-black uppercase tracking-tight text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer transition-all"
                                >
                                    <option value="residential">{getTranslatedText('residential_name')}</option>
                                    <option value="airbnb">{getTranslatedText('airbnb_name')}</option>
                                    <option value="deep_clean">{getTranslatedText('deep_clean_name')}</option>
                                    <option value="move_in_out">{getTranslatedText('move_in_out_name')}</option>
                                    <option value="office">{getTranslatedText('office_name')}</option>
                                    <option value="same_day">{getTranslatedText('same_day_name')}</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Counters */}
                        <div className="lg:col-span-5 flex flex-col xs:flex-row gap-4 sm:gap-6">
                            <Counter label={t.bedrooms} value={bedrooms} onIncrease={() => setBedrooms(v => v + 1)} onDecrease={() => setBedrooms(v => Math.max(1, v - 1))} />
                            <Counter label={t.bathrooms} value={bathrooms} onIncrease={() => setBathrooms(v => v + 1)} onDecrease={() => setBathrooms(v => Math.max(1, v - 1))} />
                        </div>
                        
                        {/* Result & CTA */}
                        <div className="lg:col-span-4 flex flex-col xs:flex-row items-center justify-between lg:justify-end gap-6 xs:gap-8 lg:gap-10 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700 w-full">
                            <div className="text-center xs:text-left rtl:xs:text-right w-full xs:w-auto transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{t.estimatedPrice}</p>
                                <div className="flex items-baseline justify-center xs:justify-start gap-1">
                                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase">{getTranslatedText(`${service}_name`)}</span>
                                </div>
                            </div>
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Greetings. I would like to request a price for ${getTranslatedText(`${service}_name`)} with ${bedrooms} bedrooms and ${bathrooms} bathrooms.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-full xs:w-auto overflow-hidden bg-brand-500 hover:bg-brand-600 text-white font-black py-5 sm:py-6 px-8 sm:px-10 rounded-2xl sm:rounded-[2rem] shadow-xl sm:shadow-2xl shadow-brand-500/30 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap text-base sm:text-lg text-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                <span className="relative z-10">{t.bookNow}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;