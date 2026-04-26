import {
  db,
  pool,
  countriesTable,
  activitiesTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COUNTRY_IMAGES = JSON.parse(
  readFileSync(join(__dirname, "country_images.json"), "utf8"),
) as Record<string, string[]>;

function pickImage(code: string, idx: number): string {
  const pool = COUNTRY_IMAGES[code] ?? [];
  if (pool.length === 0) {
    return "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80";
  }
  return pool[idx % pool.length];
}

function pickGallery(code: string, start: number, count: number): string[] {
  const pool = COUNTRY_IMAGES[code] ?? [];
  if (pool.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(start + i) % pool.length]);
  }
  return out;
}

type ActivitySeed = {
  name: string;
  type: string;
  city: string;
  difficulty: string;
  durationDays: number;
  estimatedCost: number;
  rating: number;
  reviewCount: number;
  heroImage: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  bestTimeToVisit: string;
  weather: string;
  latitude: number;
  longitude: number;
  requiredGear: string[];
  highlights: string[];
};

type CountrySeed = {
  code: string;
  name: string;
  flag: string;
  region: string;
  description: string;
  heroImage: string;
  currency: string;
  bestSeason: string;
  emergency: {
    police: string;
    ambulance: string;
    fire: string;
    touristPolice?: string | null;
    embassyHotline?: string | null;
  };
  sortOrder: number;
  activities: ActivitySeed[];
};

const img = (q: string, sig: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1600&q=80&sig=${sig}`;

const COUNTRIES: CountrySeed[] = [
  {
    code: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    region: "Arab World",
    description:
      "From the Saharan dunes to the Red Sea reefs, Egypt offers some of the world's most storied adventure terrain — pharaonic deserts above water, kaleidoscopic coral below.",
    heroImage: img("photo-1539650116574-75c0c6d73f6e", 1),
    currency: "EGP",
    bestSeason: "October to April",
    emergency: {
      police: "122",
      ambulance: "123",
      fire: "180",
      touristPolice: "126",
      embassyHotline: "+20 2 2797 3300",
    },
    sortOrder: 1,
    activities: [
      {
        name: "White Desert Overnight Expedition",
        type: "Desert Safari",
        city: "Farafra",
        difficulty: "Moderate",
        durationDays: 3,
        estimatedCost: 480,
        rating: 4.8,
        reviewCount: 214,
        heroImage: img("photo-1568322445389-f64ac2515099", 2),
        gallery: [
          img("photo-1568322445389-f64ac2515099", 21),
          img("photo-1517394834181-95ed159986c7", 22),
          img("photo-1473625247510-8ceb1760943f", 23),
        ],
        shortDescription:
          "Sleep beneath chalk-white rock formations sculpted by the wind.",
        description:
          "Cross the limestone wonderland of the White Desert by 4x4, set up camp under the Milky Way, and wake up surrounded by surreal mushroom rocks. Includes Bedouin guides, all meals, and a stop at Crystal Mountain.",
        bestTimeToVisit: "October to March",
        weather: "Hot",
        latitude: 27.05,
        longitude: 27.96,
        requiredGear: [
          "Warm jacket for night",
          "Sturdy walking shoes",
          "Sun protection",
          "Headlamp",
        ],
        highlights: [
          "Sunset over chalk formations",
          "Bedouin tea ceremony",
          "Stargazing in Bortle 1 sky",
        ],
      },
      {
        name: "Ras Mohammed Reef Dive",
        type: "Diving",
        city: "Sharm El Sheikh",
        difficulty: "Intermediate",
        durationDays: 1,
        estimatedCost: 130,
        rating: 4.9,
        reviewCount: 612,
        heroImage: img("photo-1518837695005-2083093ee35b", 3),
        gallery: [
          img("photo-1518837695005-2083093ee35b", 31),
          img("photo-1582967788606-a171c1080cb0", 32),
          img("photo-1505144808419-1957a94ca61e", 33),
        ],
        shortDescription:
          "Drift along Egypt's most legendary coral wall in the Red Sea.",
        description:
          "A two-tank boat dive on the iconic Shark Reef and Yolanda wreck site. Vertical coral wall to 80m, schools of barracuda, and resident reef sharks. Operator includes guides, lunch and a third optional shore dive.",
        bestTimeToVisit: "March to November",
        weather: "Tropical",
        latitude: 27.7333,
        longitude: 34.25,
        requiredGear: [
          "Open Water certification",
          "Logbook",
          "Reef-safe sunscreen",
        ],
        highlights: [
          "Shark Reef wall dive",
          "Yolanda wreck cargo",
          "Schooling jackfish",
        ],
      },
      {
        name: "Mt Sinai Sunrise Trek",
        type: "Hiking",
        city: "Saint Catherine",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 75,
        rating: 4.7,
        reviewCount: 388,
        heroImage: img("photo-1539650116574-75c0c6d73f6e", 4),
        gallery: [
          img("photo-1539650116574-75c0c6d73f6e", 41),
          img("photo-1505765050516-f72dcac9c60a", 42),
        ],
        shortDescription:
          "Climb the Camel Path through the night to greet sunrise from the summit.",
        description:
          "Begin the climb just after midnight with a Bedouin guide. 3,750 stone steps, summit chapel, and a panorama across the Sinai range as the sun ignites the desert.",
        bestTimeToVisit: "September to May",
        weather: "Cold",
        latitude: 28.5392,
        longitude: 33.9753,
        requiredGear: [
          "Headlamp",
          "Warm layers",
          "Hiking boots",
          "Water (2L)",
        ],
        highlights: [
          "Pre-dawn ascent",
          "Saint Catherine's Monastery",
          "Sunrise summit chapel",
        ],
      },
      {
        name: "Wadi El Gemal Kayak Safari",
        type: "Kayaking",
        city: "Marsa Alam",
        difficulty: "Easy",
        durationDays: 2,
        estimatedCost: 220,
        rating: 4.6,
        reviewCount: 96,
        heroImage: img("photo-1502920917128-1aa500764cbd", 5),
        gallery: [
          img("photo-1502920917128-1aa500764cbd", 51),
          img("photo-1551024709-8f23befc6f87", 52),
        ],
        shortDescription:
          "Paddle through mangrove channels in a protected marine park.",
        description:
          "Two-day expedition through the Wadi El Gemal lagoons. Spot dugongs, sea turtles, and flamingos while sleeping in a desert eco-camp.",
        bestTimeToVisit: "October to May",
        weather: "Warm",
        latitude: 24.6883,
        longitude: 35.0833,
        requiredGear: ["Quick-dry clothing", "Reef shoes", "Dry bag"],
        highlights: ["Mangrove channels", "Turtle sightings", "Eco-camp stay"],
      },
    ],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    region: "Arab World",
    description:
      "A frontier of red sand seas, basalt volcanoes, and Nabatean ruins, Saudi Arabia is one of the most exciting new adventure destinations on Earth.",
    heroImage: img("photo-1586724237569-f3d0c1dee8c6", 6),
    currency: "SAR",
    bestSeason: "November to March",
    emergency: {
      police: "999",
      ambulance: "997",
      fire: "998",
      touristPolice: "911",
      embassyHotline: "+966 11 488 3800",
    },
    sortOrder: 2,
    activities: [
      {
        name: "AlUla Canyon Hike",
        type: "Hiking",
        city: "AlUla",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 95,
        rating: 4.8,
        reviewCount: 173,
        heroImage: img("photo-1586724237569-f3d0c1dee8c6", 7),
        gallery: [
          img("photo-1586724237569-f3d0c1dee8c6", 71),
          img("photo-1604537466573-5e94508fd180", 72),
        ],
        shortDescription:
          "Trek between sandstone cliffs surrounding the Hegra tombs.",
        description:
          "A guided trail through the Sharaan canyons skirting Nabatean rock-cut tombs. Sunset return through the date palm oasis.",
        bestTimeToVisit: "October to April",
        weather: "Hot",
        latitude: 26.6086,
        longitude: 37.9215,
        requiredGear: ["Hiking boots", "2L water", "Hat", "Sunscreen"],
        highlights: ["Hegra tombs", "Elephant Rock", "Oasis viewpoint"],
      },
      {
        name: "Edge of the World Cliff Walk",
        type: "Hiking",
        city: "Riyadh",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 60,
        rating: 4.6,
        reviewCount: 245,
        heroImage: img("photo-1543158266-0066955047b1", 8),
        gallery: [img("photo-1543158266-0066955047b1", 81)],
        shortDescription:
          "Stand on a 300m vertical drop overlooking the ancient seabed.",
        description:
          "A short scramble out to the dramatic Tuwaiq escarpment edge. Best enjoyed at sunset.",
        bestTimeToVisit: "October to March",
        weather: "Hot",
        latitude: 24.95,
        longitude: 46.13,
        requiredGear: ["Closed shoes", "1.5L water", "Wind layer"],
        highlights: ["Vertical cliff edge", "Sunset over plateau"],
      },
      {
        name: "Empty Quarter Camel Expedition",
        type: "Desert Safari",
        city: "Najran",
        difficulty: "Hard",
        durationDays: 5,
        estimatedCost: 1450,
        rating: 4.9,
        reviewCount: 41,
        heroImage: img("photo-1547235001-d703406d3a37", 9),
        gallery: [img("photo-1547235001-d703406d3a37", 91)],
        shortDescription:
          "Five-day camel crossing of the Rub al-Khali sand sea.",
        description:
          "Travel as the Bedu have for millennia. Daily 25km stages between dunes, traditional cooking on the fire, and astonishing silence.",
        bestTimeToVisit: "November to February",
        weather: "Hot",
        latitude: 17.5,
        longitude: 44.13,
        requiredGear: [
          "Long-sleeve shirts",
          "Shemagh",
          "Sleeping bag",
          "Sturdy boots",
        ],
        highlights: [
          "Cross 100m dunes",
          "Bedouin coffee ritual",
          "Total dark-sky stargazing",
        ],
      },
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Arab World",
    description:
      "Sand and steel: dune-bashing in the morning, free-diving the Musandam fjords by afternoon, and rooftop traverses of Dubai by night.",
    heroImage: img("photo-1518684079-3c830dcef090", 10),
    currency: "AED",
    bestSeason: "October to April",
    emergency: {
      police: "999",
      ambulance: "998",
      fire: "997",
      touristPolice: "901",
      embassyHotline: "+971 4 309 4444",
    },
    sortOrder: 3,
    activities: [
      {
        name: "Hajar Mountains Via Ferrata",
        type: "Climbing",
        city: "Ras Al Khaimah",
        difficulty: "Hard",
        durationDays: 1,
        estimatedCost: 195,
        rating: 4.7,
        reviewCount: 132,
        heroImage: img("photo-1551632811-561732d1e306", 11),
        gallery: [img("photo-1551632811-561732d1e306", 111)],
        shortDescription:
          "World's longest zipline + cable-protected climbing route on Jebel Jais.",
        description:
          "Iron-rung climb up the highest peak in the UAE, finishing with a 2.83km zipline back down. Half-day with full safety gear and guides.",
        bestTimeToVisit: "November to March",
        weather: "Warm",
        latitude: 25.9667,
        longitude: 56.1667,
        requiredGear: [
          "Closed climbing shoes",
          "Light gloves",
          "Long pants",
        ],
        highlights: ["1,934m summit", "World-record zipline", "Wadi panorama"],
      },
      {
        name: "Liwa Dune Trek",
        type: "Desert Safari",
        city: "Liwa",
        difficulty: "Moderate",
        durationDays: 2,
        estimatedCost: 380,
        rating: 4.5,
        reviewCount: 87,
        heroImage: img("photo-1518684079-3c830dcef090", 12),
        gallery: [img("photo-1518684079-3c830dcef090", 121)],
        shortDescription:
          "Two-day on-foot crossing of the Liwa Crescent dunes.",
        description:
          "Fully supported overnight trek between the world's largest sand sea formations. Camp under the stars at the foot of Tel Moreeb.",
        bestTimeToVisit: "November to March",
        weather: "Hot",
        latitude: 23.1333,
        longitude: 53.7833,
        requiredGear: ["Gaiters", "Sun hoodie", "3L hydration"],
        highlights: [
          "Tel Moreeb sunset",
          "Bedouin camp dinner",
          "Sand surfing",
        ],
      },
      {
        name: "Musandam Fjord Dhow Snorkel",
        type: "Snorkeling",
        city: "Dibba",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 110,
        rating: 4.6,
        reviewCount: 230,
        heroImage: img("photo-1582211232618-58af5c54a0ef", 13),
        gallery: [img("photo-1582211232618-58af5c54a0ef", 131)],
        shortDescription:
          "Sail the 'Norway of Arabia' on a wooden dhow with snorkel stops.",
        description:
          "All-day cruise into the Strait of Hormuz fjords. Three snorkel stops, lunch on the boat, and frequent dolphin sightings.",
        bestTimeToVisit: "October to May",
        weather: "Tropical",
        latitude: 25.6,
        longitude: 56.275,
        requiredGear: ["Swimwear", "Reef-safe sunscreen", "Towel"],
        highlights: [
          "Telegraph Island swim",
          "Dolphin escort",
          "Cliff-walled fjords",
        ],
      },
    ],
  },
  {
    code: "JO",
    name: "Jordan",
    flag: "🇯🇴",
    region: "Arab World",
    description:
      "Hike the Jordan Trail from the Roman ruins of Umm Qais down to the rose-red city of Petra and the Martian sands of Wadi Rum.",
    heroImage: img("photo-1466442929976-97f336a657be", 14),
    currency: "JOD",
    bestSeason: "March to May, September to November",
    emergency: {
      police: "911",
      ambulance: "911",
      fire: "911",
      touristPolice: "+962 6 5603750",
      embassyHotline: "+962 6 5901500",
    },
    sortOrder: 4,
    activities: [
      {
        name: "Wadi Rum Overnight Trek",
        type: "Hiking",
        city: "Wadi Rum",
        difficulty: "Moderate",
        durationDays: 2,
        estimatedCost: 290,
        rating: 4.9,
        reviewCount: 521,
        heroImage: img("photo-1466442929976-97f336a657be", 15),
        gallery: [
          img("photo-1466442929976-97f336a657be", 151),
          img("photo-1583244532610-2a234aff5cf9", 152),
        ],
        shortDescription:
          "Cross the red Martian sands and sleep in a Bedouin camp.",
        description:
          "Day one is a 14km traverse through Khazali Canyon and Burdah Rock. Overnight in a goat-hair tent, traditional zarb dinner, and a sunrise jeep return.",
        bestTimeToVisit: "March to May",
        weather: "Hot",
        latitude: 29.5765,
        longitude: 35.4204,
        requiredGear: [
          "Sleeping bag liner",
          "Hiking boots",
          "Warm jacket",
          "Sun hat",
        ],
        highlights: [
          "Burdah rock arch",
          "Bedouin camp dinner",
          "Camel ride at dawn",
        ],
      },
      {
        name: "Petra Back Trail",
        type: "Hiking",
        city: "Petra",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 85,
        rating: 4.8,
        reviewCount: 412,
        heroImage: img("photo-1505761671935-60b3a7427bad", 16),
        gallery: [img("photo-1505761671935-60b3a7427bad", 161)],
        shortDescription:
          "Approach the Treasury via the cinematic high trail from Little Petra.",
        description:
          "Skip the main entrance. This 8km trail descends from the Bedouin village of Little Petra and arrives at the Treasury from above for the day's most striking view.",
        bestTimeToVisit: "March to May, October to November",
        weather: "Warm",
        latitude: 30.3285,
        longitude: 35.4444,
        requiredGear: ["Trail runners", "2L water", "Sun protection"],
        highlights: [
          "View from above the Treasury",
          "Monastery (Ad-Deir)",
          "Bedouin tea stops",
        ],
      },
      {
        name: "Dana to Feynan Thru-Hike",
        type: "Trekking",
        city: "Dana",
        difficulty: "Hard",
        durationDays: 2,
        estimatedCost: 220,
        rating: 4.9,
        reviewCount: 87,
        heroImage: img("photo-1473625247510-8ceb1760943f", 17),
        gallery: [img("photo-1473625247510-8ceb1760943f", 171)],
        shortDescription:
          "Descend 1,300m from cool highlands into the Rift Valley.",
        description:
          "Iconic two-day section of the Jordan Trail through the Dana Biosphere. Sleep at Feynan Ecolodge — candlelit, off-grid and Bedouin-run.",
        bestTimeToVisit: "March to May, October to November",
        weather: "Warm",
        latitude: 30.6705,
        longitude: 35.6044,
        requiredGear: ["Trekking poles", "Hiking boots", "Headlamp"],
        highlights: ["Wadi Dana", "Feynan Ecolodge", "Rift valley sunset"],
      },
    ],
  },
  {
    code: "MA",
    name: "Morocco",
    flag: "🇲🇦",
    region: "Arab World",
    description:
      "Atlas summits, Atlantic surf, and Saharan dunes — Morocco compresses three continents of adventure into a single country.",
    heroImage: img("photo-1489749798305-4fea3ae63d43", 18),
    currency: "MAD",
    bestSeason: "March to May, September to November",
    emergency: {
      police: "190",
      ambulance: "150",
      fire: "150",
      touristPolice: "112",
      embassyHotline: "+212 537 637 200",
    },
    sortOrder: 5,
    activities: [
      {
        name: "Toubkal Summit Push",
        type: "Climbing",
        city: "Imlil",
        difficulty: "Hard",
        durationDays: 2,
        estimatedCost: 320,
        rating: 4.8,
        reviewCount: 256,
        heroImage: img("photo-1489749798305-4fea3ae63d43", 19),
        gallery: [
          img("photo-1489749798305-4fea3ae63d43", 191),
          img("photo-1502082553048-f009c37129b9", 192),
        ],
        shortDescription:
          "Summit North Africa's highest peak at 4,167m.",
        description:
          "Two-day ascent: trek to the refuge on day one, alpine summit push at 4 AM. Includes mountain guide, refuge, all meals.",
        bestTimeToVisit: "April to October",
        weather: "Cold",
        latitude: 31.0608,
        longitude: -7.9156,
        requiredGear: [
          "Insulated jacket",
          "Mountain boots",
          "Crampons (winter)",
          "Headlamp",
        ],
        highlights: ["4,167m summit", "Atlas village stay", "Sunrise from top"],
      },
      {
        name: "Erg Chebbi Sandboarding",
        type: "Desert Safari",
        city: "Merzouga",
        difficulty: "Easy",
        durationDays: 2,
        estimatedCost: 240,
        rating: 4.6,
        reviewCount: 384,
        heroImage: img("photo-1517394834181-95ed159986c7", 20),
        gallery: [img("photo-1517394834181-95ed159986c7", 201)],
        shortDescription:
          "Camel into the dunes, sandboard down, and sleep in a luxury bivouac.",
        description:
          "Camel caravan into the Erg Chebbi at sunset, sandboarding session on the high dunes, dinner around the fire, and 4x4 dune-bashing the next morning.",
        bestTimeToVisit: "October to April",
        weather: "Hot",
        latitude: 31.1,
        longitude: -4.0167,
        requiredGear: ["Scarf", "Sunglasses", "Closed shoes"],
        highlights: [
          "Sandboard the high dunes",
          "Bivouac dinner",
          "Sunrise camel return",
        ],
      },
      {
        name: "Taghazout Surf Week",
        type: "Surfing",
        city: "Taghazout",
        difficulty: "Easy",
        durationDays: 7,
        estimatedCost: 690,
        rating: 4.7,
        reviewCount: 198,
        heroImage: img("photo-1502933691298-84fc14542831", 21),
        gallery: [img("photo-1502933691298-84fc14542831", 211)],
        shortDescription:
          "Daily Atlantic surf coaching at Anchor Point and Banana Beach.",
        description:
          "All-inclusive seven-day surf camp. Two daily sessions, video coaching, yoga, and a rooftop riad stay overlooking the ocean.",
        bestTimeToVisit: "October to April",
        weather: "Warm",
        latitude: 30.5435,
        longitude: -9.7104,
        requiredGear: ["Boardshorts", "Rash guard", "Reef-safe sunscreen"],
        highlights: ["Anchor Point lineup", "Video analysis", "Rooftop yoga"],
      },
    ],
  },
  {
    code: "OM",
    name: "Oman",
    flag: "🇴🇲",
    region: "Arab World",
    description:
      "Slot canyons, monsoon-green mountains, and turtle beaches make Oman quietly one of the great Arabian adventures.",
    heroImage: img("photo-1517220787964-7d3b51d9e0a3", 22),
    currency: "OMR",
    bestSeason: "October to April",
    emergency: {
      police: "9999",
      ambulance: "9999",
      fire: "9999",
      touristPolice: "8007777",
      embassyHotline: "+968 2464 3400",
    },
    sortOrder: 6,
    activities: [
      {
        name: "Wadi Shab Canyon Swim",
        type: "Canyoning",
        city: "Tiwi",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 70,
        rating: 4.8,
        reviewCount: 312,
        heroImage: img("photo-1502209524164-acea936639a2", 23),
        gallery: [img("photo-1502209524164-acea936639a2", 231)],
        shortDescription:
          "Hike, swim, and squeeze into a hidden waterfall cave.",
        description:
          "A 45-minute trail along the wadi rim, then 800m of swimming through emerald pools to reach the famous keyhole entrance to the cave waterfall.",
        bestTimeToVisit: "October to April",
        weather: "Warm",
        latitude: 22.83,
        longitude: 59.22,
        requiredGear: ["Dry bag", "Water shoes", "Swimwear"],
        highlights: ["Cave waterfall", "Emerald pools", "Hidden grotto"],
      },
      {
        name: "Jebel Akhdar Balcony Walk",
        type: "Hiking",
        city: "Jebel Akhdar",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 90,
        rating: 4.7,
        reviewCount: 142,
        heroImage: img("photo-1517220787964-7d3b51d9e0a3", 24),
        gallery: [img("photo-1517220787964-7d3b51d9e0a3", 241)],
        shortDescription:
          "A clifftop trail past abandoned villages and rose terraces.",
        description:
          "Walk between Al Khateem and Wadi Bani Habib along the W6 trail. Edge-of-cliff terraces, juniper forests, and 1,000m drops.",
        bestTimeToVisit: "September to May",
        weather: "Cold",
        latitude: 23.07,
        longitude: 57.65,
        requiredGear: ["Hiking boots", "Wind shell", "2L water"],
        highlights: ["Abandoned cliff villages", "Rose terraces", "W6 viewpoint"],
      },
    ],
  },
  {
    code: "TN",
    name: "Tunisia",
    flag: "🇹🇳",
    region: "Arab World",
    description:
      "Where the Sahara meets the Mediterranean — Berber kasbahs, salt-flat raids, and warm-water diving on a single coastline.",
    heroImage: img("photo-1573497019418-b400bb3ab074", 25),
    currency: "TND",
    bestSeason: "April to June, September to October",
    emergency: {
      police: "197",
      ambulance: "190",
      fire: "198",
      touristPolice: "+216 71 341 077",
      embassyHotline: "+216 71 107 000",
    },
    sortOrder: 7,
    activities: [
      {
        name: "Chott el Jerid 4x4 Crossing",
        type: "Desert Safari",
        city: "Tozeur",
        difficulty: "Easy",
        durationDays: 2,
        estimatedCost: 280,
        rating: 4.5,
        reviewCount: 78,
        heroImage: img("photo-1505765050516-f72dcac9c60a", 26),
        gallery: [img("photo-1505765050516-f72dcac9c60a", 261)],
        shortDescription:
          "Cross North Africa's largest salt lake, Star Wars sets included.",
        description:
          "Two-day Land Cruiser tour from Tozeur across the Chott to the Sahara dunes of Ksar Ghilane. Stop at the original Mos Espa film set.",
        bestTimeToVisit: "October to April",
        weather: "Hot",
        latitude: 33.7,
        longitude: 8.4,
        requiredGear: ["Sunglasses", "Scarf", "Closed shoes"],
        highlights: ["Salt mirages", "Mos Espa film set", "Hot spring at Ksar"],
      },
      {
        name: "El Jem to Mahdia Coastal Cycle",
        type: "Cycling",
        city: "El Jem",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 110,
        rating: 4.4,
        reviewCount: 36,
        heroImage: img("photo-1502903101107-1c3a6a25c5b3", 27),
        gallery: [img("photo-1502903101107-1c3a6a25c5b3", 271)],
        shortDescription:
          "55km gravel ride from Roman amphitheater to Mediterranean port.",
        description:
          "Self-guided bike tour starting at the colossal Roman amphitheater, finishing at the fishing port of Mahdia. Bike, helmet, and luggage transfer included.",
        bestTimeToVisit: "April to June",
        weather: "Warm",
        latitude: 35.3,
        longitude: 10.7,
        requiredGear: ["Helmet", "Padded shorts", "Sunglasses"],
        highlights: [
          "Roman amphitheater start",
          "Olive groves",
          "Mahdia harbor finish",
        ],
      },
    ],
  },
  {
    code: "LB",
    name: "Lebanon",
    flag: "🇱🇧",
    region: "Arab World",
    description:
      "Cedar forests, snow on the peaks and surfing on the same day. The Lebanon Mountain Trail is one of the world's most underrated thru-hikes.",
    heroImage: img("photo-1502209524164-acea936639a2", 28),
    currency: "LBP",
    bestSeason: "April to June, September to November",
    emergency: {
      police: "112",
      ambulance: "140",
      fire: "175",
      touristPolice: "1735",
      embassyHotline: "+961 4 542 600",
    },
    sortOrder: 8,
    activities: [
      {
        name: "Qadisha Valley Monastery Trek",
        type: "Hiking",
        city: "Bcharre",
        difficulty: "Moderate",
        durationDays: 2,
        estimatedCost: 240,
        rating: 4.7,
        reviewCount: 96,
        heroImage: img("photo-1502209524164-acea936639a2", 29),
        gallery: [img("photo-1502209524164-acea936639a2", 291)],
        shortDescription:
          "Walk between cliff-perched Maronite monasteries in the holy valley.",
        description:
          "Two-day point-to-point trek along a UNESCO-listed valley. Overnight at a guesthouse in Hawqa with home-cooked Lebanese mezze.",
        bestTimeToVisit: "April to October",
        weather: "Cold",
        latitude: 34.2483,
        longitude: 35.9942,
        requiredGear: ["Hiking boots", "Layers", "Trekking poles"],
        highlights: [
          "Mar Lichaa monastery",
          "Cedars of God grove",
          "Cliffside guesthouse",
        ],
      },
      {
        name: "Faraya Powder Day",
        type: "Skiing",
        city: "Faraya",
        difficulty: "Intermediate",
        durationDays: 1,
        estimatedCost: 130,
        rating: 4.5,
        reviewCount: 64,
        heroImage: img("photo-1551698618-1dfe5d97d256", 30),
        gallery: [img("photo-1551698618-1dfe5d97d256", 301)],
        shortDescription:
          "Ski the Mediterranean's biggest resort with sea views.",
        description:
          "Lift pass + rental + transport from Beirut. 42 slopes between 1,850m and 2,465m, with views all the way to the coast.",
        bestTimeToVisit: "January to March",
        weather: "Snow",
        latitude: 34.0167,
        longitude: 35.85,
        requiredGear: ["Ski jacket", "Goggles", "Warm gloves"],
        highlights: ["Sea-view summit", "Off-piste bowls", "Apres in the village"],
      },
    ],
  },
  {
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    region: "Arab World",
    description:
      "The Inland Sea, the Khor al-Adaid, is one of the few places on earth where the desert meets a sheltered sea.",
    heroImage: img("photo-1568322445389-f64ac2515099", 31),
    currency: "QAR",
    bestSeason: "November to March",
    emergency: {
      police: "999",
      ambulance: "999",
      fire: "999",
      touristPolice: "+974 4444 5555",
      embassyHotline: "+974 4496 6000",
    },
    sortOrder: 9,
    activities: [
      {
        name: "Khor al-Adaid Inland Sea Drive",
        type: "Desert Safari",
        city: "Mesaieed",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 150,
        rating: 4.7,
        reviewCount: 218,
        heroImage: img("photo-1568322445389-f64ac2515099", 32),
        gallery: [img("photo-1568322445389-f64ac2515099", 321)],
        shortDescription:
          "Dune-bash to the only sea-meets-Sahara on the Arabian Peninsula.",
        description:
          "Half-day safari from Doha to the UNESCO Khor al-Adaid. Includes sandboarding session, camel ride, and a buffet lunch overlooking the Inland Sea.",
        bestTimeToVisit: "October to April",
        weather: "Hot",
        latitude: 24.6,
        longitude: 51.3667,
        requiredGear: ["Sunglasses", "Closed shoes", "Light layers"],
        highlights: [
          "Singing dunes descent",
          "Saudi border viewpoint",
          "Inland Sea swim",
        ],
      },
      {
        name: "Doha Pearl-Diving Sail",
        type: "Sailing",
        city: "Doha",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 120,
        rating: 4.4,
        reviewCount: 64,
        heroImage: img("photo-1505739679850-7adfa2ba9efb", 33),
        gallery: [img("photo-1505739679850-7adfa2ba9efb", 331)],
        shortDescription:
          "Sail a wooden dhow on a re-creation of the historic pearl route.",
        description:
          "A four-hour sail along the Doha Bay corniche. Snorkel a shallow oyster bank with a pearl diver who explains the trade.",
        bestTimeToVisit: "October to April",
        weather: "Warm",
        latitude: 25.2854,
        longitude: 51.531,
        requiredGear: ["Swimwear", "Towel", "Sunscreen"],
        highlights: [
          "Doha skyline view",
          "Pearl diving demo",
          "Traditional dhow",
        ],
      },
    ],
  },
  {
    code: "KW",
    name: "Kuwait",
    flag: "🇰🇼",
    region: "Arab World",
    description:
      "Spring brings a green carpet to the Kuwaiti desert — a tiny window for one of the region's most unique nomadic adventures.",
    heroImage: img("photo-1547235001-d703406d3a37", 34),
    currency: "KWD",
    bestSeason: "February to April",
    emergency: {
      police: "112",
      ambulance: "112",
      fire: "112",
      touristPolice: null,
      embassyHotline: "+965 2259 1001",
    },
    sortOrder: 10,
    activities: [
      {
        name: "Wafra Spring Bloom Camp",
        type: "Desert Safari",
        city: "Wafra",
        difficulty: "Easy",
        durationDays: 2,
        estimatedCost: 260,
        rating: 4.5,
        reviewCount: 41,
        heroImage: img("photo-1505765050516-f72dcac9c60a", 35),
        gallery: [img("photo-1505765050516-f72dcac9c60a", 351)],
        shortDescription:
          "Camp in the rare green Kuwaiti desert during the spring bloom.",
        description:
          "Two-night Bedouin-style camp during the brief spring season. Cooking on the fire, falconry demonstration, and 4x4 wildflower drives.",
        bestTimeToVisit: "March",
        weather: "Warm",
        latitude: 28.6383,
        longitude: 47.93,
        requiredGear: ["Sleeping bag", "Light jacket", "Hat"],
        highlights: ["Falconry demo", "Wildflower fields", "Bedouin tea"],
      },
      {
        name: "Failaka Island Snorkel",
        type: "Snorkeling",
        city: "Failaka",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 95,
        rating: 4.3,
        reviewCount: 52,
        heroImage: img("photo-1505144808419-1957a94ca61e", 36),
        gallery: [img("photo-1505144808419-1957a94ca61e", 361)],
        shortDescription:
          "Boat to a Hellenistic ruin and snorkel its surrounding reefs.",
        description:
          "Day trip from Salmiya marina. Snorkel two patch reefs, then walk among the ruins of Ikaros, Alexander's outpost.",
        bestTimeToVisit: "October to May",
        weather: "Warm",
        latitude: 29.4458,
        longitude: 48.3325,
        requiredGear: ["Snorkel set", "Swimwear", "Reef-safe sunscreen"],
        highlights: ["Ikaros ruins", "Patch reef snorkel", "Marina cruise"],
      },
    ],
  },
  {
    code: "BH",
    name: "Bahrain",
    flag: "🇧🇭",
    region: "Arab World",
    description:
      "An archipelago of pearl reefs, mangroves and the world's largest underwater theme park — adventure in a small footprint.",
    heroImage: img("photo-1582211232618-58af5c54a0ef", 37),
    currency: "BHD",
    bestSeason: "November to March",
    emergency: {
      police: "999",
      ambulance: "999",
      fire: "999",
      touristPolice: "+973 1721 1888",
      embassyHotline: "+973 1724 2700",
    },
    sortOrder: 11,
    activities: [
      {
        name: "Dive Bahrain Underwater Park",
        type: "Diving",
        city: "Manama",
        difficulty: "Intermediate",
        durationDays: 1,
        estimatedCost: 175,
        rating: 4.6,
        reviewCount: 88,
        heroImage: img("photo-1518837695005-2083093ee35b", 38),
        gallery: [img("photo-1518837695005-2083093ee35b", 381)],
        shortDescription:
          "Dive a sunken Boeing 747 in the world's largest underwater park.",
        description:
          "Two-tank guided dive on the 70-meter submerged Boeing 747 plus a recreated pearl merchant's house. Operator includes gear and lunch.",
        bestTimeToVisit: "November to April",
        weather: "Warm",
        latitude: 26.05,
        longitude: 50.6,
        requiredGear: ["Open Water cert", "Swimwear", "Logbook"],
        highlights: [
          "Sunken Boeing 747",
          "Pearl merchant ruins",
          "Coral propagation reef",
        ],
      },
      {
        name: "Tubli Bay Mangrove Kayak",
        type: "Kayaking",
        city: "Tubli",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 65,
        rating: 4.4,
        reviewCount: 36,
        heroImage: img("photo-1502920917128-1aa500764cbd", 39),
        gallery: [img("photo-1502920917128-1aa500764cbd", 391)],
        shortDescription:
          "Sunset kayak through Bahrain's last remaining mangroves.",
        description:
          "A 90-minute paddle through the protected Tubli Bay mangroves with a marine biologist guide. Flamingo and crab spotting.",
        bestTimeToVisit: "October to April",
        weather: "Warm",
        latitude: 26.2,
        longitude: 50.55,
        requiredGear: ["Quick-dry shorts", "Reef shoes", "Hat"],
        highlights: ["Flamingo flock", "Mangrove tunnels", "Marine biologist guide"],
      },
    ],
  },
  {
    code: "IQ",
    name: "Iraq",
    flag: "🇮🇶",
    region: "Arab World",
    description:
      "The Mesopotamian marshes and Kurdish mountains are quietly opening to adventure travelers.",
    heroImage: img("photo-1502209524164-acea936639a2", 40),
    currency: "IQD",
    bestSeason: "March to May, October to November",
    emergency: {
      police: "104",
      ambulance: "122",
      fire: "115",
      touristPolice: null,
      embassyHotline: "+964 760 030 3000",
    },
    sortOrder: 12,
    activities: [
      {
        name: "Mesopotamian Marshes Mashoof Tour",
        type: "Boating",
        city: "Chibayish",
        difficulty: "Easy",
        durationDays: 2,
        estimatedCost: 320,
        rating: 4.7,
        reviewCount: 28,
        heroImage: img("photo-1502920917128-1aa500764cbd", 41),
        gallery: [img("photo-1502920917128-1aa500764cbd", 411)],
        shortDescription:
          "Drift through the UNESCO Ahwar marshes by traditional reed boat.",
        description:
          "Sleep in a Ma'dan reed mudhif (guesthouse), learn to pole a mashoof, and visit floating villages unchanged for 5,000 years.",
        bestTimeToVisit: "October to April",
        weather: "Warm",
        latitude: 30.97,
        longitude: 47.0,
        requiredGear: ["Sun hat", "Long sleeves", "Insect repellent"],
        highlights: ["Mudhif sleepover", "Buffalo herds", "Floating market"],
      },
      {
        name: "Halgurd Sakran Trek",
        type: "Trekking",
        city: "Choman",
        difficulty: "Hard",
        durationDays: 3,
        estimatedCost: 540,
        rating: 4.8,
        reviewCount: 19,
        heroImage: img("photo-1473625247510-8ceb1760943f", 42),
        gallery: [img("photo-1473625247510-8ceb1760943f", 421)],
        shortDescription:
          "Climb to 3,607m in Iraqi Kurdistan's first national park.",
        description:
          "Three-day expedition with Kurdish guides. Base camp in alpine meadow, summit push to Halgurd, return via Sakran.",
        bestTimeToVisit: "June to September",
        weather: "Alpine",
        latitude: 36.7167,
        longitude: 44.85,
        requiredGear: ["Mountain boots", "Sleeping bag", "Down jacket"],
        highlights: ["3,607m summit", "Wildflower meadows", "Kurdish hospitality"],
      },
    ],
  },
  {
    code: "PS",
    name: "Palestine",
    flag: "🇵🇸",
    region: "Arab World",
    description:
      "From the Bethlehem hills to the Dead Sea cliffs, the Masar Ibrahim al-Khalil thru-hike traces the path attributed to the patriarch Abraham.",
    heroImage: img("photo-1505761671935-60b3a7427bad", 43),
    currency: "ILS",
    bestSeason: "March to May, October to November",
    emergency: {
      police: "100",
      ambulance: "101",
      fire: "102",
      touristPolice: null,
      embassyHotline: "+972 2 622 7100",
    },
    sortOrder: 13,
    activities: [
      {
        name: "Masar Ibrahim Section Hike",
        type: "Hiking",
        city: "Bethlehem",
        difficulty: "Moderate",
        durationDays: 3,
        estimatedCost: 410,
        rating: 4.7,
        reviewCount: 54,
        heroImage: img("photo-1473625247510-8ceb1760943f", 44),
        gallery: [img("photo-1473625247510-8ceb1760943f", 441)],
        shortDescription:
          "Walk three days through the South Hebron hills with homestays.",
        description:
          "Bethlehem to Battir to Ras al-Jora. Stay with Palestinian families, share daily meals, walk olive groves and shepherd paths.",
        bestTimeToVisit: "March to May, October",
        weather: "Warm",
        latitude: 31.7054,
        longitude: 35.2024,
        requiredGear: ["Trail shoes", "Sun hat", "2L water"],
        highlights: ["Homestay dinners", "Battir terraces", "Roman cisterns"],
      },
    ],
  },
  {
    code: "SY",
    name: "Syria",
    flag: "🇸🇾",
    region: "Arab World",
    description:
      "The ancient caravan routes from Damascus to Palmyra are slowly reopening to small group expeditions.",
    heroImage: img("photo-1505765050516-f72dcac9c60a", 45),
    currency: "SYP",
    bestSeason: "March to May, October to November",
    emergency: {
      police: "112",
      ambulance: "110",
      fire: "113",
      touristPolice: null,
      embassyHotline: "+963 11 333 8000",
    },
    sortOrder: 14,
    activities: [
      {
        name: "Krak des Chevaliers Day Hike",
        type: "Hiking",
        city: "Homs",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 60,
        rating: 4.6,
        reviewCount: 12,
        heroImage: img("photo-1505761671935-60b3a7427bad", 46),
        gallery: [img("photo-1505761671935-60b3a7427bad", 461)],
        shortDescription:
          "Hike up to the most complete Crusader castle in the world.",
        description:
          "A 6km out-and-back ridge walk approaching the colossal castle from the wadi below — the most striking sight line.",
        bestTimeToVisit: "March to May, October",
        weather: "Warm",
        latitude: 34.7567,
        longitude: 36.2944,
        requiredGear: ["Trail shoes", "Hat", "1.5L water"],
        highlights: ["Crusader castle approach", "Wadi panoramas", "Hilltop village"],
      },
    ],
  },
  {
    code: "DZ",
    name: "Algeria",
    flag: "🇩🇿",
    region: "Arab World",
    description:
      "The Hoggar mountains and Tassili n'Ajjer rock-art plateau are among the great hidden wonders of the Sahara.",
    heroImage: img("photo-1547235001-d703406d3a37", 47),
    currency: "DZD",
    bestSeason: "October to April",
    emergency: {
      police: "1548",
      ambulance: "14",
      fire: "14",
      touristPolice: null,
      embassyHotline: "+213 770 08 2000",
    },
    sortOrder: 15,
    activities: [
      {
        name: "Tassili n'Ajjer Rock-Art Trek",
        type: "Trekking",
        city: "Djanet",
        difficulty: "Hard",
        durationDays: 7,
        estimatedCost: 1850,
        rating: 4.9,
        reviewCount: 24,
        heroImage: img("photo-1473625247510-8ceb1760943f", 48),
        gallery: [img("photo-1473625247510-8ceb1760943f", 481)],
        shortDescription:
          "Seven days through 8,000-year-old rock galleries on the high plateau.",
        description:
          "Tuareg-led expedition with camels carrying gear. Daily 18km stages between the most important pre-Saharan rock art sites in the world.",
        bestTimeToVisit: "October to April",
        weather: "Hot",
        latitude: 24.55,
        longitude: 9.4833,
        requiredGear: [
          "Mountain boots",
          "Sleeping bag (-5C)",
          "Headlamp",
          "Long sleeves",
        ],
        highlights: [
          "Sefar rock galleries",
          "Tuareg camel caravan",
          "Plateau sunsets",
        ],
      },
      {
        name: "Hoggar Sunset Climb",
        type: "Climbing",
        city: "Tamanrasset",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 110,
        rating: 4.7,
        reviewCount: 18,
        heroImage: img("photo-1547235001-d703406d3a37", 49),
        gallery: [img("photo-1547235001-d703406d3a37", 491)],
        shortDescription:
          "Scramble up Assekrem to watch sunset from Père de Foucauld's hermitage.",
        description:
          "Late-afternoon ascent to the 2,728m saddle. Stay through the famous Hoggar sunset, return by torchlight.",
        bestTimeToVisit: "October to April",
        weather: "Cold",
        latitude: 23.276,
        longitude: 5.633,
        requiredGear: ["Warm jacket", "Headlamp", "Hiking shoes"],
        highlights: ["Assekrem hermitage", "Hoggar peaks panorama", "Sunset"],
      },
    ],
  },
  {
    code: "LY",
    name: "Libya",
    flag: "🇱🇾",
    region: "Arab World",
    description:
      "The Akakus mountains shelter some of the most spectacular dune amphitheatres on the planet.",
    heroImage: img("photo-1568322445389-f64ac2515099", 50),
    currency: "LYD",
    bestSeason: "October to April",
    emergency: {
      police: "1515",
      ambulance: "1515",
      fire: "180",
      touristPolice: null,
      embassyHotline: "+218 91 220 1000",
    },
    sortOrder: 16,
    activities: [
      {
        name: "Akakus Sand Sea 4x4",
        type: "Desert Safari",
        city: "Ghat",
        difficulty: "Moderate",
        durationDays: 4,
        estimatedCost: 1280,
        rating: 4.8,
        reviewCount: 14,
        heroImage: img("photo-1568322445389-f64ac2515099", 51),
        gallery: [img("photo-1568322445389-f64ac2515099", 511)],
        shortDescription:
          "Four-day expedition through the Akakus rock arches and dune fields.",
        description:
          "Tuareg guides, support vehicles, and traditional camp. Visit Wan Caza dune amphitheatre and the Tin Galega rock paintings.",
        bestTimeToVisit: "October to April",
        weather: "Hot",
        latitude: 25.0,
        longitude: 10.5,
        requiredGear: [
          "Sleeping bag",
          "Headlamp",
          "Sand-proof bag",
          "Long sleeves",
        ],
        highlights: ["Wan Caza dunes", "Tin Galega rock art", "Akakus arches"],
      },
    ],
  },
  {
    code: "SD",
    name: "Sudan",
    flag: "🇸🇩",
    region: "Arab World",
    description:
      "Home to more pyramids than Egypt and a coral coastline barely touched by tourism.",
    heroImage: img("photo-1505765050516-f72dcac9c60a", 52),
    currency: "SDG",
    bestSeason: "November to March",
    emergency: {
      police: "999",
      ambulance: "333",
      fire: "998",
      touristPolice: null,
      embassyHotline: "+249 18 377 7000",
    },
    sortOrder: 17,
    activities: [
      {
        name: "Meroe Pyramids Camel Crossing",
        type: "Desert Safari",
        city: "Bagrawiyah",
        difficulty: "Moderate",
        durationDays: 2,
        estimatedCost: 340,
        rating: 4.7,
        reviewCount: 22,
        heroImage: img("photo-1505765050516-f72dcac9c60a", 53),
        gallery: [img("photo-1505765050516-f72dcac9c60a", 531)],
        shortDescription:
          "Camel through the dunes that swallow the Meroe pyramid field.",
        description:
          "Two-day camel ride between the Northern, Southern and Royal Cemeteries of the Kushite kingdom. Sleep in a tented camp under the Milky Way.",
        bestTimeToVisit: "November to March",
        weather: "Hot",
        latitude: 16.9333,
        longitude: 33.7167,
        requiredGear: ["Long pants", "Sun hat", "Headlamp"],
        highlights: ["Northern pyramid field", "Camel sunset", "Tented camp"],
      },
      {
        name: "Sanganeb Atoll Liveaboard",
        type: "Diving",
        city: "Port Sudan",
        difficulty: "Advanced",
        durationDays: 7,
        estimatedCost: 2150,
        rating: 4.9,
        reviewCount: 31,
        heroImage: img("photo-1518837695005-2083093ee35b", 54),
        gallery: [img("photo-1518837695005-2083093ee35b", 541)],
        shortDescription:
          "Seven-day liveaboard on one of the Red Sea's wildest reefs.",
        description:
          "Daily three- and four-tank dives on Sanganeb, Sha'ab Rumi (Cousteau's old base), and the Umbria wreck.",
        bestTimeToVisit: "March to May, October to November",
        weather: "Tropical",
        latitude: 19.7167,
        longitude: 37.4333,
        requiredGear: [
          "Advanced Open Water cert",
          "Dive computer",
          "5mm wetsuit",
        ],
        highlights: [
          "Sha'ab Rumi shark dive",
          "Umbria wreck",
          "Cousteau's Conshelf II remains",
        ],
      },
    ],
  },
  {
    code: "SO",
    name: "Somalia",
    flag: "🇸🇴",
    region: "Arab World",
    description:
      "The Cal Madow mountains and Berbera coast are quietly returning to small-group adventure operators.",
    heroImage: img("photo-1502209524164-acea936639a2", 55),
    currency: "SOS",
    bestSeason: "November to February",
    emergency: {
      police: "888",
      ambulance: "999",
      fire: "555",
      touristPolice: null,
      embassyHotline: "+252 61 884 3000",
    },
    sortOrder: 18,
    activities: [
      {
        name: "Cal Madow Cloud-Forest Hike",
        type: "Hiking",
        city: "Erigavo",
        difficulty: "Hard",
        durationDays: 4,
        estimatedCost: 980,
        rating: 4.6,
        reviewCount: 9,
        heroImage: img("photo-1502209524164-acea936639a2", 56),
        gallery: [img("photo-1502209524164-acea936639a2", 561)],
        shortDescription:
          "Trek through ancient juniper forests in the Horn of Africa.",
        description:
          "Four-day expedition through the Cal Madow range with local Somali guides. Wildlife includes hamadryas baboons and dik-diks.",
        bestTimeToVisit: "November to February",
        weather: "Cool",
        latitude: 10.6167,
        longitude: 47.3667,
        requiredGear: [
          "Mountain boots",
          "Rain shell",
          "Sleeping bag",
          "Long pants",
        ],
        highlights: ["Cloud forest", "Wildlife sightings", "Local homestay"],
      },
    ],
  },
  {
    code: "DJ",
    name: "Djibouti",
    flag: "🇩🇯",
    region: "Arab World",
    description:
      "Whale-shark season in the Gulf of Tadjoura and the salt-floor lake of Assal — the lowest point in Africa.",
    heroImage: img("photo-1505144808419-1957a94ca61e", 57),
    currency: "DJF",
    bestSeason: "October to February",
    emergency: {
      police: "17",
      ambulance: "351351",
      fire: "18",
      touristPolice: null,
      embassyHotline: "+253 21 45 30 00",
    },
    sortOrder: 19,
    activities: [
      {
        name: "Whale Shark Snorkel",
        type: "Snorkeling",
        city: "Tadjoura",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 220,
        rating: 4.9,
        reviewCount: 47,
        heroImage: img("photo-1505144808419-1957a94ca61e", 58),
        gallery: [img("photo-1505144808419-1957a94ca61e", 581)],
        shortDescription:
          "Swim with the world's largest fish during the Tadjoura aggregation.",
        description:
          "Half-day boat trip during the November-January aggregation when juvenile whale sharks feed in the gulf. Operator includes mask, fins and marine guide.",
        bestTimeToVisit: "November to January",
        weather: "Tropical",
        latitude: 11.7833,
        longitude: 42.8833,
        requiredGear: ["Reef-safe sunscreen", "Swimwear", "Towel"],
        highlights: [
          "Whale shark encounter",
          "Bay of Ghoubbet",
          "Gulf snorkel",
        ],
      },
      {
        name: "Lake Assal Salt Flat Walk",
        type: "Hiking",
        city: "Lake Assal",
        difficulty: "Easy",
        durationDays: 1,
        estimatedCost: 90,
        rating: 4.5,
        reviewCount: 28,
        heroImage: img("photo-1505765050516-f72dcac9c60a", 59),
        gallery: [img("photo-1505765050516-f72dcac9c60a", 591)],
        shortDescription:
          "Walk the lowest point in Africa, 155m below sea level.",
        description:
          "Day trip from Djibouti City to walk the alien salt flats and bathe in the hyper-saline lake.",
        bestTimeToVisit: "October to March",
        weather: "Hot",
        latitude: 11.65,
        longitude: 42.4167,
        requiredGear: ["Sunglasses", "Sun hat", "Closed shoes"],
        highlights: ["155m below sea level", "Salt sculptures", "Hyper-saline float"],
      },
    ],
  },
  {
    code: "KM",
    name: "Comoros",
    flag: "🇰🇲",
    region: "Arab World",
    description:
      "An archipelago with active volcanoes, untouched coral and humpback whales calving in the channel each season.",
    heroImage: img("photo-1505144808419-1957a94ca61e", 60),
    currency: "KMF",
    bestSeason: "May to October",
    emergency: {
      police: "17",
      ambulance: "15",
      fire: "18",
      touristPolice: null,
      embassyHotline: "+269 773 3203",
    },
    sortOrder: 20,
    activities: [
      {
        name: "Mt Karthala Volcano Trek",
        type: "Trekking",
        city: "Moroni",
        difficulty: "Hard",
        durationDays: 2,
        estimatedCost: 420,
        rating: 4.7,
        reviewCount: 16,
        heroImage: img("photo-1502082553048-f009c37129b9", 61),
        gallery: [img("photo-1502082553048-f009c37129b9", 611)],
        shortDescription:
          "Climb to the rim of one of the world's largest active calderas.",
        description:
          "Two-day ascent of the 2,361m Karthala volcano. Overnight at the rim, descend to the still-warm caldera floor at sunrise.",
        bestTimeToVisit: "June to October",
        weather: "Cool",
        latitude: -11.75,
        longitude: 43.3833,
        requiredGear: [
          "Mountain boots",
          "Headlamp",
          "Warm layers",
          "Rain shell",
        ],
        highlights: ["Caldera rim camp", "Sunrise descent", "Cloud forest"],
      },
    ],
  },
  {
    code: "MR",
    name: "Mauritania",
    flag: "🇲🇷",
    region: "Arab World",
    description:
      "Ride the world's longest train across the Sahara, then trek to the medieval library cities of the Adrar.",
    heroImage: img("photo-1547235001-d703406d3a37", 62),
    currency: "MRU",
    bestSeason: "November to February",
    emergency: {
      police: "117",
      ambulance: "101",
      fire: "118",
      touristPolice: null,
      embassyHotline: "+222 4525 2660",
    },
    sortOrder: 21,
    activities: [
      {
        name: "Iron Ore Train Ride",
        type: "Adventure",
        city: "Choum",
        difficulty: "Hard",
        durationDays: 1,
        estimatedCost: 0,
        rating: 4.9,
        reviewCount: 38,
        heroImage: img("photo-1547235001-d703406d3a37", 63),
        gallery: [img("photo-1547235001-d703406d3a37", 631)],
        shortDescription:
          "Ride 12 hours on top of the 2.5km-long iron ore train across the Sahara.",
        description:
          "An open-top, free, 12-hour journey on a Mauritanian iron ore wagon. The most cinematic ride on Earth — and the harshest. Bring goggles and a scarf.",
        bestTimeToVisit: "November to February",
        weather: "Hot",
        latitude: 21.32,
        longitude: -13.0,
        requiredGear: [
          "Ski goggles",
          "Shemagh (face wrap)",
          "Sleeping bag",
          "5L water",
        ],
        highlights: [
          "2.5km train",
          "Open Sahara views",
          "Sunset on the wagons",
        ],
      },
      {
        name: "Adrar Plateau Library Trek",
        type: "Trekking",
        city: "Chinguetti",
        difficulty: "Moderate",
        durationDays: 4,
        estimatedCost: 980,
        rating: 4.7,
        reviewCount: 21,
        heroImage: img("photo-1505765050516-f72dcac9c60a", 64),
        gallery: [img("photo-1505765050516-f72dcac9c60a", 641)],
        shortDescription:
          "Camel between Saharan medieval cities to read 800-year-old manuscripts.",
        description:
          "From Chinguetti to Ouadane along the medieval pilgrim road. Visit the desert libraries holding handwritten Korans from the 13th century.",
        bestTimeToVisit: "November to February",
        weather: "Hot",
        latitude: 20.4667,
        longitude: -12.3667,
        requiredGear: ["Long sleeves", "Sleeping bag", "Sun hat"],
        highlights: [
          "Chinguetti libraries",
          "Camel caravan",
          "Ouadane ksar",
        ],
      },
    ],
  },
  {
    code: "YE",
    name: "Yemen",
    flag: "🇾🇪",
    region: "Arab World",
    description:
      "Socotra Island — a UNESCO biosphere of dragon's-blood trees and bottle-shaped baobabs unlike anywhere on the planet.",
    heroImage: img("photo-1502209524164-acea936639a2", 65),
    currency: "YER",
    bestSeason: "October to April",
    emergency: {
      police: "194",
      ambulance: "191",
      fire: "199",
      touristPolice: null,
      embassyHotline: "+967 1 755 2000",
    },
    sortOrder: 22,
    activities: [
      {
        name: "Socotra Dragon Tree Camp",
        type: "Hiking",
        city: "Hadibo",
        difficulty: "Moderate",
        durationDays: 6,
        estimatedCost: 2400,
        rating: 4.9,
        reviewCount: 33,
        heroImage: img("photo-1502209524164-acea936639a2", 66),
        gallery: [img("photo-1502209524164-acea936639a2", 661)],
        shortDescription:
          "Six days exploring Socotra's dragon-blood forests and dune beaches.",
        description:
          "Camping expedition across Socotra Island. Sleep on Arher dunes, hike to Dixam Plateau, swim at Detwah Lagoon.",
        bestTimeToVisit: "October to April",
        weather: "Warm",
        latitude: 12.4634,
        longitude: 53.8237,
        requiredGear: [
          "Sleeping bag",
          "Tent (provided)",
          "Hiking shoes",
          "Reef shoes",
        ],
        highlights: [
          "Dragon-blood tree forest",
          "Arher dunes camp",
          "Detwah lagoon",
        ],
      },
    ],
  },

  // Non-Arab adventure destinations for variety
  {
    code: "NP",
    name: "Nepal",
    flag: "🇳🇵",
    region: "Asia",
    description:
      "Eight of the world's fourteen 8,000m peaks rise from this small Himalayan republic.",
    heroImage: img("photo-1518002171953-a080ee817e1f", 67),
    currency: "NPR",
    bestSeason: "March to May, October to November",
    emergency: {
      police: "100",
      ambulance: "102",
      fire: "101",
      touristPolice: "+977 1 4247041",
      embassyHotline: "+977 1 423 4000",
    },
    sortOrder: 30,
    activities: [
      {
        name: "Annapurna Base Camp Trek",
        type: "Trekking",
        city: "Pokhara",
        difficulty: "Hard",
        durationDays: 10,
        estimatedCost: 1200,
        rating: 4.9,
        reviewCount: 1247,
        heroImage: img("photo-1518002171953-a080ee817e1f", 68),
        gallery: [img("photo-1518002171953-a080ee817e1f", 681)],
        shortDescription:
          "Walk into the Annapurna Sanctuary surrounded by 7,000m peaks.",
        description:
          "Classic 10-day teahouse trek from Pokhara to ABC at 4,130m. Includes guide, porter, all teahouse stays.",
        bestTimeToVisit: "March to May, October to November",
        weather: "Cold",
        latitude: 28.5314,
        longitude: 83.8782,
        requiredGear: [
          "4-season sleeping bag",
          "Down jacket",
          "Mountain boots",
          "Trekking poles",
        ],
        highlights: ["ABC sanctuary", "Machapuchare view", "Hot springs at Jhinu"],
      },
    ],
  },
  {
    code: "PE",
    name: "Peru",
    flag: "🇵🇪",
    region: "South America",
    description:
      "From the Andes to the Amazon, Peru holds the densest concentration of adventure terrain in the Americas.",
    heroImage: img("photo-1526392060635-9d6019884377", 69),
    currency: "PEN",
    bestSeason: "May to September",
    emergency: {
      police: "105",
      ambulance: "117",
      fire: "116",
      touristPolice: "+51 1 460 1060",
      embassyHotline: "+51 1 618 2000",
    },
    sortOrder: 31,
    activities: [
      {
        name: "Salkantay Trek to Machu Picchu",
        type: "Trekking",
        city: "Cusco",
        difficulty: "Hard",
        durationDays: 5,
        estimatedCost: 540,
        rating: 4.8,
        reviewCount: 938,
        heroImage: img("photo-1526392060635-9d6019884377", 70),
        gallery: [img("photo-1526392060635-9d6019884377", 701)],
        shortDescription:
          "Five-day high-altitude alternative to the Inca Trail.",
        description:
          "Cross the 4,630m Salkantay pass below the eponymous peak. Ends at Machu Picchu at sunrise.",
        bestTimeToVisit: "May to September",
        weather: "Cold",
        latitude: -13.3416,
        longitude: -72.5418,
        requiredGear: [
          "Hiking boots",
          "Rain shell",
          "Down jacket",
          "Sleeping bag",
        ],
        highlights: ["Humantay Lake", "Salkantay pass", "Machu Picchu sunrise"],
      },
    ],
  },
  {
    code: "IS",
    name: "Iceland",
    flag: "🇮🇸",
    region: "Europe",
    description:
      "Glacier hikes, lava-tube spelunking and ice-cave exploration on a geothermal island the size of Kentucky.",
    heroImage: img("photo-1487730116645-74489c95b41b", 71),
    currency: "ISK",
    bestSeason: "June to August, February for ice caves",
    emergency: {
      police: "112",
      ambulance: "112",
      fire: "112",
      touristPolice: null,
      embassyHotline: "+354 595 2200",
    },
    sortOrder: 32,
    activities: [
      {
        name: "Vatnajökull Ice Cave Tour",
        type: "Glacier",
        city: "Höfn",
        difficulty: "Moderate",
        durationDays: 1,
        estimatedCost: 195,
        rating: 4.9,
        reviewCount: 612,
        heroImage: img("photo-1487730116645-74489c95b41b", 72),
        gallery: [img("photo-1487730116645-74489c95b41b", 721)],
        shortDescription:
          "Crawl through electric-blue ice caves under Europe's largest glacier.",
        description:
          "Half-day super-jeep + crampon tour into the seasonal ice caves of Vatnajökull. Operator provides all gear including helmet.",
        bestTimeToVisit: "November to March",
        weather: "Cold",
        latitude: 64.4163,
        longitude: -16.2444,
        requiredGear: [
          "Insulated boots",
          "Waterproof shell",
          "Warm gloves",
        ],
        highlights: ["Blue ice cave", "Glacier hike", "Super-jeep ride"],
      },
    ],
  },
];

async function main() {
  // Reset
  await db.execute(sql`TRUNCATE TABLE favorites, reviews, trips, activities, countries RESTART IDENTITY CASCADE`);

  for (const c of COUNTRIES) {
    await db.insert(countriesTable).values({
      code: c.code,
      name: c.name,
      flag: c.flag,
      region: c.region,
      description: c.description,
      heroImage: pickImage(c.code, 0),
      currency: c.currency,
      bestSeason: c.bestSeason,
      emergency: c.emergency,
      sortOrder: c.sortOrder,
    });

    for (let i = 0; i < c.activities.length; i++) {
      const a = c.activities[i];
      const heroIdx = (i + 1) % Math.max(1, (COUNTRY_IMAGES[c.code] ?? []).length);
      await db.insert(activitiesTable).values({
        name: a.name,
        type: a.type,
        countryCode: c.code,
        city: a.city,
        difficulty: a.difficulty,
        durationDays: a.durationDays,
        estimatedCost: a.estimatedCost,
        rating: a.rating,
        reviewCount: a.reviewCount,
        heroImage: pickImage(c.code, i + 1),
        gallery: pickGallery(c.code, heroIdx, 3),
        shortDescription: a.shortDescription,
        description: a.description,
        bestTimeToVisit: a.bestTimeToVisit,
        weather: a.weather,
        latitude: a.latitude,
        longitude: a.longitude,
        requiredGear: a.requiredGear,
        highlights: a.highlights,
      });
    }
  }

  console.log(`Seeded ${COUNTRIES.length} countries with activities.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
