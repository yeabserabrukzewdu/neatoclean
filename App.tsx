import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { Language, TranslationContent, Theme, BookingDetails } from './types';
import { TRANSLATIONS } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingSection from './components/BookingSection';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoginModal from './components/LoginModal';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';

// --- Language Context ---
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationContent;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

// --- Theme Context ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

// --- Auth Context ---
interface AuthContextType {
  session: Session | null;
  openLoginModal: (action?: () => void) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

// --- Booking Context ---
interface BookingContextType {
    page: 'home' | 'booking' | 'admin';
    bookingDetails: BookingDetails | null;
    startBooking: (details: BookingDetails) => void;
    setPage: (page: 'home' | 'booking' | 'admin') => void;
}
const BookingContext = createContext<BookingContextType | undefined>(undefined);
export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
}

const App: React.FC = () => {
  // States
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || Theme.LIGHT;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [page, setPage] = useState<'home' | 'booking' | 'admin'>('home');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);

  // Effects
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.DARK);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        setLoginModalOpen(false);
        if (postLoginAction) {
          postLoginAction();
          setPostLoginAction(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [postLoginAction]);

  // Context Values
  const languageContextValue = { language, setLanguage, t: TRANSLATIONS[language] };
  const themeContextValue = { theme, toggleTheme: () => setTheme(prev => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)) };
  const authContextValue = { session, openLoginModal: (action?: () => void) => {
    if (action) setPostLoginAction(() => action);
    setLoginModalOpen(true);
  }};
  const bookingContextValue = {
    page,
    setPage,
    bookingDetails,
    startBooking: (details: BookingDetails) => {
      setBookingDetails(details);
      setPage('booking');
      window.scrollTo(0, 0);
    },
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <ThemeContext.Provider value={themeContextValue}>
        <AuthContext.Provider value={authContextValue}>
          <BookingContext.Provider value={bookingContextValue}>
            <div className="bg-slate-50 text-slate-800 min-h-screen dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300">
              <Header onLoginClick={() => setLoginModalOpen(true)} />
              
              {page === 'home' && (
                <>
                  <main>
                    <Hero />
                    <BookingSection />
                    <HowItWorks />
                    <WhyChooseUs />
                    <Services />
                    <Testimonials />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              )}

              {page === 'booking' && <BookingPage />}
              
              {page === 'admin' && <AdminPage />}

              <LoginModal isOpen={isLoginModalOpen} onClose={() => {
                  setLoginModalOpen(false)
                  setPostLoginAction(null)
              }} />
            </div>
          </BookingContext.Provider>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;