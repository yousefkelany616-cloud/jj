import type { Activity, ActivityDetail } from "@workspace/api-client-react";
import type { Lang } from "@/lib/i18n";

type ActivityTranslation = {
  name: string;
  shortDescription: string;
  description?: string;
  city: string;
  bestTimeToVisit?: string;
  requiredGear?: string[];
  highlights?: string[];
};

const ACTIVITY_AR: Record<string, ActivityTranslation> = {
  "Ras Mohammed Reef Dive": {
    name: "غوص شعاب رأس محمد",
    shortDescription:
      "انسب على أشهر جدار شعاب مرجانية في مصر بالبحر الأحمر.",
    description:
      "غطسة قاربية بأسطوانتين عند موقع شعاب القرش وحطام يولاندا داخل محمية رأس محمد. جدار مرجاني عمودي يصل إلى 80 متراً، وأسراب من الباراكودا، وأسماك القرش المقيمة. يشمل البرنامج المرشدين والغداء وغطسة شاطئية اختيارية ثالثة.",
    city: "شرم الشيخ",
    bestTimeToVisit: "مارس إلى نوفمبر",
    requiredGear: [
      "شهادة غطس مياه مفتوحة",
      "دفتر الغطس",
      "واقي شمس آمن للشعاب",
    ],
    highlights: [
      "جدار شعاب القرش",
      "حطام سفينة يولاندا",
      "أسراب أسماك الجاك",
    ],
  },
  "Dahab Blue Hole Free-Dive": {
    name: "غطس حر في الثقب الأزرق بدهب",
    shortDescription:
      "انزل إلى أعماق الحفرة الزرقاء العالمية الشهيرة على ساحل سيناء.",
    description:
      "جلسة غطس حر أو سكوبا مع مرشد عند ثقب دهب الأزرق العمودي بعمق 130 متراً. تشمل غطسة شاطئية في موقع البِلز، وعبور إلى السرج، وإفطار في كافيه بدوي يطل على خليج العقبة.",
    city: "دهب",
    bestTimeToVisit: "أبريل إلى نوفمبر",
    requiredGear: [
      "شهادة غطس",
      "بدلة غوص (3 ملم)",
      "كشاف تحت الماء",
    ],
    highlights: [
      "دخول شاطئي للثقب الأزرق",
      "موقع غطس البِلز",
      "إفطار بدوي على الشاطئ",
    ],
  },
  "Mount Sinai Sunrise Trek": {
    name: "رحلة شروق الشمس على جبل سيناء",
    shortDescription:
      "اصعد طريق الجمل ليلاً لاستقبال شروق الشمس من القمة.",
    description:
      "ابدأ الصعود بعد منتصف الليل بصحبة مرشد بدوي. 3,750 درجة حجرية، وكنيسة القمة، ومنظر بانورامي عبر جبال سيناء بينما تشعل الشمس الصحراء.",
    city: "سانت كاترين",
    bestTimeToVisit: "سبتمبر إلى مايو",
    requiredGear: [
      "مصباح رأس",
      "ملابس دافئة بطبقات",
      "حذاء مشي جبلي",
      "ماء (2 لتر)",
    ],
    highlights: [
      "الصعود قبل الفجر",
      "دير سانت كاترين",
      "كنيسة القمة عند الشروق",
    ],
  },
  "White Desert Overnight Camp": {
    name: "مخيم ليلي في الصحراء البيضاء",
    shortDescription:
      "نم تحت تشكيلات صخرية بيضاء كالطباشير نحتتها الرياح.",
    description:
      "اعبر عجائب الحجر الجيري في الصحراء البيضاء بسيارة دفع رباعي، وانصب المخيم تحت درب التبانة، واستيقظ محاطاً بصخور الفطر السريالية. يشمل البرنامج مرشدين بدو وجميع الوجبات وزيارة لجبل الكريستال.",
    city: "الفرافرة",
    bestTimeToVisit: "أكتوبر إلى مارس",
    requiredGear: [
      "جاكيت دافئ لليل",
      "حذاء مشي متين",
      "حماية من الشمس",
      "مصباح رأس",
    ],
    highlights: [
      "غروب الشمس فوق التشكيلات الطباشيرية",
      "حفل الشاي البدوي",
      "مراقبة النجوم في سماء صافية",
    ],
  },
  "Siwa Oasis 4x4 Safari": {
    name: "سفاري رباعي الدفع في واحة سيوة",
    shortDescription:
      "تسلق كثبان بحر الرمال الكبير وعُم في بحيرات الملح بسيوة.",
    description:
      "سفاري لمدة يومين من بلدة سيوة إلى بحر الرمال الكبير: التزلج على الكثبان العالية، والعوم في بحيرة بئر وحيد المالحة، وزيارة عند الغروب لعين كليوباترا قبل التخييم في مأوى بدوي.",
    city: "سيوة",
    bestTimeToVisit: "أكتوبر إلى أبريل",
    requiredGear: [
      "نظارات شمسية",
      "وشاح",
      "حذاء مغلق",
      "ملابس سباحة",
    ],
    highlights: [
      "كثبان بحر الرمال الكبير",
      "عوم في بحيرة بئر وحيد",
      "عين كليوباترا",
    ],
  },
  "Marsa Alam Reef Snorkel": {
    name: "غطس شعاب مرسى علم",
    shortDescription:
      "اغطس مع أبقار البحر والسلاحف في جنوب البحر الأحمر المحمي.",
    description:
      "رحلة قاربية ليوم كامل إلى شعاب سماداي (بيت الدلافين) وخليج أبو دباب. ثلاثة مواقع غطس مع مرشد، غداء على متن القارب، واحتمال كبير جداً للقاء الدلافين وأبقار البحر.",
    city: "مرسى علم",
    bestTimeToVisit: "مارس إلى نوفمبر",
    requiredGear: [
      "واقي شمس آمن للشعاب",
      "ملابس سباحة",
      "منشفة",
      "كاميرا تحت الماء",
    ],
    highlights: [
      "بحيرة بيت الدلافين",
      "لقاءات السلاحف البحرية",
      "احتمال رؤية أبقار البحر",
    ],
  },
  "Wadi El Gemal Desert Camp": {
    name: "مخيم وادي الجمال الصحراوي",
    shortDescription:
      "خيّم في محمية وطنية بين الصحراء والشعاب المرجانية.",
    description:
      "مخيم بيئي لمدة يومين في محمية وادي الجمال الوطنية. اقضِ النهار في استكشاف قنوات المانجروف بالكاياك، وزيارة قرى البدو العبابدة، ثم النوم في مخيم خفيف الأثر.",
    city: "مرسى علم",
    bestTimeToVisit: "أكتوبر إلى مايو",
    requiredGear: [
      "ملابس سريعة الجفاف",
      "حذاء مرجاني",
      "حقيبة نوم",
      "مصباح رأس",
    ],
    highlights: [
      "مخيم بدو العبابدة",
      "كاياك في المانجروف",
      "عشاء تحت النجوم",
    ],
  },
  "Saint Catherine Summit Trek": {
    name: "رحلة قمة جبل كاترين",
    shortDescription:
      "تسلّق أعلى قمة في مصر (2,629 متراً) مع مرشدي بدو الجبالية.",
    description:
      "رحلة استكشافية لمدة يومين إلى قمة جبل كاترين، أعلى نقطة في مصر. النوم عند بركة جلت الأزرق، الصعود إلى القمة عند الشروق، والنزول عبر بساتين وادي الطلعة.",
    city: "سانت كاترين",
    bestTimeToVisit: "مارس إلى مايو، سبتمبر إلى نوفمبر",
    requiredGear: [
      "حذاء جبلي",
      "جاكيت بطانة ريش",
      "حقيبة نوم",
      "عصي مشي",
    ],
    highlights: [
      "قمة 2,629 متراً",
      "بركة جلت الأزرق",
      "بساتين وادي الطلعة",
    ],
  },
};

const TYPE_AR: Record<string, string> = {
  Diving: "غوص",
  Hiking: "مشي جبلي",
  Camping: "تخييم",
  Safari: "سفاري",
  Snorkeling: "غطس بالأنبوب",
};

const DIFFICULTY_AR: Record<string, string> = {
  Easy: "سهل",
  Moderate: "متوسط",
  Intermediate: "متوسط",
  Advanced: "متقدم",
  Hard: "صعب",
  extreme: "شديد الصعوبة",
};

const WEATHER_AR: Record<string, string> = {
  Tropical: "استوائي",
  Cold: "بارد",
  Hot: "حار",
  Warm: "دافئ",
};

const COUNTRY_AR: Record<string, string> = {
  Egypt: "مصر",
};

export function localizeActivity<T extends Activity | ActivityDetail>(
  activity: T | undefined,
  lang: Lang,
): T | undefined {
  if (!activity) return activity;
  if (lang !== "ar") return activity;

  const tr = ACTIVITY_AR[activity.name];

  const base = {
    ...activity,
    name: tr?.name ?? activity.name,
    city: tr?.city ?? activity.city,
    countryName: COUNTRY_AR[activity.countryName] ?? activity.countryName,
    type: TYPE_AR[activity.type] ?? activity.type,
    difficulty: DIFFICULTY_AR[activity.difficulty] ?? activity.difficulty,
    weather: WEATHER_AR[activity.weather] ?? activity.weather,
  };

  if ("shortDescription" in activity) {
    (base as Activity).shortDescription =
      tr?.shortDescription ?? (activity as Activity).shortDescription;
  }

  if ("description" in activity) {
    const detail = base as ActivityDetail;
    const detailIn = activity as ActivityDetail;
    detail.description = tr?.description ?? detailIn.description;
    detail.bestTimeToVisit = tr?.bestTimeToVisit ?? detailIn.bestTimeToVisit;
    if (tr?.requiredGear) detail.requiredGear = tr.requiredGear;
    if (tr?.highlights) detail.highlights = tr.highlights;
  }

  return base as T;
}
