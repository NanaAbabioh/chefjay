import { db, type Sql } from "./db";
import { site } from "./site";
import type { ResolvedLine } from "./cart";
import type { EventQuote, RetailOrder } from "./order";

/**
 * Writes submissions to the database.
 *
 * Every function here returns a boolean rather than throwing. A failed write
 * must never cost a customer their order — the same rule the email notifier
 * follows. If this returns false the order still completes, and the server log
 * and your inbox still hold a full copy.
 */

async function attempt(work: (sql: Sql) => Promise<unknown>, label: string) {
  const sql = db();
  if (!sql) return false;
  try {
    await work(sql);
    return true;
  } catch (error) {
    console.error(`[store] ${label} failed`, error);
    return false;
  }
}

export function saveOrder(
  ref: string,
  order: RetailOrder,
  lines: ResolvedLine[],
  totals: { subtotal: number; delivery: number; total: number },
) {
  return attempt(
    (sql) =>
      // One statement, so an order can never be stored without its items.
      // The line arrays are unnested into rows against the id the insert
      // above just returned.
      sql`
        with new_order as (
          insert into orders (
            ref, name, phone, email, method, address, preferred_time, notes,
            subtotal_cents, delivery_cents, total_cents
          )
          values (
            ${ref}, ${order.name}, ${order.phone}, ${order.email || null},
            ${order.method}, ${order.address || null}, ${order.when || null},
            ${order.notes || null},
            ${totals.subtotal}, ${totals.delivery}, ${totals.total}
          )
          returning id
        )
        insert into order_items (
          order_id, slug, size_id, name, volume, qty, unit_cents, line_cents
        )
        select
          new_order.id, t.slug, t.size_id, t.name, t.volume,
          t.qty, t.unit_cents, t.line_cents
        from new_order, unnest(
          ${lines.map((l) => l.slug)}::text[],
          ${lines.map((l) => l.sizeId)}::text[],
          ${lines.map((l) => l.name)}::text[],
          ${lines.map((l) => l.volume)}::text[],
          ${lines.map((l) => l.qty)}::int[],
          ${lines.map((l) => l.unitCents)}::int[],
          ${lines.map((l) => l.lineCents)}::int[]
        ) as t(slug, size_id, name, volume, qty, unit_cents, line_cents)
      `,
    `saving order ${ref}`,
  );
}

export function saveQuote(ref: string, quote: EventQuote) {
  return attempt(
    (sql) => sql`
      insert into event_quotes (
        ref, name, phone, email, package_id, event_type,
        event_date, guests, venue, flavors, notes
      )
      values (
        ${ref}, ${quote.name}, ${quote.phone}, ${quote.email},
        ${quote.packageId || null}, ${quote.eventType || null},
        ${quote.date || null}, ${quote.guests || null}, ${quote.venue || null},
        ${quote.flavors}::text[], ${quote.notes || null}
      )
    `,
    `saving quote ${ref}`,
  );
}

/** Business-local day boundaries. See `site.timeZone` for why. */
export const TZ = site.timeZone;
