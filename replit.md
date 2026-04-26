# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **wanderlust** (`/`) — Adventure travel discovery app focused on the Arab world. React + Vite + Tailwind, Express API, Postgres + Drizzle, react-leaflet maps, framer-motion animations, dark mode.
- **api-server** — Express API powering Wanderlust. Endpoints: auth, countries, activities (with filters), trips (browser-geolocation tracker), reviews, favorites, packing lists, dashboard summary + trending.
- **mockup-sandbox** — Canvas component preview server.

## Database

PostgreSQL (Drizzle). Tables: `users`, `countries`, `activities`, `trips`, `reviews`, `favorites`. Seeded with 22 Arab countries plus Nepal/Peru/Iceland.

## Auth

Demo passwordless: POST `/api/auth/login` with `{email, name}` sets an httpOnly `wl_session` cookie containing the user id. CORS configured with credentials between web (port 21455) and api-server (port 8080).

## Scripts

- `pnpm --filter @workspace/scripts run seed` — Reseed the database.
