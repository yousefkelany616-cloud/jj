import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { seedEgyptIfNeeded } from "@workspace/db/seed-egypt";

// Initialize database on first request
let dbInitialized = false;

if (!dbInitialized) {
  dbInitialized = true;
  seedEgyptIfNeeded().catch(console.error);
}

// Export as Vercel handler
export default (req: VercelRequest, res: VercelResponse) => {
  // Vercel will invoke this with req/res and we delegate to Express
  return app(req, res);
};
