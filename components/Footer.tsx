import React from 'react';
import { useLanguage, useBooking } from '../App';
import { BubblesIcon, FacebookIcon, InstagramIcon, TwitterIcon, DtcmIcon } from './icons';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { setPage } = useBooking();

  const isRtl = language === 'ar';

  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <button 
              onClick={() => { setPage('home'); window.scrollTo(0, 0); }} 
              className="flex items-center space-x-3 rtl:space-x-reverse group"
            >
              <div className="bg-brand-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-brand-500/30">
                <BubblesIcon className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                NeatoCleaning<span className="text-brand-500">.</span>
              </span>
            </button>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              The United Arab Emirates' leading tech-enabled turnover solution. We bridge the gap between hospitality and professional property management.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <p className="font-black text-white">450+ Licensed Experts</p>
                <p className="text-slate-500">Ready across Dubai & Abu Dhabi</p>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-500 mb-8">{t.footerServices}</h3>
              <ul className="space-y-4">
                {['Executive Turnover', 'Elite Deep Clean', 'Essentials Restock', 'Ironing Service'].map(link => (
                  <li key={link}>
                    <a href="#services" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-500 mb-8">{t.footerCompany}</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{t.footerAbout}</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Partner Program</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li>
                  <button onClick={() => setPage('admin')} className="text-xs font-black text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    Admin Portal 
                    <span className="bg-slate-800 group-hover:bg-indigo-500/20 px-1.5 py-0.5 rounded text-[8px]">SECURE</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-500 mb-8">Operational Hubs</h3>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li>Dubai Marina</li>
                <li>Palm Jumeirah</li>
                <li>Downtown / DIFC</li>
                <li>Business Bay</li>
              </ul>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-500 mb-8">Concierge Access</h3>
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
              <p className="text-xs text-slate-500 font-bold mb-4 uppercase tracking-widest">Newsletter Subscription</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="manager@property.com" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-500 p-1.5 rounded-lg text-white hover:bg-brand-600 transition-colors">
                  <span className="text-xs font-black">JOIN</span>
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-500 hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 rounded-full border border-brand-500/20">
              <DtcmIcon className="w-4 h-4 text-brand-500" />
              <span className="text-brand-500">DTCM LICENSED OPERATOR</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-slate-700 rounded-full"></div>
            <span>VAT REGISTERED (TRN: 1004...)</span>
          </div>

          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {t.footerText}
          </p>

          <div className="flex gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
