import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { SparkleIcon, ClockIcon, LeafIcon, BadgeCheckIcon } from './icons';

const iconMap: { [key: string]: React.ElementType } = {
  'Quality Assurance': BadgeCheckIcon,
  'Dynamic Scheduling': ClockIcon,
  'Premium Botanicals': LeafIcon,
  'Certified Experts': SparkleIcon,
};

const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.why-us-card').forEach((el, i) => {
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
    <section ref={sectionRef} id="why-us" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20 section-header scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase">{t.whyUsTitle}</h2>
          <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Setting the gold standard for property hospitality through rigorous systems and premium execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.whyUsPoints.map((point, index) => {
            const IconComponent = iconMap[point.title] || SparkleIcon;
            return (
              <div key={index} className="why-us-card scroll-reveal group p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-transparent hover:border-brand-500/30 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl transition-all duration-500">
                <div className="h-16 w-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-inner">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors uppercase tracking-tighter">{point.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;