import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { supabase } from '../supabaseClient';
import { XIcon, ChevronDownIcon } from './icons';
import { COUNTRY_CODES } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [countryCode, setCountryCode] = useState('+971');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
  const filteredCountries = COUNTRY_CODES.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: {
          channel: 'whatsapp',
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loginError);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otp,
        type: 'sms', // 'sms' type is used for phone-based OTP verification
      });

      if (error) {
        setError(error.message);
      } else {
        handleClose(); // Close modal and reset state on success
      }
    } catch (err) {
        setError(err instanceof Error ? err.message : t.loginError);
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
      setOtpSent(false);
      setPhone('');
      setOtp('');
      setError('');
      setLoading(false);
      setCountryCode('+971');
      setDropdownOpen(false);
      setSearchTerm('');
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 md:p-8 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>

        {!otpSent ? (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t.loginTitle}</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">{t.loginSubtitle}</p>
            <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.loginPhoneLabel}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                   <div ref={dropdownRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="relative z-0 inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 rounded-l-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 w-full"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                      >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="hidden sm:inline">{selectedCountry.code}</span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      </button>
                      {isDropdownOpen && (
                        <div className="origin-top-left absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <ul className="max-h-60 overflow-y-auto" tabIndex={-1} role="listbox">
                            {filteredCountries.map(country => (
                              <li
                                key={country.name}
                                onClick={() => {
                                  setCountryCode(country.code);
                                  setDropdownOpen(false);
                                  setSearchTerm('');
                                }}
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 cursor-pointer"
                                role="option"
                                aria-selected={country.code === countryCode}
                              >
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <span className="text-lg">{country.flag}</span>
                                  <span>{country.name}</span>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400">{country.code}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                   </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t.loginPhonePlaceholder}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                >
                  {loading ? t.loginSendingOtp : t.loginSendOtp}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t.loginOtpTitle}</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">{t.loginOtpSubtitle}</p>
            <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.loginOtpLabel}
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={t.loginOtpPlaceholder}
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                >
                  {loading ? t.loginVerifyingOtp : t.loginVerifyOtp}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;