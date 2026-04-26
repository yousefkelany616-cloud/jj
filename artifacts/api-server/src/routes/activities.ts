import { Router, type IRouter } from "express";
import { eq, and, gte, lte, ilike, or, inArray, desc, sql } from "drizzle-orm";
import {
  db,
  activitiesTable,
  countriesTable,
  favoritesTable,
} from "@workspace/db";
import {
  GetActivityParams,
  GetActivityResponse,
  GetFeaturedActivitiesResponse,
  GetRecommendedActivitiesResponse,
  ListActivitiesQueryParams,
  ListActivitiesResponse,
} from "@workspace/api-zod";
import { activityToDetail, activityToSummary } from "../lib/transform";
import { getUserId } from "../lib/auth";

const router: IRouter = Router();

router.get("/activities/recommended", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  let favoriteCountries: string[] = [];
  let favoriteTypes: string[] = [];
  if (userId) {
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

  let rows;
  if (favoriteCountries.length || favoriteTypes.length) {
    rows = await db
      .select({ activity: activitiesTable, country: countriesTable })
      .from(activitiesTable)
      .innerJoin(
        countriesTable,
        eq(activitiesTable.countryCode, countriesTable.code),
      )
      .where(
        or(
          favoriteCountries.length
            ? inArray(activitiesTable.countryCode, favoriteCountries)
            : undefined,
          favoriteTypes.length
            ? inArray(activitiesTable.type, favoriteTypes)
            : undefined,
        ),
      )
      .orderBy(desc(activitiesTable.rating))
      .limit(8);
  } else {
    rows = await db
      .select({ activity: activitiesTable, country: countriesTable })
      .from(activitiesTable)
      .innerJoin(
        countriesTable,
        eq(activitiesTable.countryCode, countriesTable.code),
      )
      .orderBy(desc(activitiesTable.rating))
      .limit(8);
  }

  const out = rows.map((r) => activityToSummary(r.activity, r.country));
  res.json(GetRecommendedActivitiesResponse.parse(out));
});

router.get("/activities/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ activity: activitiesTable, country: countriesTable })
    .from(activitiesTable)
    .innerJoin(
      countriesTable,
      eq(activitiesTable.countryCode, countriesTable.code),
    )
    .orderBy(desc(activitiesTable.rating), desc(activitiesTable.reviewCount))
    .limit(6);
  const out = rows.map((r) => activityToSummary(r.activity, r.country));
  res.json(GetFeaturedActivitiesResponse.parse(out));
});

router.get("/activities", async (req, res): Promise<void> => {
  const parsed = ListActivitiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const q = parsed.data;
  const conditions = [] as ReturnType<typeof eq>[];
  if (q.search) {
    const term = `%${q.search}%`;
    const orClause = or(
      ilike(activitiesTable.name, term),
      ilike(activitiesTable.shortDescription, term),
      ilike(activitiesTable.city, term),
    );
    if (orClause) conditions.push(orClause);
  }
  if (q.country)
    conditions.push(eq(activitiesTable.countryCode, q.country.toUpperCase()));
  if (q.type) conditions.push(eq(activitiesTable.type, q.type));
  if (q.difficulty)
    conditions.push(eq(activitiesTable.difficulty, q.difficulty));
  if (q.minBudget !== undefined)
    conditions.push(gte(activitiesTable.estimatedCost, q.minBudget));
  if (q.maxBudget !== undefined)
    conditions.push(lte(activitiesTable.estimatedCost, q.maxBudget));
  if (q.maxDurationDays !== undefined)
    conditions.push(lte(activitiesTable.durationDays, q.maxDurationDays));
  if (q.weather) conditions.push(eq(activitiesTable.weather, q.weather));

  const rows = await db
    .select({ activity: activitiesTable, country: countriesTable })
    .from(activitiesTable)
    .innerJoin(
      countriesTable,
      eq(activitiesTable.countryCode, countriesTable.code),
    )
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(activitiesTable.rating));

  const out = rows.map((r) => activityToSummary(r.activity, r.country));
  res.json(ListActivitiesResponse.parse(out));
});

router.get("/activities/:id", async (req, res): Promise<void> => {
  const params = GetActivityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select({ activity: activitiesTable, country: countriesTable })
    .from(activitiesTable)
    .innerJoin(
      countriesTable,
      eq(activitiesTable.countryCode, countriesTable.code),
    )
    .where(eq(activitiesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }

  const userId = getUserId(req);
  let isFavorited = false;
  if (userId) {
    const [fav] = await db
      .select()
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.activityId, row.activity.id),
        ),
      );
    isFavorited = !!fav;
  }

  res.json(
    GetActivityResponse.parse(
      activityToDetail(row.activity, row.country, isFavorited),
    ),
  );
});

void sql;

export default router;
