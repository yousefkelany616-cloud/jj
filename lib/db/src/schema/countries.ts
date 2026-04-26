import { pgTable, text, jsonb, integer } from "drizzle-orm/pg-core";

export const countriesTable = pgTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  flag: text("flag").notNull(),
  region: text("region").notNull(),
  description: text("description").notNull(),
  heroImage: text("hero_image").notNull(),
  currency: text("currency").notNull(),
  bestSeason: text("best_season").notNull(),
  emergency: jsonb("emergency").notNull().$type<{
    police: string;
    ambulance: string;
    fire: string;
    touristPolice?: string | null;
    embassyHotline?: string | null;
  }>(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Country = typeof countriesTable.$inferSelect;
