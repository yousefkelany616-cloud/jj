import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const favoritesTable = pgTable(
  "favorites",
  {
    userId: uuid("user_id").notNull(),
    activityId: uuid("activity_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.activityId] })],
);

export type Favorite = typeof favoritesTable.$inferSelect;
