import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, tripsTable, activitiesTable } from "@workspace/db";
import {
  CreateTripBody,
  CreateTripResponse,
  DeleteTripParams,
  GetTripParams,
  GetTripResponse,
  ListTripsResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.use("/trips", requireAuth);

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

router.get("/trips", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const rows = await db
    .select({
      trip: tripsTable,
      activityName: activitiesTable.name,
    })
    .from(tripsTable)
    .leftJoin(activitiesTable, eq(tripsTable.activityId, activitiesTable.id))
    .where(eq(tripsTable.userId, userId))
    .orderBy(desc(tripsTable.startedAt));
  const out = rows.map((r) => serializeTrip(r.trip, r.activityName));
  res.json(ListTripsResponse.parse(out));
});

router.post("/trips", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const parsed = CreateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const [trip] = await db
    .insert(tripsTable)
    .values({
      userId,
      title: data.title,
      activityId: data.activityId ?? null,
      countryCode: data.countryCode ?? null,
      startedAt: new Date(data.startedAt),
      endedAt: new Date(data.endedAt),
      distanceKm: data.distanceKm,
      durationSec: data.durationSec,
      avgSpeedKmh: data.avgSpeedKmh,
      notes: data.notes ?? null,
      path: data.path,
    })
    .returning();

  let activityName: string | null = null;
  if (trip.activityId) {
    const [a] = await db
      .select({ name: activitiesTable.name })
      .from(activitiesTable)
      .where(eq(activitiesTable.id, trip.activityId));
    activityName = a?.name ?? null;
  }
  res.json(CreateTripResponse.parse(serializeTrip(trip, activityName)));
});

router.get("/trips/:id", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const params = GetTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select({ trip: tripsTable, activityName: activitiesTable.name })
    .from(tripsTable)
    .leftJoin(activitiesTable, eq(tripsTable.activityId, activitiesTable.id))
    .where(and(eq(tripsTable.id, params.data.id), eq(tripsTable.userId, userId)));
  if (!row) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  res.json(GetTripResponse.parse(serializeTrip(row.trip, row.activityName)));
});

router.delete("/trips/:id", async (req, res): Promise<void> => {
  const userId = (req as typeof req & { userId: string }).userId;
  const params = DeleteTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const result = await db
    .delete(tripsTable)
    .where(and(eq(tripsTable.id, params.data.id), eq(tripsTable.userId, userId)))
    .returning();
  if (result.length === 0) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
