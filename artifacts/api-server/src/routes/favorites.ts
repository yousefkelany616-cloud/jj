import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import {
  db,
  favoritesTable,
  activitiesTable,
  countriesTable,
} from "@workspace/db";
import {
  AddFavoriteParams,
  ListFavoritesResponse,
  RemoveFavoriteParams,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";
import { activityToSummary } from "../lib/transform";

const router: IRouter = Router();

router.use("/favorites", requireAuth);

router.get("/favorites", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const rows = await db
    .select({ activity: activitiesTable, country: countriesTable })
    .from(favoritesTable)
    .innerJoin(activitiesTable, eq(favoritesTable.activityId, activitiesTable.id))
    .innerJoin(
      countriesTable,
      eq(activitiesTable.countryCode, countriesTable.code),
    )
    .where(eq(favoritesTable.userId, userId));
  const out = rows.map((r) => activityToSummary(r.activity, r.country));
  res.json(ListFavoritesResponse.parse(out));
});

router.post("/favorites/:activityId", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const params = AddFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .insert(favoritesTable)
    .values({ userId, activityId: params.data.activityId })
    .onConflictDoNothing();
  res.sendStatus(204);
});

router.delete("/favorites/:activityId", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const params = RemoveFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .delete(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId),
        eq(favoritesTable.activityId, params.data.activityId),
      ),
    );
  res.sendStatus(204);
});

export default router;
