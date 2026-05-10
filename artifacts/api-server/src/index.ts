import app from "./app";
import { logger } from "./lib/logger";
import { seedEgyptIfNeeded } from "@workspace/db/seed-egypt";

// Initialize database on startup
seedEgyptIfNeeded().catch((err) => {
  logger.error({ err }, "Error seeding database");
});

// Export app for Vercel
export default app;

// Local development: listen on PORT if provided
const rawPort = process.env["PORT"];

if (rawPort) {
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    logger.error({ port: rawPort }, "Invalid PORT value");
  } else {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  }
}
