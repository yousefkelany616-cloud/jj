# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **wanderlust** (`/`) — Adventure travel discovery app focused on the Arab world. React + Vite + Tailwind, Express API, Postgres + Drizzle, react-leaflet maps, framer-motion animations, dark mode.
- **api-server** — Express API powering Wanderlust. Endpoints: auth, countries, activities (with filters), trips (browser-geolocation tracker), reviews, favorites, packing lists, dashboard summary + trending.
- **mockup-sandbox** — Canvas component preview server.

## Database

PostgreSQL (Drizzle). Tables: `users`, `countries`, `activities`, `trips`, `reviews`, `favorites`, `app_metadata` (seed marker). Seeded with **Egypt only** (1 country, 8 adventure activities).

### Seeding

Seed data lives in `lib/db/src/seed-egypt.ts` and is shared between the CLI script and the API server.

- **Auto-seed on startup**: `artifacts/api-server/src/index.ts` calls `seedEgyptIfNeeded()` before listening. It uses a Postgres advisory lock (safe under autoscale concurrency), checks the `app_metadata.seed_egypt_version` marker, and only runs TRUNCATE+reseed if the marker is missing or outdated. Once stamped, subsequent restarts skip — user data (favorites/reviews/trips) is never wiped on routine restarts.
- **Manual reseed (force)**: `pnpm --filter @workspace/scripts run seed` runs `seedEgypt({ force: true })` which always wipes and reseeds.
- **To roll out a new seed version** (e.g. add an activity), bump `SEED_VERSION` in `lib/db/src/seed-egypt.ts` so the marker mismatches and the next deploy auto-applies the change.

## Auth

Demo passwordless: POST `/api/auth/login` with `{email, name}` sets an httpOnly `wl_session` cookie containing the user id. CORS configured with credentials between web (port 21455) and api-server (port 8080).

## Scripts

- `pnpm --filter @workspace/scripts run seed` — Reseed the database.
