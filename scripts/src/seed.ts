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
const IMAGES = JSON.parse(
  readFileSync(join(__dirname, "egypt_images.json"), "utf8"),
) as Record<string, string[]>;

function pick(key: string, idx = 0): string {
  const pool = IMAGES[key] ?? [];
  if (pool.length === 0) return "";
  return pool[idx % pool.length];
}

function gallery(key: string): string[] {
  return (IMAGES[key] ?? []).slice(0, 4);
}

const EGYPT = {
  code: "EG",
  name: "Egypt",
  flag: "🇪🇬",
  region: "North Africa",
  description:
    "From the Saharan dunes to the Red Sea reefs, Egypt offers some of the world's most storied adventure terrain — pharaonic deserts above water, kaleidoscopic coral below.",
  heroImage: pick("egypt", 0),
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
};

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
  galleryImages: string[];
  shortDescription: string;
  description: string;
  bestTimeToVisit: string;
  weather: string;
  latitude: number;
  longitude: number;
  requiredGear: string[];
  highlights: string[];
};

const ACTIVITIES: ActivitySeed[] = [
  {
    name: "Ras Mohammed Reef Dive",
    type: "Diving",
    city: "Sharm El Sheikh",
    difficulty: "Intermediate",
    durationDays: 1,
    estimatedCost: 130,
    rating: 4.9,
    reviewCount: 612,
    heroImage: pick("rasmohammed", 0),
    galleryImages: gallery("rasmohammed"),
    shortDescription:
      "Drift along Egypt's most legendary coral wall in the Red Sea.",
    description:
      "A two-tank boat dive at the iconic Shark Reef and Yolanda wreck site inside Ras Mohammed National Park. Vertical coral wall to 80m, schools of barracuda, and resident reef sharks. Operator includes guides, lunch and an optional third shore dive.",
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
    name: "Dahab Blue Hole Free-Dive",
    type: "Diving",
    city: "Dahab",
    difficulty: "Advanced",
    durationDays: 1,
    estimatedCost: 110,
    rating: 4.8,
    reviewCount: 487,
    heroImage: pick("dahab", 0),
    galleryImages: gallery("dahab"),
    shortDescription:
      "Descend the world-famous Blue Hole sinkhole on the Sinai coast.",
    description:
      "Guided free-dive or scuba session at Dahab's iconic 130m vertical sinkhole. Includes shore-dive of the Bells, traverse to the Saddle, and brunch at a Bedouin cafe overlooking the Gulf of Aqaba.",
    bestTimeToVisit: "April to November",
    weather: "Tropical",
    latitude: 28.5722,
    longitude: 34.5378,
    requiredGear: [
      "Dive certification",
      "Wetsuit (3mm)",
      "Underwater torch",
    ],
    highlights: [
      "Blue Hole shore entry",
      "The Bells dive site",
      "Bedouin beach brunch",
    ],
  },
  {
    name: "Mount Sinai Sunrise Trek",
    type: "Hiking",
    city: "Saint Catherine",
    difficulty: "Moderate",
    durationDays: 1,
    estimatedCost: 75,
    rating: 4.7,
    reviewCount: 388,
    heroImage: pick("sinai", 0),
    galleryImages: gallery("sinai"),
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
    name: "White Desert Overnight Camp",
    type: "Camping",
    city: "Farafra",
    difficulty: "Moderate",
    durationDays: 3,
    estimatedCost: 480,
    rating: 4.8,
    reviewCount: 214,
    heroImage: pick("whitedesert", 0),
    galleryImages: gallery("whitedesert"),
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
    name: "Siwa Oasis 4x4 Safari",
    type: "Safari",
    city: "Siwa",
    difficulty: "Moderate",
    durationDays: 2,
    estimatedCost: 360,
    rating: 4.7,
    reviewCount: 162,
    heroImage: pick("siwa", 0),
    galleryImages: gallery("siwa"),
    shortDescription:
      "Dune-bash the Great Sand Sea and float in salt lakes at Siwa.",
    description:
      "Two-day safari from Siwa town into the Great Sand Sea: sandboarding the high dunes, floating in the hyper-saline Bir Wahed lake, and a sunset stop at Cleopatra's Spring before camping at a Bedouin bivouac.",
    bestTimeToVisit: "October to April",
    weather: "Hot",
    latitude: 29.2032,
    longitude: 25.5197,
    requiredGear: [
      "Sunglasses",
      "Scarf",
      "Closed shoes",
      "Swimwear",
    ],
    highlights: [
      "Great Sand Sea dunes",
      "Bir Wahed salt-lake float",
      "Cleopatra's Spring",
    ],
  },
  {
    name: "Marsa Alam Reef Snorkel",
    type: "Snorkeling",
    city: "Marsa Alam",
    difficulty: "Easy",
    durationDays: 1,
    estimatedCost: 95,
    rating: 4.7,
    reviewCount: 238,
    heroImage: pick("marsaalam", 0),
    galleryImages: gallery("marsaalam"),
    shortDescription:
      "Snorkel with dugongs and sea turtles in the protected southern Red Sea.",
    description:
      "All-day boat trip to Sha'ab Samadai (Dolphin House) and Abu Dabbab bay. Three guided snorkel sites, lunch on board, and very high probability of dolphin and dugong encounters.",
    bestTimeToVisit: "March to November",
    weather: "Tropical",
    latitude: 25.0683,
    longitude: 34.8889,
    requiredGear: [
      "Reef-safe sunscreen",
      "Swimwear",
      "Towel",
      "Underwater camera",
    ],
    highlights: [
      "Dolphin House lagoon",
      "Sea turtle encounters",
      "Possible dugong sighting",
    ],
  },
  {
    name: "Wadi El Gemal Desert Camp",
    type: "Camping",
    city: "Marsa Alam",
    difficulty: "Easy",
    durationDays: 2,
    estimatedCost: 220,
    rating: 4.6,
    reviewCount: 96,
    heroImage: pick("wadiel", 0),
    galleryImages: gallery("wadiel"),
    shortDescription:
      "Camp in a protected national park between the desert and the reef.",
    description:
      "Two-day eco-camp in Wadi El Gemal National Park. Spend the day exploring mangrove channels by kayak, visiting Ababda Bedouin villages, and sleeping in a low-impact tented camp.",
    bestTimeToVisit: "October to May",
    weather: "Warm",
    latitude: 24.6883,
    longitude: 35.0833,
    requiredGear: [
      "Quick-dry clothing",
      "Reef shoes",
      "Sleeping bag",
      "Headlamp",
    ],
    highlights: [
      "Ababda Bedouin camp",
      "Mangrove kayak",
      "Stargazing dinner",
    ],
  },
  {
    name: "Saint Catherine Summit Trek",
    type: "Hiking",
    city: "Saint Catherine",
    difficulty: "Hard",
    durationDays: 2,
    estimatedCost: 240,
    rating: 4.8,
    reviewCount: 142,
    heroImage: pick("sinai", 1),
    galleryImages: gallery("sinai"),
    shortDescription:
      "Climb Egypt's highest peak (2,629m) with Bedouin Jabaliya guides.",
    description:
      "Two-day expedition to the summit of Mount Catherine, the highest point in Egypt. Sleep at the Galt al-Azraq pool, summit at sunrise, descend through the Wadi Talaa orchards.",
    bestTimeToVisit: "March to May, September to November",
    weather: "Cold",
    latitude: 28.5097,
    longitude: 33.9533,
    requiredGear: [
      "Mountain boots",
      "Down jacket",
      "Sleeping bag",
      "Trekking poles",
    ],
    highlights: [
      "2,629m summit",
      "Galt al-Azraq pool",
      "Wadi Talaa orchards",
    ],
  },
];

async function main() {
  await db.execute(
    sql`TRUNCATE TABLE favorites, reviews, trips, activities, countries RESTART IDENTITY CASCADE`,
  );

  await db.insert(countriesTable).values(EGYPT);

  for (const a of ACTIVITIES) {
    await db.insert(activitiesTable).values({
      name: a.name,
      type: a.type,
      countryCode: EGYPT.code,
      city: a.city,
      difficulty: a.difficulty,
      durationDays: a.durationDays,
      estimatedCost: a.estimatedCost,
      rating: a.rating,
      reviewCount: a.reviewCount,
      heroImage: a.heroImage,
      gallery: a.galleryImages,
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

  console.log(`Seeded Egypt with ${ACTIVITIES.length} adventure activities.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
