import { neon } from "@neondatabase/serverless";

/**
 * The one place a database connection is made.
 *
 * `DATABASE_URL` is optional on purpose. Without it every call here returns
 * null and the site behaves exactly as it did before there was a database:
 * orders still validate, still hand off to WhatsApp, still reach the server
 * log and your inbox. The admin dashboard is the only thing that needs a
 * database, and it says so plainly when there isn't one.
 *
 * That also means a local checkout runs with no setup at all.
 */
export type Sql = ReturnType<typeof neon>;

/**
 * `DATABASE_URL` is what this project documents, but Vercel's Postgres
 * integrations inject their own names when you connect a database through the
 * marketplace. Accepting the usual aliases means connecting one does not
 * silently do nothing.
 */
const connectionString = () =>
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  "";

let cached: Sql | null | undefined;

export function db(): Sql | null {
  if (cached !== undefined) return cached;
  const url = connectionString();
  cached = url ? neon(url) : null;
  return cached;
}

export const hasDatabase = () => Boolean(connectionString());
