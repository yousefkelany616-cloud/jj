import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, activitiesTable } from "@workspace/db";
import {
  GetPackingListParams,
  GetPackingListResponse,
} from "@workspace/api-zod";
import { generatePackingList } from "../lib/packing";

const router: IRouter = Router();

router.get("/packing/:activityId", async (req, res): Promise<void> => {
  const params = GetPackingListParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [activity] = await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.id, params.data.activityId));
  if (!activity) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }
  const list = generatePackingList(activity);
  res.json(GetPackingListResponse.parse(list));
});

export default router;
