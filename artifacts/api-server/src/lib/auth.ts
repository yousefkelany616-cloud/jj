import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "wl_session";

const cookieOptions = (maxAgeMs: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
  maxAge: maxAgeMs,
});

export function setSessionCookie(res: Response, userId: string): void {
  res.cookie(COOKIE_NAME, userId, cookieOptions(60 * 60 * 24 * 30 * 1000));
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function getUserId(req: Request): string | null {
  const cookies = (req as Request & { cookies?: Record<string, string> })
    .cookies;
  const id = cookies?.[COOKIE_NAME];
  return typeof id === "string" && id.length > 0 ? id : null;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = getUserId(req);
  if (!id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { userId: string }).userId = id;
  next();
}
