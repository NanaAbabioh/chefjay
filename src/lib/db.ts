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

let cached: Sql | null | undefined;

export function db(): Sql | null {
  if (cached !== undefined) return cached;
  const url = process.env.DATABASE_URL;
  cached = url ? neon(url) : null;
  return cached;
}

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
