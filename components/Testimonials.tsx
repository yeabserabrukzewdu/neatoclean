import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { StarIcon } from './icons';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.testimonial-card').forEach((el, i) => {
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
    <section ref={sectionRef} id="testimonials" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 section-header scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase">{t.testimonialsTitle}</h2>
          <div className="h-1.5 w-24 bg-brand-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card scroll-reveal bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed font-medium">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center font-black text-brand-500 text-xl">
                  {testimonial.author[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-lg">{testimonial.author}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;