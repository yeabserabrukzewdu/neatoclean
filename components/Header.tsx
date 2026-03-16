import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, useTheme, useAuth, useBooking } from '../App';
import { Language, Theme } from '../types';
import { LANGUAGES } from '../constants';
import { BubblesIcon, ChevronDownIcon, SunIcon, MoonIcon, UserIcon, MenuIcon, XIcon } from './icons';
import { supabase } from '../supabaseClient';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { session } = useAuth();
  const { page, setPage } = useBooking();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  }

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setPage('home');
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isRtl = language === Language.AR;
  
  // High-contrast logic: if we are not on the home page, the header should always be solid or have dark text.
  const isTransparentState = page === 'home' && !isScrolled;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          !isTransparentState 
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl py-3 shadow-sm border-slate-200/60 dark:border-slate-800/60' 
            : 'bg-transparent py-5 border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button onClick={() => setPage('home')} className="flex items-center space-x-2 rtl:space-x-reverse group">
            <div className="bg-brand-500 p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-brand-500/30 shadow-lg logo-bubble">
              <BubblesIcon className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-black tracking-tighter transition-colors ${!isTransparentState ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
              NeatoCleaning<span className="text-brand-500">.</span>
            </span>
          </button>

          <div className="flex items-center space-x-2 md:space-x-6 rtl:space-x-reverse">
            <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              {[
                { label: t.navHome, id: 'home' },
                { label: t.navServices, id: 'services' },
                { label: t.navWhyUs, id: 'why-us' }
              ].map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`text-sm font-bold hover:text-brand-500 transition-colors ${!isTransparentState ? 'text-slate-600 dark:text-slate-300' : 'text-white/90'}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className={`hidden lg:block h-6 w-px ${!isTransparentState ? 'bg-slate-200 dark:bg-slate-800' : 'bg-white/20'}`}></div>

            <div className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-2.5 py-1.5 rounded-full border transition-all ${
                    !isTransparentState 
                      ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
                      : 'border-white/20 bg-white/10 backdrop-blur-sm text-white'
                  } hover:border-brand-500`}
                >
                  <span className="text-lg leading-none" aria-label={LANGUAGES[language].nativeName}>{LANGUAGES[language].flag}</span>
                  <ChevronDownIcon className={`h-3 w-3 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangOpen && (
                  <div className="absolute end-0 mt-3 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl py-2 z-[110] border border-slate-100 dark:border-slate-700 animate-fade-in">
                    {Object.entries(LANGUAGES).map(([langCode, { nativeName, flag }]) => (
                      <button
                        key={langCode}
                        onClick={() => handleLanguageChange(langCode as Language)}
                        className="w-full flex items-center space-x-3 rtl:space-x-reverse text-start px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-lg">{flag}</span>
                        <span>{nativeName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-all hover:bg-brand-500/10 hover:text-brand-500 ${!isTransparentState ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`}
                aria-label="Toggle theme"
              >
                {theme === Theme.LIGHT ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
              </button>
              
              <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
                {session ? (
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-200 hover:text-red-600 px-5 py-2.5 rounded-full text-sm font-black transition-all border border-transparent hover:border-red-200">
                      <UserIcon className="h-4 w-4" />
                      <span className="hidden md:inline">{t.navLogout}</span>
                  </button>
                ) : (
                  <button onClick={onLoginClick} className="bg-brand-500 text-white hover:bg-brand-600 px-7 py-2.5 rounded-full text-sm font-black transition-all shadow-lg shadow-brand-500/25 active:scale-95">
                    {t.navLogin}
                  </button>
                )}
              </div>

              <button 
                onClick={() => setIsMenuOpen(true)}
                className={`lg:hidden p-2.5 rounded-xl transition-all ${
                  !isTransparentState 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                  : 'bg-white/10 backdrop-blur-sm text-white'
                } hover:scale-110 active:scale-95`}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`absolute top-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl overflow-hidden ${
          isRtl 
            ? (isMenuOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0') 
            : (isMenuOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0')
        }`}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>

          <div className="relative p-8 flex flex-col h-full z-10">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                 <div className="bg-brand-500 p-2 rounded-xl shadow-lg shadow-brand-500/30 logo-bubble">
                    <BubblesIcon className="h-6 w-6 text-white" />
                 </div>
                 <span className="text-xl font-black tracking-tight dark:text-white">NeatoCleaning</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 ps-1">Menu Concierge</p>
              {[
                { label: t.navHome, id: 'home' },
                { label: t.navServices, id: 'services' },
                { label: t.navWhyUs, id: 'why-us' }
              ].map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300">
                      {theme === Theme.LIGHT ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                    </button>
                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                       {Object.entries(LANGUAGES).map(([code, data]) => (
                         <button 
                           key={code}
                           onClick={() => setLanguage(code as Language)}
                           className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${language === code ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-500' : 'text-slate-500'}`}
                         >
                           {data.flag}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {session ? (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] font-black text-red-500 transition-all">
                  <UserIcon className="h-5 w-5" />
                  {t.navLogout}
                </button>
              ) : (
                <button onClick={() => { setIsMenuOpen(false); onLoginClick(); }} className="w-full bg-brand-500 hover:bg-brand-600 text-white p-5 rounded-[2rem] font-black text-lg shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                  {t.navLogin}
                </button>
              )}
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest pt-4">NeatoCleaning Concierge UAE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;