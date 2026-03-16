import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { CalculatorIcon, CalendarIcon, BadgeCheckIcon } from './icons';

const iconMap: { [key: number]: React.ElementType } = {
  0: CalculatorIcon,
  1: CalendarIcon,
  2: BadgeCheckIcon,
};

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.step-card').forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 200);
          });
          entry.target.querySelector('.section-header')?.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 section-header scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t.howItWorksTitle}</h2>
          <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {t.howItWorksSteps.map((step, index) => {
            const IconComponent = iconMap[index] || CalculatorIcon;
            return (
              <div key={index} className="text-center group step-card scroll-reveal">
                <div className="flex items-center justify-center h-24 w-24 rounded-[32px] bg-brand-50 dark:bg-brand-900/20 text-brand-500 dark:text-brand-400 mx-auto mb-8 relative group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-brand-500/10 border-2 border-transparent group-hover:border-white dark:group-hover:border-slate-800">
                  <div className="flex items-center justify-center w-full h-full">
                    <IconComponent className="h-10 w-10 flex-shrink-0" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-9 w-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center text-sm font-black border-4 border-white dark:border-slate-950 shadow-lg z-10 transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-brand-500 transition-colors">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;