/**
 * Applies db/001_init.sql to whatever DATABASE_URL points at.
 *
 * This exists so setting the database up needs no psql install — it uses the
 * same driver the application already depends on. Safe to run more than once:
 * every statement in the migration is `if not exists`.
 *
 *   npm run db:setup
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_URL;

if (!url) {
  console.error(
    "No DATABASE_URL.\n" +
      "Put your Neon connection string in .env.local, or run:\n" +
      "  vercel env pull .env.local",
  );
  process.exit(1);
}

const file = readFileSync(new URL("../db/001_init.sql", import.meta.url), "utf8");

// The HTTP driver takes one statement per call, so the migration is split.
// Comments go first: they are the only place a stray semicolon could hide.
const statements = file
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(url);
let applied = 0;

for (const statement of statements) {
  try {
    await sql.query(statement);
    applied++;
  } catch (error) {
    console.error(`\nFailed on:\n${statement.slice(0, 120)}…\n\n${error.message}`);
    process.exit(1);
  }
}

const [{ n }] = await sql`
  select count(*)::int as n from information_schema.tables
  where table_schema = 'public'
    and table_name in ('orders','order_items','event_quotes')
`;

console.log(`Applied ${applied} statements. ${n}/3 tables present.`);
if (n < 3) process.exit(1);
