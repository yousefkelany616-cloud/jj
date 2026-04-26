import { eq, sql } from "drizzle-orm";
import {
  db,
  tripsTable,
  favoritesTable,
  type User as DbUser,
} from "@workspace/db";

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export async function buildUserResponse(user: DbUser) {
  const [tripCountRow] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(tripsTable)
    .where(eq(tripsTable.userId, user.id));
  const [favCountRow] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(favoritesTable)
    .where(eq(favoritesTable.userId, user.id));
  const [distRow] = await db
    .select({
      total: sql<number>`coalesce(sum(${tripsTable.distanceKm}), 0)`,
    })
    .from(tripsTable)
    .where(eq(tripsTable.userId, user.id));

  const tripCount = tripCountRow?.count ?? 0;
  const favCount = favCountRow?.count ?? 0;
  const totalDistance = Number(distRow?.total ?? 0);

  const achievements: Achievement[] = [
    {
      id: "first-step",
      name: "First Step",
      description: "Save your first tracked trip.",
      icon: "Footprints",
      unlocked: tripCount >= 1,
    },
    {
      id: "explorer",
      name: "Explorer",
      description: "Complete 5 adventures.",
      icon: "Compass",
      unlocked: tripCount >= 5,
    },
    {
      id: "long-haul",
      name: "Long Haul",
      description: "Cover at least 50km in tracked trips.",
      icon: "Mountain",
      unlocked: totalDistance >= 50,
    },
    {
      id: "curator",
      name: "Curator",
      description: "Save 10 favorites.",
      icon: "Heart",
      unlocked: favCount >= 10,
    },
    {
      id: "globetrotter",
      name: "Globetrotter",
      description: "Adventure across 3 different countries.",
      icon: "Globe",
      unlocked: false,
    },
    {
      id: "reviewer",
      name: "Trail Voice",
      description: "Write your first review.",
      icon: "MessageSquare",
      unlocked: false,
    },
  ];

  // compute globetrotter
  const countriesVisited = await db
    .selectDistinct({ code: tripsTable.countryCode })
    .from(tripsTable)
    .where(eq(tripsTable.userId, user.id));
  const distinctCount = countriesVisited.filter((r) => !!r.code).length;
  achievements[4]!.unlocked = distinctCount >= 3;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    completedTripsCount: tripCount,
    favoritesCount: favCount,
    achievements,
  };
}
