import type { Lang } from "@/lib/i18n";

const CATEGORY_AR: Record<string, string> = {
  Documents: "المستندات",
  Clothing: "الملابس",
  Gear: "المعدات",
  "Safety & Health": "السلامة والصحة",
};

const ITEM_AR: Record<string, string> = {
  // Documents
  Passport: "جواز السفر",
  "Travel insurance": "تأمين السفر",
  "Visa or entry permit": "تأشيرة أو تصريح دخول",
  "Booking confirmations": "تأكيدات الحجز",
  "Local emergency contacts": "أرقام الطوارئ المحلية",
  "Cash in local currency": "نقود بالعملة المحلية",

  // Clothing — base
  "Quick-dry t-shirts (3)": "تيشيرتات سريعة الجفاف (3)",
  "Long-sleeve base layer": "طبقة داخلية بأكمام طويلة",
  "Wool socks (3 pairs)": "جوارب صوفية (3 أزواج)",
  "Underwear (5 pairs)": "ملابس داخلية (5 أزواج)",
  "Lightweight pants": "بنطلون خفيف",

  // Clothing — hot/warm
  "Wide-brim sun hat": "قبعة واسعة الحواف للشمس",
  "UV-protective shirt": "قميص واقٍ من الأشعة فوق البنفسجية",

  // Clothing — cold
  "Insulated jacket": "جاكيت معزول",
  "Thermal leggings": "لباس حراري",
  "Warm beanie": "قبعة دافئة",
  "Insulated gloves": "قفازات معزولة",

  // Clothing — rain/tropical
  "Rain shell": "معطف واقٍ من المطر",
  "Quick-dry shorts": "شورت سريع الجفاف",

  // Gear — hiking/trekking
  "Trekking boots": "حذاء مشي جبلي",
  "Trekking poles": "عصي مشي",
  "35L daypack": "حقيبة ظهر 35 لتراً",
  "Hydration bladder (2L)": "كيس مياه (2 لتر)",
  "Headlamp + spare batteries": "كشاف رأس + بطاريات احتياطية",
  "Topographic map": "خريطة طبوغرافية",

  // Gear — diving/snorkeling
  "Mask, snorkel, fins": "قناع وأنبوب تنفس وزعانف",
  "Wetsuit (3mm)": "بدلة غوص (3 ملم)",
  "Dive computer": "كمبيوتر الغوص",
  "Underwater camera": "كاميرا تحت الماء",
  "Reef-safe sunscreen": "واقي شمس آمن للشعاب",
  "Dry bag": "حقيبة مقاومة للماء",

  // Gear — safari
  "Binoculars (8x42)": "منظار (8x42)",
  "Telephoto camera lens": "عدسة كاميرا مقربة",
  "Neutral-color clothing": "ملابس بألوان محايدة",
  "Wide-brim hat": "قبعة واسعة الحواف",
  "Insect repellent": "طارد للحشرات",
  "Field notebook": "دفتر ملاحظات ميدانية",

  // Gear — climbing
  "Climbing harness": "حزام تسلق",
  Helmet: "خوذة",
  "Climbing shoes": "حذاء تسلق",
  "Belay device": "جهاز تأمين",
  "Chalk bag": "حقيبة طباشير",
  "Quickdraws set": "طقم كويك درو",

  // Gear — desert/dune
  "Shemagh / scarf": "شماغ / لفحة",
  "Polarized sunglasses": "نظارة شمسية مستقطبة",
  "Sand-proof gaiters": "واقيات مقاومة للرمل",
  "Insulated water bottles (3L)": "زجاجات مياه معزولة (3 لتر)",
  "Lip balm SPF": "مرطب شفاه بحماية شمسية",

  // Gear — kayak/raft/sail
  "PFD life vest": "سترة نجاة",
  "Quick-dry towel": "منشفة سريعة الجفاف",
  "Water shoes": "حذاء مائي",
  "Waterproof phone case": "جراب هاتف مقاوم للماء",

  // Gear — cycling
  "Padded cycling shorts": "شورت ركوب دراجة مبطن",
  "Repair kit + spare tube": "عدة إصلاح + إطار احتياطي",
  "Cycling gloves": "قفازات ركوب الدراجة",
  "Front + rear lights": "أضواء أمامية وخلفية",

  // Gear — default
  "Multi-tool": "أداة متعددة الاستخدامات",
  "Waterproof phone pouch": "حافظة هاتف مقاومة للماء",
  "Reusable water bottle": "زجاجة مياه قابلة لإعادة الاستخدام",

  // Safety & Health
  "First-aid kit": "حقيبة إسعافات أولية",
  "Personal medications": "الأدوية الشخصية",
  "Sunscreen SPF 50+": "واقي شمس SPF 50+",
  "Power bank": "شاحن متنقل",
  Whistle: "صفارة",
  "Emergency blanket": "بطانية طوارئ",
};

export function localizePackingCategory(category: string, lang: Lang): string {
  if (lang !== "ar") return category;
  return CATEGORY_AR[category] ?? category;
}

export function localizePackingItem(name: string, lang: Lang): string {
  if (lang !== "ar") return name;
  return ITEM_AR[name] ?? name;
}
