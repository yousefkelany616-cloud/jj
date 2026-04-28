# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **wanderlust** (`/`) — Adventure travel discovery app focused on the Arab world. React + Vite + Tailwind, Express API, Postgres + Drizzle, react-leaflet maps, framer-motion animations, dark mode. Home page sections (top → bottom): Hero + search, Featured Adventures, Trending Destinations, Choose Your Adventure (5 type tiles → /discover?type=…), Why Egypt (4-stat strip), Plan Your Trip (3 essentials cards), Track Your Journey CTA. The Discover page reads optional `search` and `type` URL params on first load (type allowlist: Hiking/Diving/Snorkeling/Camping/Safari, case-sensitive to match DB values).
- **api-server** — Express API powering Wanderlust. Endpoints: auth, countries, activities (with filters), trips (browser-geolocation tracker), reviews, favorites, packing lists, dashboard summary + trending.
- **mockup-sandbox** — Canvas component preview server.

## Database

PostgreSQL (Drizzle). Tables: `users`, `countries`, `activities`, `trips`, `reviews`, `favorites`, `app_metadata` (seed marker). Seeded with **Egypt only** (1 country, 8 adventure activities).

### Seeding

Seed data lives in `lib/db/src/seed-egypt.ts` and is shared between the CLI script and the API server.

- **Auto-seed on startup**: `artifacts/api-server/src/index.ts` calls `seedEgyptIfNeeded()` before listening. It uses a Postgres advisory lock (safe under autoscale concurrency), checks the `app_metadata.seed_egypt_version` marker, and only runs TRUNCATE+reseed if the marker is missing or outdated. Once stamped, subsequent restarts skip — user data (favorites/reviews/trips) is never wiped on routine restarts.
- **Manual reseed (force)**: `pnpm --filter @workspace/scripts run seed` runs `seedEgypt({ force: true })` which always wipes and reseeds.
- **To roll out a new seed version** (e.g. add an activity), bump `SEED_VERSION` in `lib/db/src/seed-egypt.ts` so the marker mismatches and the next deploy auto-applies the change.
- **Image policy**: every URL in the `IMAGES` map of `seed-egypt.ts` must be a verified location-specific Egyptian photo (no generic stock or other-country imagery). Each URL is GET-checked to return 200 + `image/*` from a hot-link-friendly host. The activity detail page hero (`activity-detail.tsx`) renders `activity.heroImage` — never a hardcoded URL — so the per-activity seed values determine what users see.
- **Gallery convention**: in each `IMAGES[key]` array, index `0` is the hero and indices `1..N` are the gallery (3–5 unique photos per activity). The `gallery()` helper returns `slice(1)` so the hero is never duplicated as a thumbnail on the detail page.
- **List-endpoint exposes gallery**: the `Activity` schema (used by `/api/activities`, `/api/activities/featured`, `/api/activities/recommended`, etc.) now returns the `gallery` array as well as `heroImage`. The home/discover `ActivityCard` uses both to render an auto-playing image carousel: slides = unique `[heroImage, ...gallery]`, advanced every 3s with an opacity fade, and paused via `IntersectionObserver` when the card is off-screen. Single-image activities render a static `<img>`. Component: `artifacts/wanderlust/src/components/ui/activity-card.tsx`.

## Localization (EN/AR)

Language state lives in `artifacts/wanderlust/src/lib/i18n.tsx` (`useI18n()` / `useT()`), persisted to `localStorage` key `wl_lang`; AR also flips `<html dir="rtl">`.

Server APIs return English content. The client translates at render time via per-domain maps:

- `lib/activity-translations.ts` — Arabic copy for the 8 seeded activities (name/city/description/highlights/etc.). Helpers: `localizeActivity()` (full object), `localizeActivityName()` (just the name).
- `lib/packing-translations.ts` — Arabic strings keyed by the exact English category names (`Documents` / `Clothing` / `Gear` / `Safety & Health`) and item names produced by `artifacts/api-server/src/lib/packing.ts`. Helpers: `localizePackingCategory()`, `localizePackingItem()`. Both fall back to the original string when a key is missing, so newly added server strings never crash the page.

`packing-list.tsx` localizes display only — `item.id` is unchanged across language toggles, so checkbox state in `localStorage` (`packing-<activityId>`) is preserved when switching EN ↔ AR.

## Auth

Demo passwordless: POST `/api/auth/login` with `{email, name}` sets an httpOnly `wl_session` cookie containing the user id. CORS configured with credentials between web (port 21455) and api-server (port 8080).

## Scripts

- `pnpm --filter @workspace/scripts run seed` — Reseed the database.
