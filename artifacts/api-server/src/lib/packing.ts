import type { Activity } from "@workspace/db";

type Item = { id: string; name: string; essential: boolean };
type Category = { category: string; items: Item[] };

function mk(category: string, items: Array<[string, boolean]>): Category {
  return {
    category,
    items: items.map(([name, essential], i) => ({
      id: `${category.toLowerCase().replace(/\s+/g, "-")}-${i}`,
      name,
      essential,
    })),
  };
}

export function generatePackingList(activity: Activity) {
  const t = activity.type.toLowerCase();
  const w = activity.weather.toLowerCase();

  const documents = mk("Documents", [
    ["Passport", true],
    ["Travel insurance", true],
    ["Visa or entry permit", true],
    ["Booking confirmations", false],
    ["Local emergency contacts", true],
    ["Cash in local currency", false],
  ]);

  const baseClothing: Array<[string, boolean]> = [
    ["Quick-dry t-shirts (3)", true],
    ["Long-sleeve base layer", false],
    ["Wool socks (3 pairs)", true],
    ["Underwear (5 pairs)", true],
    ["Lightweight pants", true],
  ];
  if (w.includes("hot") || w.includes("desert") || w.includes("warm")) {
    baseClothing.push(["Wide-brim sun hat", true]);
    baseClothing.push(["UV-protective shirt", false]);
  }
  if (w.includes("cold") || w.includes("snow") || w.includes("alpine")) {
    baseClothing.push(["Insulated jacket", true]);
    baseClothing.push(["Thermal leggings", true]);
    baseClothing.push(["Warm beanie", true]);
    baseClothing.push(["Insulated gloves", true]);
  }
  if (w.includes("rain") || w.includes("tropical") || w.includes("humid")) {
    baseClothing.push(["Rain shell", true]);
    baseClothing.push(["Quick-dry shorts", false]);
  }
  const clothing = mk("Clothing", baseClothing);

  let gearItems: Array<[string, boolean]> = [];
  if (t.includes("hik") || t.includes("trek")) {
    gearItems = [
      ["Trekking boots", true],
      ["Trekking poles", false],
      ["35L daypack", true],
      ["Hydration bladder (2L)", true],
      ["Headlamp + spare batteries", true],
      ["Topographic map", false],
    ];
  } else if (t.includes("div") || t.includes("snorkel")) {
    gearItems = [
      ["Mask, snorkel, fins", true],
      ["Wetsuit (3mm)", false],
      ["Dive computer", false],
      ["Underwater camera", false],
      ["Reef-safe sunscreen", true],
      ["Dry bag", true],
    ];
  } else if (t.includes("safari")) {
    gearItems = [
      ["Binoculars (8x42)", true],
      ["Telephoto camera lens", false],
      ["Neutral-color clothing", true],
      ["Wide-brim hat", true],
      ["Insect repellent", true],
      ["Field notebook", false],
    ];
  } else if (t.includes("climb")) {
    gearItems = [
      ["Climbing harness", true],
      ["Helmet", true],
      ["Climbing shoes", true],
      ["Belay device", true],
      ["Chalk bag", false],
      ["Quickdraws set", false],
    ];
  } else if (t.includes("desert") || t.includes("dune")) {
    gearItems = [
      ["Shemagh / scarf", true],
      ["Polarized sunglasses", true],
      ["Sand-proof gaiters", false],
      ["Insulated water bottles (3L)", true],
      ["Lip balm SPF", true],
    ];
  } else if (t.includes("kayak") || t.includes("raft") || t.includes("sail")) {
    gearItems = [
      ["PFD life vest", true],
      ["Dry bag", true],
      ["Quick-dry towel", false],
      ["Water shoes", true],
      ["Waterproof phone case", true],
    ];
  } else if (t.includes("cycl") || t.includes("bike")) {
    gearItems = [
      ["Helmet", true],
      ["Padded cycling shorts", true],
      ["Repair kit + spare tube", true],
      ["Cycling gloves", false],
      ["Front + rear lights", true],
    ];
  } else {
    gearItems = [
      ["Multi-tool", false],
      ["Waterproof phone pouch", true],
      ["Quick-dry towel", false],
      ["Reusable water bottle", true],
    ];
  }
  const gear = mk("Gear", gearItems);

  const safety = mk("Safety & Health", [
    ["First-aid kit", true],
    ["Personal medications", true],
    ["Sunscreen SPF 50+", true],
    ["Insect repellent", true],
    ["Power bank", true],
    ["Whistle", false],
    ["Emergency blanket", false],
  ]);

  return {
    activityId: activity.id,
    activityName: activity.name,
    categories: [documents, clothing, gear, safety],
  };
}
