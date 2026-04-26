import {
  pgTable,
  text,
  integer,
  doublePrecision,
  uuid,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const tripsTable = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  activityId: uuid("activity_id"),
  countryCode: text("country_code"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }).notNull(),
  distanceKm: doublePrecision("distance_km").notNull(),
  durationSec: integer("duration_sec").notNull(),
  avgSpeedKmh: doublePrecision("avg_speed_kmh").notNull(),
  notes: text("notes"),
  path: jsonb("path").notNull().$type<{ lat: number; lng: number; timestamp: number }[]>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Trip = typeof tripsTable.$inferSelect;
