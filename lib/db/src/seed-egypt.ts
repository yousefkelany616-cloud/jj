import { sql } from "drizzle-orm";
import { db, pool } from "./index";
import { countriesTable, activitiesTable } from "./schema";

// Curated, location-specific Egyptian imagery.
// Each URL was HEAD/GET-verified to return a real image (200 + image/* content-type)
// from a publicly hot-link-accessible host (no Cloudflare-style HTML challenges,
// no hot-link 403s).
//
// Convention: index 0 is the hero photo. Indices 1..N are the gallery (the
// gallery() helper deliberately skips index 0 so users never see the same
// photo twice on the detail page).
const IMAGES: Record<string, string[]> = {
  egypt: [
    "https://i.redd.it/a7rigd8ndpeg1.jpeg",
    "https://t3.ftcdn.net/jpg/13/58/48/34/360_F_1358483452_fm1tlNaLVeMQHws2Y2Q9Pe8T5IlrpDeX.jpg",
    "https://media.gettyimages.com/id/909377362/photo/the-great-sphinx-in-front-of-pyramid-of-khafre-during-sunset-in-egypt.jpg?s=612x612&w=0&k=20&c=71EULnm_UyChtL4Ct0oPPFLOCLTCieTpS9pTv8DIjXI=",
    "https://egypttoursgroup.com/wp-content/uploads/2025/10/How-Close-Is-the-Nile-River-to-the-Pyramids-of-Giza-Egypt-Tours-Group.webp",
  ],
  // Ras Mohammed National Park, Sharm El Sheikh — Red Sea coral wall + boat dives.
  // Hero (0) + 3 gallery: park overview, conservation/coastline, divers descending, liveaboard reef wall.
  rasmohammed: [
    "https://egyptunitedtours.com/wp-content/uploads/2025/08/Diving-Ras-Mohammed-National-Park-1024x683.webp",
    "https://egyptunitedtours.com/wp-content/uploads/2025/08/History-Geography-and-Significance-of-Ras-Mohammed-National-Park-1024x895.webp",
    "https://egyptunitedtours.com/wp-content/uploads/2025/08/Conservation-Rules-and-Environmental-Challenges-of-Ras-Mohammed-1024x873.webp",
    "https://img.liveaboard.com/imageserver/picture_library/site/diving/egypt/liveaboard-egypt-ras-mohammed-red-sea-xxl.jpg?tr=w-1920,h-800,f-jpeg",
  ],
  // Dahab Blue Hole, Sinai coast — aerial sinkhole + shore-entry diving.
  // Hero (0) + 3 gallery: aerial sinkhole, coastline, diver descending, hero plate.
  dahab: [
    "https://scubaseekers.com/wp-content/uploads/2024/11/Blue_Hole_Above-medium-e1732092679876.jpg",
    "https://www.egypttoursplus.com/wp-content/uploads/2025/07/Sea-coast-in-Dahab-near-Blue-Hole-diving-at-the-Red-Sea-Sinai-Egypt.webp",
    "https://egyptunitedtours.com/wp-content/uploads/2025/09/Diving-Experience-at-the-Blue-Hole-1024x632.webp",
    "https://tidefall.xyz/images/blue-hole-dahab-hero.webp",
  ],
  // Mount Sinai sunrise hike (Camel Path / 3,750 stone steps).
  // Hero (0) + 5 gallery: alternate ascent shots, summit panorama, descent route.
  sinai: [
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-11-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-19-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-23-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-1-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-2-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-15-1024x683.jpg",
  ],
  // Mount Saint Catherine summit + monastery (Egypt's highest peak, 2,629m).
  // Hero (0) + 5 gallery: Galt al-Azraq pool, summit cross, monastery, alternate trail shots.
  stcatherine: [
    "https://www.weseektravel.com/wp-content/uploads/2022/05/climbing-mount-sinai-egypt-9-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-37-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-36-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-6-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/climbing-mount-sinai-egypt-1-1024x683.jpg",
    "https://www.weseektravel.com/wp-content/uploads/2022/05/climbing-mount-sinai-egypt-3-1024x683.jpg",
  ],
  // White Desert National Park, Farafra — chalk mushroom rock formations.
  // Hero (0) + 4 gallery: chicken-and-mushroom rock, panorama, formation close-ups, camp.
  whitedesert: [
    "https://www.egypttoursplus.com/wp-content/uploads/2025/07/Bizarre-rock-formation-in-White-desert-Egypt-1.jpg",
    "https://www.egypttoursplus.com/wp-content/uploads/2025/07/The-limestone-formation-rocks-like-a-mushroom-and-a-chicken-in-the-White-desert-Sahara-Egypt-2.jpg",
    "https://www.egypttoursplus.com/wp-content/uploads/2025/07/The-White-Desert-in-the-Sahara-of-central-Egypt-3.jpg",
    "https://www.erikastravels.com/wp-content/uploads/2020/03/White-Desert-Rock-Formations-1.jpg",
    "https://www.erikastravels.com/wp-content/uploads/2020/03/White-Desert-Camping.jpg",
  ],
  // Siwa Oasis — Great Sand Sea dunes + Bir Wahed salt lakes.
  // Hero (0) + 5 gallery: dune driving, oasis aerial, salt lakes, hot springs, alt safari shot.
  siwa: [
    "https://www.shouf.io/cdn/shop/files/Great_Sand_sea_safari_3.jpg?v=2777696372178071396",
    "https://www.shouf.io/cdn/shop/files/Great_Sand_sea_safari_1.jpg?v=17055745009504967344",
    "https://herasianadventures.com/wp-content/uploads/2025/07/siwa-oasis-in-egypt-683x1024.jpg",
    "https://egypttoursgroup.com/wp-content/uploads/2025/05/Siwa-Oasis-Hot-Springs-and-Salt-Lakes-Egypt-Tours-Group.png",
    "https://www.shouf.io/cdn/shop/files/Great_Sand_sea_safari_2.jpg",
    "https://egypttoursgroup.com/wp-content/uploads/2025/05/Siwa-Oasis-Egypt-Tours-Group.png",
  ],
  // Marsa Alam — Sataya / Sha'ab Samadai dolphin reef snorkelling.
  // Hero (0) + 5 gallery: snorkeller in reef, dolphins underwater, boat trips, alternate sites.
  marsaalam: [
    "https://sofiescapes.com/wp-content/uploads/2023/10/Dolphin-Snorkel-Egypt-Swimming-Red-sea.jpg",
    "https://sofiescapes.com/wp-content/uploads/2023/10/Dolphin-Snorkel-Egypt-Swimming-Red-sea-1-scaled.jpg",
    "https://a1toureg.com/media/galleries/overnight-snorkeling-trip-at-sataya-dolphin-reef-from-marsa-alam-24158.webp",
    "https://a1toureg.com/media/galleries/overnight-snorkeling-trip-at-sataya-dolphin-reef-from-marsa-alam-24161.webp",
    "https://a1toureg.com/media/galleries/overnight-snorkeling-trip-at-sataya-dolphin-reef-from-marsa-alam-24159.webp",
    "https://a1toureg.com/media/galleries/overnight-snorkeling-trip-at-sataya-dolphin-reef-from-marsa-alam-24162.webp",
  ],
  // Wadi El Gemal National Park — Bedouin desert camping, mangrove channels,
  // Eastern-Desert 4x4 tracks, and camel-back excursions with the Ababda.
  // Hero (0) + 5 gallery: camel/4x4 safaris, day-tour aerial, camp at sunset, alternate dunes.
  wadiel: [
    "https://megatoursegypt.com/wp-content/uploads/2025/09/super-Safari-5-1-636x426.jpg",
    "https://images.trvl-media.com/place/553248635997986417/765be985-986a-4f36-860a-1413e4af87ca.jpg?impolicy=fcrop&w=1040&h=580&q=mediumHigh",
    "https://a1toureg.com/media/toursItenary/24/10/27/c617dc85-ca50-4a0b-a12d-5d4119bcad52_wadi-el-gemal-desert-day-tou_KnH2EVp.webp",
    "https://www.egypttoursportal.com/images/2024/01/Wadi-El-Gemal-National-Park-Camping-Spots-in-Egypt-Egypt-Tours-Portal.jpg",
    "https://megatoursegypt.com/wp-content/uploads/2025/09/super-Safari-1-1-636x426.jpg",
    "https://megatoursegypt.com/wp-content/uploads/2025/09/super-Safari-3-1-636x426.jpg",
  ],
};

function pick(key: string, idx = 0): string {
  const arr = IMAGES[key] ?? [];
  if (arr.length === 0) return "";
  return arr[idx % arr.length] ?? "";
}

// Returns gallery photos for the activity detail page. Always excludes index 0
// (which is the hero image) so the user never sees the hero duplicated as a
// thumbnail. Each gallery has 3–5 unique photos per spec.
function gallery(key: string): string[] {
  return (IMAGES[key] ?? []).slice(1);
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
    requiredGear: ["Dive certification", "Wetsuit (3mm)", "Underwater torch"],
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
    requiredGear: ["Headlamp", "Warm layers", "Hiking boots", "Water (2L)"],
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
    requiredGear: ["Sunglasses", "Scarf", "Closed shoes", "Swimwear"],
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
    heroImage: pick("stcatherine", 0),
    galleryImages: gallery("stcatherine"),
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
    highlights: ["2,629m summit", "Galt al-Azraq pool", "Wadi Talaa orchards"],
  },
];

const SEED_VERSION = "egypt-only-v4-galleries.1";
const SEED_LOCK_NS = 7327342;
const SEED_LOCK_ID = 1;

export type SeedOptions = {
  force?: boolean;
  closePool?: boolean;
};

async function ensureMetadataTable(tx: typeof db): Promise<void> {
  await tx.execute(sql`
    CREATE TABLE IF NOT EXISTS app_metadata (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function getSeedMarker(tx: typeof db): Promise<string | null> {
  const result = await tx.execute<{ value: string }>(
    sql`SELECT value FROM app_metadata WHERE key = 'seed_egypt_version'`,
  );
  return result.rows[0]?.value ?? null;
}

export async function seedEgypt(opts: SeedOptions = {}): Promise<{
  status: "seeded" | "skipped";
  reason?: string;
}> {
  const { force = false, closePool = false } = opts;

  try {
    await db.execute(
      sql`SELECT pg_advisory_lock(${SEED_LOCK_NS}, ${SEED_LOCK_ID})`,
    );

    try {
      await ensureMetadataTable(db);

      if (!force) {
        const marker = await getSeedMarker(db);
        if (marker === SEED_VERSION) {
          return { status: "skipped", reason: "marker-present" };
        }
      }

      await db.transaction(async (tx) => {
        await tx.execute(
          sql`TRUNCATE TABLE favorites, reviews, trips, activities, countries RESTART IDENTITY CASCADE`,
        );

        await tx.insert(countriesTable).values(EGYPT);

        for (const a of ACTIVITIES) {
          await tx.insert(activitiesTable).values({
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

        await tx.execute(sql`
          INSERT INTO app_metadata (key, value, updated_at)
          VALUES ('seed_egypt_version', ${SEED_VERSION}, now())
          ON CONFLICT (key) DO UPDATE
          SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
        `);
      });

      return { status: "seeded", reason: SEED_VERSION };
    } finally {
      await db.execute(
        sql`SELECT pg_advisory_unlock(${SEED_LOCK_NS}, ${SEED_LOCK_ID})`,
      );
    }
  } finally {
    if (closePool) {
      await pool.end();
    }
  }
}

export async function seedEgyptIfNeeded(): Promise<void> {
  try {
    const result = await seedEgypt({ force: false });
    if (result.status === "seeded") {
      console.log(
        `[seed-egypt] Production database reseeded with ${ACTIVITIES.length} Egypt-only adventures (${SEED_VERSION}).`,
      );
    } else {
      console.log(
        `[seed-egypt] Database already contains Egypt-only data; no changes made.`,
      );
    }
  } catch (err) {
    console.error("[seed-egypt] Failed to ensure Egypt-only seed:", err);
  }
}
