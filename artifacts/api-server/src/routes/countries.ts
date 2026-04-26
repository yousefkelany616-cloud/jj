import { Router, type IRouter } from "express";
import { eq, sql, asc } from "drizzle-orm";
import { db, countriesTable, activitiesTable } from "@workspace/db";
import {
  GetCountryParams,
  GetCountryResponse,
  ListCountriesResponse,
} from "@workspace/api-zod";
import { activityToSummary } from "../lib/transform";

const router: IRouter = Router();

router.get("/countries", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      code: countriesTable.code,
      name: countriesTable.name,
      flag: countriesTable.flag,
      region: countriesTable.region,
      heroImage: countriesTable.heroImage,
      sortOrder: countriesTable.sortOrder,
      activityCount: sql<number>`cast(coalesce((select count(*) from ${activitiesTable} where ${activitiesTable.countryCode} = ${countriesTable.code}), 0) as int)`,
    })
    .from(countriesTable)
    .orderBy(asc(countriesTable.sortOrder), asc(countriesTable.name));

  const out = rows.map((r) => ({
    code: r.code,
    name: r.name,
    flag: r.flag,
    region: r.region,
    heroImage: r.heroImage,
    activityCount: r.activityCount,
  }));
  res.json(ListCountriesResponse.parse(out));
});

router.get("/countries/:code", async (req, res): Promise<void> => {
  const params = GetCountryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const code = params.data.code.toUpperCase();
  const [country] = await db
    .select()
    .from(countriesTable)
    .where(eq(countriesTable.code, code));
  if (!country) {
    res.status(404).json({ error: "Country not found" });
    return;
  }
  const acts = await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.countryCode, code));

  const payload = {
    code: country.code,
    name: country.name,
    flag: country.flag,
    region: country.region,
    description: country.description,
    heroImage: country.heroImage,
    currency: country.currency,
    bestSeason: country.bestSeason,
    emergency: country.emergency,
    activities: acts.map((a) => activityToSummary(a, country)),
  };
  res.json(GetCountryResponse.parse(payload));
});

export default router;
