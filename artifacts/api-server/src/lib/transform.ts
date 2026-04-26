import type { Activity, Country } from "@workspace/db";

export function activityToSummary(activity: Activity, country: Country) {
  return {
    id: activity.id,
    name: activity.name,
    type: activity.type,
    countryCode: country.code,
    countryName: country.name,
    countryFlag: country.flag,
    city: activity.city,
    difficulty: activity.difficulty,
    durationDays: activity.durationDays,
    estimatedCost: activity.estimatedCost,
    rating: activity.rating,
    reviewCount: activity.reviewCount,
    heroImage: activity.heroImage,
    shortDescription: activity.shortDescription,
    weather: activity.weather,
  };
}

export function activityToDetail(
  activity: Activity,
  country: Country,
  isFavorited: boolean,
) {
  return {
    ...activityToSummary(activity, country),
    gallery: activity.gallery,
    description: activity.description,
    bestTimeToVisit: activity.bestTimeToVisit,
    latitude: activity.latitude,
    longitude: activity.longitude,
    requiredGear: activity.requiredGear,
    highlights: activity.highlights,
    isFavorited,
  };
}
