import { Router, type IRouter } from "express";
import { eq, sql, desc, or, inArray } from "drizzle-orm";
import {
  db,
  tripsTable,
  activitiesTable,
  countriesTable,
  favoritesTable,
} from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetTrendingDestinationsResponse,
} from "@workspace/api-zod";
import { activityToSummary } from "../lib/transform";
import { getUserId } from "../lib/auth";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const userId = getUserId(req);

  let totalAdventures = 0;
  let totalDistanceKm = 0;
  let countriesVisited = 0;
  let favoritesCount = 0;
  let recentTrips: ReturnType<typeof serializeTrip>[] = [];
  let favoriteCountries: string[] = [];
  let favoriteTypes: string[] = [];

  if (userId) {
    const [stats] = await db
      .select({
        cnt: sql<number>`cast(count(*) as int)`,
        dist: sql<number>`coalesce(sum(${tripsTable.distanceKm}), 0)`,
      })
      .from(tripsTable)
      .where(eq(tripsTable.userId, userId));
    totalAdventures = stats?.cnt ?? 0;
    totalDistanceKm = Number(stats?.dist ?? 0);

    const distinct = await db
      .selectDistinct({ code: tripsTable.countryCode })
      .from(tripsTable)
      .where(eq(tripsTable.userId, userId));
    countriesVisited = distinct.filter((c) => !!c.code).length;

    const [favStat] = await db
      .select({ cnt: sql<number>`cast(count(*) as int)` })
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    favoritesCount = favStat?.cnt ?? 0;

    const tripRows = await db
      .select({ trip: tripsTable, name: activitiesTable.name })
      .from(tripsTable)
      .leftJoin(
        activitiesTable,
        eq(tripsTable.activityId, activitiesTable.id),
      )
      .where(eq(tripsTable.userId, userId))
      .orderBy(desc(tripsTable.startedAt))
      .limit(3);
    recentTrips = tripRows.map((r) => serializeTrip(r.trip, r.name));

    const favs = await db
      .select({
        countryCode: activitiesTable.countryCode,
        type: activitiesTable.type,
      })
      .from(favoritesTable)
      .innerJoin(
        activitiesTable,
        eq(favoritesTable.activityId, activitiesTable.id),
      )
      .where(eq(favoritesTable.userId, userId));
    favoriteCountries = [...new Set(favs.map((f) => f.countryCode))];
    favoriteTypes = [...new Set(favs.map((f) => f.type))];
  }

  // Recommended
  const recWhere =
    favoriteCountries.length || favoriteTypes.length
      ? or(
          favoriteCountries.length
            ? inArray(activitiesTable.countryCode, favoriteCountries)
            : undefined,
          favoriteTypes.length
            ? inArray(activitiesTable.type, favoriteTypes)
            : undefined,
        )
      : undefined;
  const recommended = await db
    .select({ activity: activitiesTable, country: countriesTable })
    .from(activitiesTable)
    .innerJoin(
      countriesTable,
      eq(activitiesTable.countryCode, countriesTable.code),
    )
    .where(recWhere)
    .orderBy(desc(activitiesTable.rating))
    .limit(6);

  res.json(
    GetDashboardSummaryResponse.parse({
      totalAdventures,
      totalDistanceKm,
      countriesVisited,
      favoritesCount,
      recentTrips,
      recommended: recommended.map((r) => activityToSummary(r.activity, r.country)),
    }),
  );
});

router.get("/dashboard/trending", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      countryCode: countriesTable.code,
      countryName: countriesTable.name,
      flag: countriesTable.flag,
      heroImage: countriesTable.heroImage,
      activityCount: sql<number>`cast(count(${activitiesTable.id}) as int)`,
      avgRating: sql<number>`coalesce(avg(${activitiesTable.rating}), 0)`,
    })
    .from(countriesTable)
    .leftJoin(
      activitiesTable,
      eq(activitiesTable.countryCode, countriesTable.code),
    )
    .groupBy(countriesTable.code)
    .orderBy(desc(sql`count(${activitiesTable.id})`), desc(sql`avg(${activitiesTable.rating})`))
    .limit(8);

  const out = rows.map((r) => ({
    countryCode: r.countryCode,
    countryName: r.countryName,
    flag: r.flag,
    heroImage: r.heroImage,
    activityCount: r.activityCount,
    avgRating: Number(r.avgRating ?? 0),
  }));
  res.json(GetTrendingDestinationsResponse.parse(out));
});

function serializeTrip(
  trip: typeof tripsTable.$inferSelect,
  activityName: string | null,
) {
  return {
    id: trip.id,
    title: trip.title,
    activityId: trip.activityId,
    activityName,
    countryCode: trip.countryCode,
    startedAt: trip.startedAt.toISOString(),
    endedAt: trip.endedAt.toISOString(),
    distanceKm: trip.distanceKm,
    durationSec: trip.durationSec,
    avgSpeedKmh: trip.avgSpeedKmh,
    notes: trip.notes,
    path: trip.path,
  };
}

export default router;
