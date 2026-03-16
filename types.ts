export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface TranslationContent {
  navHome: string;
  navServices: string;
  navWhyUs: string;
  navLogin: string;
  navLogout: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  whyUsTitle: string;
  whyUsPoints: {
    title: string;
    description: string;
  }[];
  servicesTitle: string;
  servicesSubtitle: string;
  getQuote: string;
  footerText: string;
  whatsappMessage: string;
  whatsappTooltip: string;

  // Booking Section
  bookingTitle: string;
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  kitchens: string;
  otherRooms: string;
  propertyDetails: string;
  propertyRequirementsDesc: string;
  estimatedPrice: string;
  bookNow: string;

  // How It Works
  howItWorksTitle: string;
  howItWorksSteps: {
    title: string;
    description: string;
  }[];

  // Testimonials
  testimonialsTitle: string;
  testimonials: {
    quote: string;
    author: string;
    location: string;
  }[];

  // Footer
  footerServices: string;
  footerCompany: string;
  footerAbout: string;
  footerContact: string;
  footerFollow: string;

  // Login Modal
  loginTitle: string;
  loginSubtitle: string;
  loginPhoneLabel: string;
  loginPhonePlaceholder:string;
  loginSendOtp: string;
  loginSendingOtp: string;
  loginOtpTitle: string;
  loginOtpSubtitle: string;
  loginOtpLabel: string;
  loginOtpPlaceholder: string;
  loginVerifyOtp: string;
  loginVerifyingOtp: string;
  loginSuccess: string;
  loginError: string;

  // Booking Page
  bookingPageTitle: string;
  bookingSummary: string;
  detailsLabel: string;
  cleaningHours: string;
  howManyHours: string;
  numberOfProfessionals: string;
  haveCleaningMaterials: string;
  yes: string;
  no: string;
  specialInstructions: string;
  specialInstructionsPlaceholder: string;
  confirmBooking: string;
  backToHome: string;

  // Booking Page - Multi-step
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  customizeService: string;
  additionalServices: string;
  scheduleAndDetails: string;
  reviewAndConfirm: string;
  nextStep: string;
  previousStep: string;
  
  // Step 2
  add: string;
  added: string;
  
  // Step 3
  scheduleYourCleaning: string;
  selectDate: string;
  selectTime: string;
  address: string;
  addressPlaceholder: string;
  detectLocation: string;
  detectingLocation: string;
  detectLocationError: string;
  mapViewTitle: string;

  // Step 4 - Payment
  payment: string;
  paymentDetails: string;
  creditCard: string;
  cardName: string;
  cardNamePlaceholder: string;
  cardNumber: string;
  cardNumberPlaceholder: string;
  cardExpiry: string;
  cardExpiryPlaceholder: string;
  cardCVC: string;
  cardCVCPlaceholder: string;
  billingAddress: string;
  country: string;
  countryPlaceholder: string;
  streetAddress: string;
  streetAddressPlaceholder: string;
  city: string;
  cityPlaceholder: string;
  zipCode: string;
  zipCodePlaceholder: string;

  // Step 5
  reviewYourBooking: string;
  totalPrice: string;
  cleaningDate: string;
  cleaningTime: string;
  extras: string;
  noExtras: string;
  hourlyRate: string;
  additionalRoomsSurcharge: string;
}

export type Translations = {
  [key in Language]: TranslationContent;
};

export interface ServicePackage {
  id: 'turnover' | 'deep_clean' | 'essentials';
  nameKey: string;
  priceKey: string;
  pricePeriodKey: string;
  descriptionKey: string;
  featuresKey: string[];
  popular?: boolean;
}

export interface ServicePackageTranslations {
    [key: string]: {
        [lang in Language]: string;
    }
}

export interface BookingDetails {
  service: 'turnover' | 'deep_clean';
  bedrooms: number;
  bathrooms: number;
  price: number;
}

export interface AdditionalService {
    id: string;
    nameKey: string;
    descriptionKey: string;
    price: number;
    image: string;
}

// Admin Related Types
export interface ServiceRequest {
  id: string;
  clientName: string;
  serviceType: string;
  property: string; // e.g., "2BR / 2BA"
  date: string;
  time: string;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  activeBookings: number;
  avgOrderValue: number;
  cleanersOnline: number;
}