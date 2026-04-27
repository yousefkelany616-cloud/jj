import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  // Navbar
  "nav.discover": "Discover",
  "nav.destinations": "Destinations",
  "nav.trackTrip": "Track Trip",
  "nav.signIn": "Sign In",
  "nav.dashboard": "Dashboard",
  "nav.myTrips": "My Trips",
  "nav.favorites": "Favorites",
  "nav.profile": "Profile",
  "nav.emergency": "Emergency Contacts",
  "nav.logout": "Log out",
  "nav.toggleTheme": "Toggle theme",
  "nav.toggleMenu": "Toggle menu",
  "nav.toggleLanguage": "Toggle language",

  // Home
  "home.title": "The World is Yours to Explore",
  "home.subtitle":
    "Discover breathtaking trails, hidden oases, and epic adventures across Egypt.",
  "home.searchPlaceholder":
    "Where to next? (e.g., Dahab, White Desert, Diving...)",
  "home.search": "Search",
  "home.featured": "Featured Adventures",
  "home.trending": "Trending Destinations",
  "home.viewAll": "View all",

  // Discover
  "discover.title": "Discover Adventures",
  "discover.searchPlaceholder": "Search by name, country, city...",
  "discover.anyDifficulty": "Any Difficulty",
  "discover.anyType": "Any Type",
  "discover.noResults": "No adventures match your filters.",

  // Activity Detail
  "activity.bookNow": "Plan This Trip",
  "activity.addFavorite": "Add to favorites",
  "activity.removeFavorite": "Remove from favorites",
  "activity.duration": "Duration",
  "activity.cost": "Est. Cost",
  "activity.difficulty": "Difficulty",
  "activity.bestTime": "Best Season",
  "activity.weather": "Weather",
  "activity.gear": "Required Gear",
  "activity.highlights": "Highlights",
  "activity.location": "Location",
  "activity.reviews": "reviews",
  "activity.packing": "View full packing list →",
  "activity.about": "About this adventure",
  "activity.quickFacts": "Quick Facts",
  "activity.days": "Days",
  "activity.day": "Day",

  // Countries
  "countries.title": "Destinations",
  "country.activities": "Activities",
  "country.bestSeason": "Best Season",
  "country.currency": "Currency",
  "country.emergency": "Emergency Numbers",

  // Trips
  "trip.tracker": "Trip Tracker",
  "trip.start": "Start",
  "trip.pause": "Pause",
  "trip.stop": "Stop",
  "trip.resume": "Resume",
  "trip.distance": "Distance",
  "trip.duration": "Duration",
  "trip.avgSpeed": "Avg Speed",
  "trip.save": "Save Trip",
  "trip.title": "My Trips",
  "trip.empty": "No trips yet — start tracking your first adventure.",
  "trip.delete": "Delete",
  "trip.share": "Share",

  // Login
  "login.title": "Welcome to Wanderlust",
  "login.subtitle": "Sign in to track your adventures.",
  "login.name": "Your name",
  "login.email": "Email address",
  "login.submit": "Continue",

  // Packing
  "packing.title": "Packing List",
  "packing.essential": "Essential",
  "packing.optional": "Optional",
  "packing.progress": "Preparation Progress",

  // Favorites
  "favorites.title": "Your Favorites",
  "favorites.empty": "Heart adventures to save them here.",

  // Profile
  "profile.title": "Profile",
  "profile.achievements": "Achievements",
  "profile.totalAdventures": "Total Adventures",
  "profile.countriesVisited": "Countries Visited",
  "profile.totalDistance": "Total Distance",

  // Emergency
  "emergency.title": "Emergency Contacts",
  "emergency.police": "Police",
  "emergency.ambulance": "Ambulance",
  "emergency.fire": "Fire",
  "emergency.touristPolice": "Tourist Police",
  "emergency.embassy": "Embassy Hotline",

  // Dashboard
  "dashboard.welcome": "Welcome back",
  "dashboard.recommended": "Recommended for you",
  "dashboard.recentTrips": "Recent Trips",

  // Common
  "common.loading": "Loading...",
  "common.error": "Something went wrong.",
  "common.back": "Back",
  "common.viewDetails": "View Details",
  "common.km": "km",
};

const ar: Dict = {
  // Navbar
  "nav.discover": "اكتشف",
  "nav.destinations": "الوجهات",
  "nav.trackTrip": "تتبع رحلتك",
  "nav.signIn": "تسجيل الدخول",
  "nav.dashboard": "لوحة التحكم",
  "nav.myTrips": "رحلاتي",
  "nav.favorites": "المفضلة",
  "nav.profile": "الملف الشخصي",
  "nav.emergency": "أرقام الطوارئ",
  "nav.logout": "تسجيل الخروج",
  "nav.toggleTheme": "تبديل المظهر",
  "nav.toggleMenu": "تبديل القائمة",
  "nav.toggleLanguage": "تبديل اللغة",

  // Home
  "home.title": "العالم بين يديك لتكتشفه",
  "home.subtitle":
    "اكتشف أروع المسارات والواحات الخفية والمغامرات الملحمية في مصر.",
  "home.searchPlaceholder":
    "إلى أين تريد الذهاب؟ (مثل: دهب، الصحراء البيضاء، الغوص...)",
  "home.search": "بحث",
  "home.featured": "المغامرات المميزة",
  "home.trending": "الوجهات الرائجة",
  "home.viewAll": "عرض الكل",

  // Discover
  "discover.title": "اكتشف المغامرات",
  "discover.searchPlaceholder": "ابحث بالاسم أو المدينة...",
  "discover.anyDifficulty": "جميع المستويات",
  "discover.anyType": "جميع الأنواع",
  "discover.noResults": "لا توجد مغامرات تطابق الفلاتر.",

  // Activity Detail
  "activity.bookNow": "خطط لهذه الرحلة",
  "activity.addFavorite": "أضف إلى المفضلة",
  "activity.removeFavorite": "إزالة من المفضلة",
  "activity.duration": "المدة",
  "activity.cost": "التكلفة التقديرية",
  "activity.difficulty": "المستوى",
  "activity.bestTime": "أفضل موسم",
  "activity.weather": "الطقس",
  "activity.gear": "المعدات المطلوبة",
  "activity.highlights": "أبرز المعالم",
  "activity.location": "الموقع",
  "activity.reviews": "تقييم",
  "activity.packing": "عرض قائمة الأمتعة الكاملة ←",
  "activity.about": "عن هذه المغامرة",
  "activity.quickFacts": "معلومات سريعة",
  "activity.days": "أيام",
  "activity.day": "يوم",

  // Countries
  "countries.title": "الوجهات",
  "country.activities": "الأنشطة",
  "country.bestSeason": "أفضل موسم",
  "country.currency": "العملة",
  "country.emergency": "أرقام الطوارئ",

  // Trips
  "trip.tracker": "تتبع الرحلة",
  "trip.start": "ابدأ",
  "trip.pause": "إيقاف مؤقت",
  "trip.stop": "إيقاف",
  "trip.resume": "استئناف",
  "trip.distance": "المسافة",
  "trip.duration": "المدة",
  "trip.avgSpeed": "متوسط السرعة",
  "trip.save": "حفظ الرحلة",
  "trip.title": "رحلاتي",
  "trip.empty": "لا توجد رحلات بعد — ابدأ بتسجيل أول مغامرة.",
  "trip.delete": "حذف",
  "trip.share": "مشاركة",

  // Login
  "login.title": "مرحبا بك في Wanderlust",
  "login.subtitle": "سجل الدخول لتتبع مغامراتك.",
  "login.name": "اسمك",
  "login.email": "البريد الإلكتروني",
  "login.submit": "متابعة",

  // Packing
  "packing.title": "قائمة الأمتعة",
  "packing.essential": "أساسي",
  "packing.optional": "اختياري",
  "packing.progress": "تقدم التجهيز",

  // Favorites
  "favorites.title": "مفضلاتك",
  "favorites.empty": "اضغط على القلب لحفظ المغامرات هنا.",

  // Profile
  "profile.title": "الملف الشخصي",
  "profile.achievements": "الإنجازات",
  "profile.totalAdventures": "إجمالي المغامرات",
  "profile.countriesVisited": "الدول التي زرتها",
  "profile.totalDistance": "إجمالي المسافة",

  // Emergency
  "emergency.title": "أرقام الطوارئ",
  "emergency.police": "الشرطة",
  "emergency.ambulance": "الإسعاف",
  "emergency.fire": "الإطفاء",
  "emergency.touristPolice": "شرطة السياحة",
  "emergency.embassy": "الخط الساخن للسفارة",

  // Dashboard
  "dashboard.welcome": "مرحبا بعودتك",
  "dashboard.recommended": "موصى به لك",
  "dashboard.recentTrips": "أحدث الرحلات",

  // Common
  "common.loading": "جار التحميل...",
  "common.error": "حدث خطأ ما.",
  "common.back": "رجوع",
  "common.viewDetails": "عرض التفاصيل",
  "common.km": "كم",
};

const DICTS: Record<Lang, Dict> = { en, ar };

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "wl_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "ar" ? "ar" : "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      return DICTS[lang][key] ?? DICTS.en[key] ?? key;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, dir }),
    [lang, setLang, t, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function useT(): (key: string) => string {
  return useI18n().t;
}
