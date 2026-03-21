import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../App';

const AboutUs: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = sectionRef.current?.querySelectorAll('.scroll-reveal');
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <div className="lg:w-1/2 relative scroll-reveal">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=1200" 
                alt="Professional Cleaning Service" 
                className="w-full h-[300px] sm:h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 to-transparent"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-100 dark:bg-brand-900/30 rounded-full blur-3xl opacity-60 floating-bubble"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl opacity-40 floating-bubble" style={{ animationDelay: '2s' }}></div>
            
            {/* Experience Badge */}
            <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-700 animate-pulse-slow">
              <div className="text-brand-500 font-bold text-4xl mb-1">10+</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Years of Excellence</div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2">
            <div className="scroll-reveal">
              <h2 className="text-brand-500 font-bold tracking-widest uppercase text-sm mb-4">
                {t.footerAbout}
              </h2>
              <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                {t.aboutUsTitle}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                {t.aboutUsText}
              </p>
            </div>

            {/* Services List */}
            <div className="mb-12 scroll-reveal" style={{ transitionDelay: '0.1s' }}>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {t.aboutUsServicesTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.aboutUsServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
              {t.aboutUsStats.map((stat, index) => (
                <div key={index} className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-brand-500/30 transition-all duration-300">
                  <div className="text-3xl font-bold text-brand-500 mb-2 group-hover:scale-110 transition-transform origin-left">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 scroll-reveal" style={{ transitionDelay: '0.4s' }}>
              <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-brand-500 text-white font-bold rounded-full overflow-hidden shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t.heroCta}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-brand-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
