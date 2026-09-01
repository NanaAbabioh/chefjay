import { db } from "./db";
import { site } from "./site";
import { DELIVERY_FEE_CENTS } from "./cart";
import {
  demoDailyTakings,
  demoMode,
  demoOrders,
  demoQuotes,
  demoSummary,
  demoTopProducts,
  demoWaitlist,
} from "./demo";

/**
 * Every read the dashboard makes.
 *
 * One rule runs through all of it: **revenue means completed orders only.**
 * Nothing is charged online, so a submitted order is an intention, not money.
 * Counting every submission as revenue would flatter the figures by exactly
 * the orders that never got confirmed. Anything still open is reported
 * separately as the pipeline, so you see both without confusing them.
 *
 * Days are business-local (`site.timeZone`), not UTC — an order taken at 8pm
 * on Friday belongs in Friday's takings. Every query below therefore does its
 * day arithmetic in that zone, passed as a bound parameter.
 */

const TZ = site.timeZone;

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type QuoteStatus = "new" | "quoted" | "won" | "lost";

/** Statuses that still want something from you. */
export const OPEN_STATUSES: OrderStatus[] = ["new", "confirmed", "preparing", "ready"];

/** The order a job moves through the kitchen. */
export const ORDER_FLOW: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "completed",
];

export type OrderItem = {
  name: string;
  volume: string;
  qty: number;
  line_cents: number;
};

export type OrderRow = {
  id: number;
  ref: string;
  status: OrderStatus;
  name: string;
  phone: string;
  email: string | null;
  method: "delivery" | "pickup";
  address: string | null;
  preferred_time: string | null;
  notes: string | null;
  subtotal_cents: number;
  delivery_cents: number;
  total_cents: number;
  created_at: string;
  items: OrderItem[];
};

export type Summary = {
  todayCount: number;
  todayCents: number;
  weekCents: number;
  monthCents: number;
  monthOrders: number;
  averageCents: number;
  openCount: number;
  openCents: number;
  byStatus: Record<string, number>;
  deliveryFeesCents: number;
  feesWaivedCents: number;
  deliveryCount: number;
  pickupCount: number;
};

export async function getSummary(): Promise<Summary | null> {
  const sql = db();
  if (!sql) return demoMode() ? demoSummary() : null;

  // A single round trip: every figure is a filtered aggregate over one scan
  // rather than half a dozen separate queries.
  const rows = (await sql`
    with bounds as (
      select
        date_trunc('day', now() at time zone ${TZ}) at time zone ${TZ} as today,
        (date_trunc('day', now() at time zone ${TZ}) - make_interval(days => 6))
          at time zone ${TZ} as week,
        (date_trunc('day', now() at time zone ${TZ}) - make_interval(days => 29))
          at time zone ${TZ} as month
    )
    select
      count(*) filter (where o.status = 'completed' and o.created_at >= b.today)::int
        as today_count,
      coalesce(sum(o.total_cents) filter
        (where o.status = 'completed' and o.created_at >= b.today), 0)::int as today_cents,
      coalesce(sum(o.total_cents) filter
        (where o.status = 'completed' and o.created_at >= b.week), 0)::int as week_cents,
      coalesce(sum(o.total_cents) filter
        (where o.status = 'completed' and o.created_at >= b.month), 0)::int as month_cents,
      count(*) filter (where o.status = 'completed' and o.created_at >= b.month)::int
        as month_orders,

      count(*) filter (where o.status in ('new','confirmed','preparing','ready'))::int
        as open_count,
      coalesce(sum(o.total_cents) filter
        (where o.status in ('new','confirmed','preparing','ready')), 0)::int as open_cents,

      -- Delivery economics: what you charged, and what you gave away by
      -- crossing the free-delivery threshold.
      coalesce(sum(o.delivery_cents) filter (where o.status = 'completed'), 0)::int
        as delivery_fees_cents,
      count(*) filter (where o.method = 'delivery' and o.status = 'completed')::int
        as delivery_count,
      count(*) filter (where o.method = 'pickup' and o.status = 'completed')::int
        as pickup_count,
      count(*) filter (where o.method = 'delivery' and o.status = 'completed'
                         and o.delivery_cents = 0)::int as waived_count
    from orders o cross join bounds b
  `) as Record<string, number>[];

  const statusRows = (await sql`
    select status, count(*)::int as n from orders group by status
  `) as unknown as { status: string; n: number }[];

  const r = rows[0];
  return {
    todayCount: r.today_count,
    todayCents: r.today_cents,
    weekCents: r.week_cents,
    monthCents: r.month_cents,
    monthOrders: r.month_orders,
    averageCents: r.month_orders ? Math.round(r.month_cents / r.month_orders) : 0,
    openCount: r.open_count,
    openCents: r.open_cents,
    byStatus: Object.fromEntries(statusRows.map((s) => [s.status, s.n])),
    deliveryFeesCents: r.delivery_fees_cents,
    // Each waived delivery is one flat fee you chose not to charge.
    feesWaivedCents: r.waived_count * DELIVERY_FEE_CENTS,
    deliveryCount: r.delivery_count,
    pickupCount: r.pickup_count,
  };
}

/** Takings per business-local day, oldest first, quiet days included as zero. */
export async function getDailyTakings(days = 14) {
  const sql = db();
  if (!sql) return demoMode() ? demoDailyTakings(days) : [];
  return (await sql`
    select
      to_char(d.day at time zone ${TZ}, 'YYYY-MM-DD') as day,
      coalesce(sum(o.total_cents), 0)::int as cents,
      count(o.id)::int as orders
    from generate_series(
      (date_trunc('day', now() at time zone ${TZ}) - make_interval(days => ${days - 1}))
        at time zone ${TZ},
      date_trunc('day', now() at time zone ${TZ}) at time zone ${TZ},
      interval '1 day'
    ) as d(day)
    left join orders o
      on o.status = 'completed'
     and o.created_at >= d.day
     and o.created_at <  d.day + interval '1 day'
    group by d.day
    order by d.day
  `) as unknown as { day: string; cents: number; orders: number }[];
}

/** What actually sells, by units and by money, over the last N days. */
export async function getTopProducts(days = 30) {
  const sql = db();
  if (!sql) return demoMode() ? demoTopProducts() : [];
  return (await sql`
    select i.slug, i.name,
           sum(i.qty)::int as units,
           sum(i.line_cents)::int as cents
    from order_items i
    join orders o on o.id = i.order_id
    where o.status = 'completed'
      and o.created_at >= (date_trunc('day', now() at time zone ${TZ})
                            - make_interval(days => ${days - 1})) at time zone ${TZ}
    group by i.slug, i.name
    order by cents desc
  `) as unknown as { slug: string; name: string; units: number; cents: number }[];
}

export async function getOrders(status?: OrderStatus, limit = 60) {
  const sql = db();
  if (!sql) return demoMode() ? demoOrders(status).slice(0, limit) : [];
  // Items are aggregated in the same query, so the list never fans out into
  // one query per order.
  const rows = status
    ? await sql`
        select o.*, coalesce(json_agg(
                 json_build_object('name', i.name, 'volume', i.volume,
                                   'qty', i.qty, 'line_cents', i.line_cents)
                 order by i.id
               ) filter (where i.id is not null), '[]'::json) as items
        from orders o
        left join order_items i on i.order_id = o.id
        where o.status = ${status}
        group by o.id
        order by o.created_at desc
        limit ${limit}
      `
    : await sql`
        select o.*, coalesce(json_agg(
                 json_build_object('name', i.name, 'volume', i.volume,
                                   'qty', i.qty, 'line_cents', i.line_cents)
                 order by i.id
               ) filter (where i.id is not null), '[]'::json) as items
        from orders o
        left join order_items i on i.order_id = o.id
        group by o.id
        order by o.created_at desc
        limit ${limit}
      `;
  return rows as unknown as OrderRow[];
}

export type QuoteRow = {
  id: number;
  ref: string;
  status: QuoteStatus;
  name: string;
  phone: string;
  email: string;
  package_id: string | null;
  event_type: string | null;
  event_date: string | null;
  guests: string | null;
  venue: string | null;
  flavors: string[];
  notes: string | null;
  quoted_cents: number | null;
  created_at: string;
};

export async function getQuotes(limit = 60) {
  const sql = db();
  if (!sql) return demoMode() ? demoQuotes().slice(0, limit) : [];
  return (await sql`
    select * from event_quotes order by created_at desc limit ${limit}
  `) as unknown as QuoteRow[];
}

export async function getWaitlist() {
  const sql = db();
  if (!sql) return demoMode() ? demoWaitlist() : { count: 0, recent: [] };
  const [counts, recent] = await Promise.all([
    sql`select count(*)::int as n from kitchen_signups`,
    sql`select email, created_at from kitchen_signups order by created_at desc limit 10`,
  ]);
  return {
    count: (counts as unknown as { n: number }[])[0]?.n ?? 0,
    recent: recent as unknown as { email: string; created_at: string }[],
  };
}
