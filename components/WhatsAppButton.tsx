import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { WHATSAPP_NUMBER } from '../constants';
import { WhatsAppIcon } from './icons';

const WhatsAppButton: React.FC = () => {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.whatsappMessage)}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 end-6 z-[60] flex flex-col items-end group">
      {showTooltip && (
        <div className="mb-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 max-w-[220px] animate-fade-in relative">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-full p-1 hover:bg-slate-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <p className="text-sm font-medium text-slate-800 dark:text-white leading-snug">
            {t.whatsappTooltip}
          </p>
          <div className="absolute bottom-[-8px] end-6 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-slate-100 dark:border-slate-700"></div>
        </div>
      )}
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:bg-[#20ba5a] focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-9 w-9" />
      </a>
    </div>
  );
};

export default WhatsAppButton;