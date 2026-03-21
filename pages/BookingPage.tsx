import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, useBooking, useAuth } from '../App';
import { SERVICE_TRANSLATIONS, WHATSAPP_NUMBER, ADDITIONAL_SERVICES, HOURLY_RATE_AED } from '../constants';
import { ArrowLeftIcon, CheckIcon, CreditCardIcon, VisaIcon, MastercardIcon, AmexIcon, UserIcon, CalendarIcon, LockClosedIcon, ChevronDownIcon, LocationMarkerIcon, OfficeBuildingIcon, HashtagIcon, CrosshairsIcon, XIcon } from '../components/icons';
import { AdditionalService, Language } from '../types';
import { supabase } from '../supabaseClient';

declare global {
    interface Window {
      google: any;
    }
}

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const { t } = useLanguage();
    const steps = [t.customizeService, t.additionalServices, t.scheduleAndDetails, t.step4, t.step5];
  
    return (
      <div className="flex items-center justify-between mb-10 px-2 overflow-x-auto pb-4 scrollbar-hide">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center min-w-[70px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  {currentStep > stepNumber ? <CheckIcon className="w-5 h-5"/> : <span className="text-sm font-bold">{stepNumber}</span>}
                </div>
                <p className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-tighter ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                  {(step || '').split(' ')[0]}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-[20px] transition-colors duration-300 ${stepNumber < currentStep ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
};

const Counter: React.FC<{ label: string; value: number; onIncrease: () => void; onDecrease: () => void; }> = ({ label, value, onIncrease, onDecrease }) => (
  <div className="flex flex-col items-center field-reveal active">
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{label}</label>
    <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-inner w-full max-w-[160px] hover:border-brand-500 transition-colors">
      <button onClick={onDecrease} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-brand-500 transition-all font-bold"> &minus; </button>
      <span className="flex-1 text-center font-black text-lg text-slate-800 dark:text-slate-100">{value}</span>
      <button onClick={onIncrease} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-brand-500 transition-all font-bold"> &#43; </button>
    </div>
  </div>
);

interface BookingSummaryProps {
    serviceName: string;
    bedrooms: number;
    bathrooms: number;
    kitchens: number;
    otherRooms: number;
    hours: number;
    professionals: number;
    selectedExtras: AdditionalService[];
    basePrice: number;
    extrasPrice: number;
    roomCharge: number;
    totalPrice: number;
    date: string;
    time: string;
    address: string;
    step: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = (props) => {
    const { t, language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const getTranslatedText = (key: string) => SERVICE_TRANSLATIONS[key]?.[language] || key;

    const summaryContent = (
      <div className="space-y-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">{t.serviceType}:</span><span className="font-bold">{props.serviceName}</span></div>
          <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800"><span className="text-slate-500">{t.bedrooms}:</span> <span className="font-bold">{props.bedrooms}</span></div>
              <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800"><span className="text-slate-500">{t.bathrooms}:</span> <span className="font-bold">{props.bathrooms}</span></div>
          </div>
          
          {(props.step >= 3 && props.date) && (
            <div className="border-t dark:border-slate-700 pt-3 space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">{t.cleaningDate}:</span><span className="font-bold">{props.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t.cleaningTime}:</span><span className="font-bold">{props.time}</span></div>
              <div className="text-xs text-slate-400 line-clamp-1"><LocationMarkerIcon className="inline h-3 w-3 me-1" />{props.address}</div>
            </div>
          )}

          <div className="border-t dark:border-slate-700 pt-3 flex justify-between items-center">
              <span className="text-lg font-black">{t.totalPrice}:</span>
              <span className="text-2xl font-black text-brand-500">{props.totalPrice} <span className="text-xs">AED</span></span>
          </div>
      </div>
    );

    return (
        <div className="relative">
          <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl p-8 sticky top-28 border border-slate-100 dark:border-slate-700 animate-fade-in">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase">{t.bookingSummary}</h3>
              {summaryContent}
          </div>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.totalPrice}</p>
                    <p className="text-2xl font-black text-brand-500">{props.totalPrice} <span className="text-sm">AED</span></p>
                  </div>
                  <button onClick={() => setIsExpanded(true)} className="text-brand-500 font-bold text-sm uppercase tracking-tighter flex items-center gap-1">
                    {t.detailsLabel} <ChevronDownIcon className="h-4 w-4" />
                  </button>
              </div>
          </div>

          {isExpanded && (
            <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm animate-fade-in flex items-end">
              <div className="bg-white dark:bg-slate-900 w-full rounded-t-[40px] p-8 pb-12 animate-slide-up">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black uppercase">{t.bookingSummary}</h3>
                   <button onClick={() => setIsExpanded(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><XIcon className="h-6 w-6" /></button>
                </div>
                {summaryContent}
              </div>
            </div>
          )}
        </div>
    );
};

const Calendar: React.FC<{ selectedDate: string; onDateSelect: (date: string) => void; }> = ({ selectedDate, onDateSelect }) => {
    const { language } = useLanguage();
    const [displayDate, setDisplayDate] = useState(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); 

    const weekdays = [...Array(7).keys()].map(i => new Date(2023, 0, i + 1).toLocaleDateString(language, { weekday: 'narrow' }));

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        date.setHours(0,0,0,0);
        const dateString = date.toISOString().split('T')[0];
        const isSelected = selectedDate === dateString;
        const isPast = date < today;
        days.push(
            <button
                key={i}
                disabled={isPast}
                onClick={() => onDateSelect(dateString)}
                className={`p-2 text-center rounded-xl transition-all w-10 h-10 flex items-center justify-center font-bold ${
                    isSelected ? 'bg-brand-500 text-white shadow-lg scale-110' : 
                    isPast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 
                    'text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800'
                }`}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 field-reveal active">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setDisplayDate(new Date(year, month - 1, 1))} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                  {language === Language.AR ? '→' : '←'}
                </button>
                <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{displayDate.toLocaleString(language, { month: 'long', year: 'numeric' })}</h4>
                <button onClick={() => setDisplayDate(new Date(year, month + 1, 1))} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                   {language === Language.AR ? '←' : '→'}
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                {weekdays.map((day, i) => <div key={i}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 place-items-center">
                {days}
            </div>
        </div>
    );
};

const TimeSelector: React.FC<{ selectedTime: string; onTimeSelect: (time: string) => void; }> = ({ selectedTime, onTimeSelect }) => {
    const timeSlots = [...Array(11)].map((_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 field-reveal active" style={{ transitionDelay: '100ms' }}>
            {timeSlots.map(time => (
                <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`py-4 text-sm font-bold rounded-2xl transition-all border ${
                        selectedTime === time 
                        ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20 scale-105' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500'
                    }`}
                >
                    {time}
                </button>
            ))}
        </div>
    );
};


const BookingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { bookingDetails, setPage } = useBooking();
  const { session, openLoginModal } = useAuth();

  const [step, setStep] = useState(1);
  const [bedrooms, setBedrooms] = useState(bookingDetails?.bedrooms ?? 1);
  const [bathrooms, setBathrooms] = useState(bookingDetails?.bathrooms ?? 1);
  const [kitchens, setKitchens] = useState(1);
  const [otherRooms, setOtherRooms] = useState(0);
  const [hours, setHours] = useState(3);
  const [professionals, setProfessionals] = useState(1);
  const [hasMaterials, setHasMaterials] = useState<boolean | null>(null);
  const [instructions, setInstructions] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<AdditionalService[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState(session?.user?.user_metadata?.full_name || '');
  const [whatsapp, setWhatsapp] = useState(session?.user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteInitialized = useRef(false);

    useEffect(() => {
        const initAutocomplete = () => {
            if (!addressInputRef.current || !window.google || !window.google.maps || !window.google.maps.places) return;
            if (autocompleteInitialized.current) return;

            const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
                componentRestrictions: { country: "ae" },
                fields: ["formatted_address", "geometry.location"],
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place?.geometry?.location && place.formatted_address) {
                    setAddress(place.formatted_address);
                }
            });
            autocompleteInitialized.current = true;
        };

        if (step === 3 && !autocompleteInitialized.current) {
            initAutocomplete();
        }
    }, [step]);

  if (!bookingDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-2xl font-black mb-8 uppercase">Session Interrupted</p>
        <button onClick={() => setPage('home')} className="bg-brand-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl active:scale-95 transition-all"> {t.backToHome} </button>
      </div>
    );
  }

  const getTranslatedText = (key: string) => SERVICE_TRANSLATIONS[key]?.[language] || '';
  const serviceName = getTranslatedText(`${bookingDetails.service}_name`);
  const roomCharge = (Math.max(0, bedrooms - 1) + Math.max(0, bathrooms - 1) + Math.max(0, kitchens - 1) + Math.max(0, otherRooms - 1)) * 10;
  const basePrice = hours * professionals * HOURLY_RATE_AED;
  const extrasPrice = selectedExtras.reduce((sum, service) => sum + service.price, 0);
  const totalPrice = basePrice + extrasPrice + roomCharge;

  const handleConfirmBooking = async () => {
    const action = async () => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('inquiries').insert({
                client_name: contactName || session?.user?.email || 'Guest',
                service_type: serviceName,
                property: `${bedrooms}BR / ${bathrooms}BA`,
                date: date,
                time: time,
                total: totalPrice,
                status: 'pending',
                address: address,
                notes: instructions,
                user_id: session?.user?.id
            });

            if (error) throw error;

            const message = `NeatoCleaning Inquiry Sent:\nService: ${serviceName}\nProperty: ${bedrooms}BR/${bathrooms}BA\nDate: ${date} @ ${time}\nAddress: ${address}\nTotal: ${totalPrice} AED`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
            
            setStep(5);
        } catch (err) {
            console.error('Submission failed:', err);
            alert('Failed to submit inquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (session) await action(); else openLoginModal(action);
  };

  const modernInputClasses = "block w-full rounded-2xl border-slate-200 bg-slate-50 py-4 px-5 text-base font-medium placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition-all";

  return (
    <main className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-32 pb-32">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl p-6 sm:p-10 md:p-12 animate-fade-in border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <ProgressBar currentStep={step} />

                    <div key={step} className="step-enter">
                        {step === 1 && (
                            <div className="space-y-10">
                                <div className="text-center md:text-left rtl:text-right field-reveal active">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{t.customizeService}</h2>
                                    <p className="text-slate-500 font-medium">{t.propertyRequirementsDesc}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <Counter label={t.cleaningHours} value={hours} onIncrease={() => setHours(h => h + 1)} onDecrease={() => setHours(h => Math.max(2, h - 1))}/>
                                    <Counter label={t.numberOfProfessionals} value={professionals} onIncrease={() => setProfessionals(p => p + 1)} onDecrease={() => setProfessionals(p => Math.max(1, p - 1))}/>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t dark:border-slate-700">
                                    <Counter label={t.bedrooms} value={bedrooms} onIncrease={() => setBedrooms(v => v + 1)} onDecrease={() => setBedrooms(v => Math.max(1, v - 1))}/>
                                    <Counter label={t.bathrooms} value={bathrooms} onIncrease={() => setBathrooms(v => v + 1)} onDecrease={() => setBathrooms(v => Math.max(1, v - 1))}/>
                                    <Counter label={t.kitchens} value={kitchens} onIncrease={() => setKitchens(v => v + 1)} onDecrease={() => setKitchens(v => Math.max(0, v - 1))}/>
                                    <Counter label={t.otherRooms} value={otherRooms} onIncrease={() => setOtherRooms(v => v + 1)} onDecrease={() => setOtherRooms(v => Math.max(0, v - 1))}/>
                                </div>

                                <div className="field-reveal active" style={{ transitionDelay: '200ms' }}>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{t.haveCleaningMaterials}</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setHasMaterials(true)} className={`py-4 rounded-2xl font-bold border transition-all active:scale-95 ${hasMaterials === true ? 'bg-brand-500 text-white border-brand-500 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}> {t.yes} </button>
                                        <button onClick={() => setHasMaterials(false)} className={`py-4 rounded-2xl font-bold border transition-all active:scale-95 ${hasMaterials === false ? 'bg-brand-500 text-white border-brand-500 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}> {t.no} </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black uppercase tracking-tight field-reveal active">{t.additionalServices}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {ADDITIONAL_SERVICES.map((service, i) => {
                                        const isSelected = selectedExtras.some(s => s.id === service.id);
                                        const name = SERVICE_TRANSLATIONS[service.nameKey]?.[language] || service.nameKey;
                                        return (
                                            <button key={service.id} onClick={() => setSelectedExtras(prev => isSelected ? prev.filter(s => s.id !== service.id) : [...prev, service])} className={`text-left rtl:text-right relative rounded-3xl overflow-hidden border-2 transition-all group active:scale-[0.98] field-reveal active ${isSelected ? 'border-brand-500 bg-brand-50/10' : 'border-transparent bg-slate-50 dark:bg-slate-900 hover:border-brand-500/30'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                                                <div className="h-32 w-full overflow-hidden">
                                                    <img src={service.image} alt="" className="h-full w-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"/>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-bold mb-1">{name}</h3>
                                                    <p className="text-xl font-black text-brand-500">{service.price} AED</p>
                                                </div>
                                                {isSelected && <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-brand-500 text-white p-1.5 rounded-full shadow-lg animate-bounce"><CheckIcon className="w-4 h-4" /></div>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-10">
                                <h2 className="text-3xl font-black uppercase tracking-tight field-reveal active">{t.scheduleYourCleaning}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                                    <Calendar selectedDate={date} onDateSelect={setDate} />
                                    <TimeSelector selectedTime={time} onTimeSelect={setTime} />
                                </div>
                                <div className="field-reveal active" style={{ transitionDelay: '200ms' }}>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t.address}</label>
                                    <div className="relative group">
                                      <input ref={addressInputRef} type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder={t.addressPlaceholder} className={modernInputClasses}/>
                                      <button className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-brand-500 hover:scale-125 transition-transform"> <CrosshairsIcon className="h-6 w-6" /> </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black uppercase tracking-tight field-reveal active">{t.paymentDetails}</h2>
                                <div className="p-8 border-2 border-brand-500 bg-brand-50/10 rounded-[32px] space-y-6 field-reveal active" style={{ transitionDelay: '100ms' }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">
                                                <UserIcon className="w-8 h-8 text-brand-500" />
                                            </div>
                                            <span className="font-black text-xl uppercase tracking-tight">{t.detailsLabel}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.cardName}</label>
                                            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder={t.cardNamePlaceholder} className={modernInputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.cardNumber}</label>
                                            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder={t.cardNumberPlaceholder} className={modernInputClasses} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.specialInstructions}</label>
                                        <textarea 
                                            value={instructions} 
                                            onChange={e => setInstructions(e.target.value)} 
                                            placeholder={t.specialInstructionsPlaceholder} 
                                            rows={3} 
                                            className={modernInputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                        By submitting this inquiry, you are requesting a professional quote. Our team will verify availability and confirm your booking via WhatsApp within 15 minutes.
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="animate-fade-in text-center py-12 space-y-8">
                                 <div className="inline-flex items-center justify-center w-28 h-28 bg-brand-500/10 text-brand-500 rounded-full mb-4 animate-soap-bubble"> <CheckIcon className="w-12 h-12" /> </div>
                                 <h2 className="text-4xl font-black uppercase tracking-tight">{t.reviewYourBooking}</h2>
                                 <div className="max-w-md mx-auto space-y-4">
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        Inquiry Reference: <span className="text-slate-900 dark:text-white font-black">#NC-{Math.floor(1000 + Math.random() * 9000)}</span>
                                    </p>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        Your request has been logged in our system. A concierge specialist is reviewing your property specs now.
                                    </p>
                                 </div>
                                 <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                    <button onClick={() => setPage('home')} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-4 px-10 rounded-2xl transition-all hover:bg-slate-200">
                                        {t.backToHome}
                                    </button>
                                    <a 
                                        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                                        target="_blank" 
                                        className="bg-[#25D366] text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-green-500/20 hover:scale-105 transition-transform"
                                    >
                                        Live Concierge Chat
                                    </a>
                                 </div>
                            </div>
                        )}
                    </div>

                    {step < 5 && (
                        <div className="mt-12 flex justify-between items-center pt-8 border-t dark:border-slate-700">
                            <button onClick={step === 1 ? () => setPage('home') : () => setStep(s => s - 1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase text-sm tracking-widest transition-all hover:-translate-x-1 rtl:hover:translate-x-1">
                                <ArrowLeftIcon className="w-5 h-5 rtl:rotate-180"/>
                                <span>{step === 1 ? t.backToHome : t.previousStep}</span>
                            </button>
                            <button 
                                disabled={isSubmitting}
                                onClick={step === 4 ? handleConfirmBooking : () => setStep(s => s + 1)} 
                                className="bg-brand-500 hover:bg-brand-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : (step === 4 ? t.confirmBooking : t.nextStep)}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
                 <BookingSummary 
                    {...{serviceName, bedrooms, bathrooms, kitchens, otherRooms, hours, professionals, selectedExtras, basePrice, extrasPrice, roomCharge, totalPrice, date, time, address, step}}
                />
            </div>
        </div>
      </div>
    </main>
  );
};

export default BookingPage;