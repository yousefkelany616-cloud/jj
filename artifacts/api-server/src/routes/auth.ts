import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, tripsTable, favoritesTable } from "@workspace/db";
import {
  GetSessionResponse,
  LoginBody,
  LoginResponse,
} from "@workspace/api-zod";
import {
  setSessionCookie,
  clearSessionCookie,
  getUserId,
} from "../lib/auth";
import { buildUserResponse } from "../lib/user";

const router: IRouter = Router();

router.get("/auth/session", async (req, res): Promise<void> => {
  const id = getUserId(req);
  if (!id) {
    res.json(GetSessionResponse.parse({ user: null }));
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) {
    clearSessionCookie(res);
    res.json(GetSessionResponse.parse({ user: null }));
    return;
  }
  const payload = await buildUserResponse(user);
  res.json(GetSessionResponse.parse({ user: payload }));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, name } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail));

  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({ email: normalizedEmail, name: name.trim() })
      .returning();
  }

  setSessionCookie(res, user.id);
  const payload = await buildUserResponse(user);
  res.json(LoginResponse.parse(payload));
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  clearSessionCookie(res);
  res.sendStatus(204);
});

// silence unused import warnings - tables are referenced via buildUserResponse
void tripsTable;
void favoritesTable;

export default router;
