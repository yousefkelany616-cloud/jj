import { seedEgypt } from "@workspace/db/seed-egypt";

async function main() {
  const result = await seedEgypt({ force: true, closePool: true });
  console.log(
    `Seed complete: status=${result.status}${result.reason ? ` (${result.reason})` : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
