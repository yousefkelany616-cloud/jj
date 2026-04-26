import {
  pgTable,
  text,
  integer,
  doublePrecision,
  uuid,
} from "drizzle-orm/pg-core";

export const activitiesTable = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  countryCode: text("country_code").notNull(),
  city: text("city").notNull(),
  difficulty: text("difficulty").notNull(),
  durationDays: integer("duration_days").notNull(),
  estimatedCost: doublePrecision("estimated_cost").notNull(),
  rating: doublePrecision("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  heroImage: text("hero_image").notNull(),
  gallery: text("gallery").array().notNull().default([]),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  bestTimeToVisit: text("best_time_to_visit").notNull(),
  weather: text("weather").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  requiredGear: text("required_gear").array().notNull().default([]),
  highlights: text("highlights").array().notNull().default([]),
  packingList: text("packing_list").notNull().default("[]"),
});

export type Activity = typeof activitiesTable.$inferSelect;
