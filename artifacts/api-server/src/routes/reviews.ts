import { Router, type IRouter } from "express";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db, reviewsTable, activitiesTable, usersTable } from "@workspace/db";
import {
  CreateReviewBody,
  CreateReviewParams,
  CreateReviewResponse,
  ListReviewsParams,
  ListReviewsQueryParams,
  ListReviewsResponse,
} from "@workspace/api-zod";
import { getUserId } from "../lib/auth";

const router: IRouter = Router();

function serialize(r: typeof reviewsTable.$inferSelect) {
  return {
    id: r.id,
    activityId: r.activityId,
    userName: r.userName,
    userAvatar: r.userAvatar,
    rating: r.rating,
    title: r.title,
    body: r.body,
    images: r.images,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/activities/:id/reviews", async (req, res): Promise<void> => {
  const params = ListReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const query = ListReviewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  let order;
  switch (query.data.sort) {
    case "top":
      order = desc(reviewsTable.rating);
      break;
    case "low":
      order = asc(reviewsTable.rating);
      break;
    default:
      order = desc(reviewsTable.createdAt);
  }
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.activityId, params.data.id))
    .orderBy(order);
  res.json(ListReviewsResponse.parse(rows.map(serialize)));
});

router.post("/activities/:id/reviews", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = CreateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [activity] = await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.id, params.data.id));
  if (!activity) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      activityId: params.data.id,
      userId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      rating: parsed.data.rating,
      title: parsed.data.title,
      body: parsed.data.body,
      images: parsed.data.images ?? [],
    })
    .returning();

  // Recompute aggregate
  const [agg] = await db
    .select({
      avg: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)`,
      cnt: sql<number>`cast(count(*) as int)`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.activityId, params.data.id));
  await db
    .update(activitiesTable)
    .set({
      rating: Number(agg?.avg ?? 0),
      reviewCount: agg?.cnt ?? 0,
    })
    .where(eq(activitiesTable.id, params.data.id));

  res.json(CreateReviewResponse.parse(serialize(review)));
});

void and;

export default router;
