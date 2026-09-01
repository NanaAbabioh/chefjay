import { products } from "./catalog";
import { hasDatabase } from "./db";
import { DELIVERY_FEE_CENTS, FREE_DELIVERY_CENTS } from "./cart";
import type { OrderRow, OrderStatus, QuoteRow, Summary } from "./reports";

/**
 * Sample data, so you can see the dashboard working before a single real
 * order exists.
 *
 * Two guards make it safe:
 *
 *   * It only runs when ADMIN_DEMO=1 is set explicitly.
 *   * It is ignored the moment a real database is connected. Fake takings must
 *     never be able to sit alongside, or on top of, real ones.
 *
 * The dashboard also says so in a banner the whole time it is on.
 */
export const demoMode = () => process.env.ADMIN_DEMO === "1" && !hasDatabase();

/**
 * A small deterministic generator. Sample data that reshuffled on every page
 * load would be unreadable — you could never point at a figure twice.
 */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const NAMES = [
  "Ama Boateng", "Daniel Osei", "Grace Mensah", "Kwame Asante", "Lin Zhao",
  "Marcus Rivera", "Efua Darko", "Sofia Almeida", "Yaw Antwi", "Rachel Kim",
  "Nana Adjei", "Priya Raman", "Tomás Herrera", "Abena Owusu", "Jordan Blake",
];
const ADDRESSES = [
  "18 Elmora Ave, Elizabeth, NJ", "402 Morris Ave, Elizabeth, NJ",
  "77 Broad St, Elizabeth, NJ", "9 Jefferson Ave, Elizabeth, NJ",
  "230 North Ave, Union, NJ", "51 Prospect St, Newark, NJ",
];
const WHENS = ["Today after 4pm", "Saturday morning", "Friday evening", "", "Sunday lunch"];
const NOTES = ["", "", "Less sweet please", "", "Leave it at the door", "Extra ice"];

const drinks = products.filter((p) => p.category === "drink");

/** Thirty days of plausible trade, newest first. */
function build(): OrderRow[] {
  const rand = seeded(20260823);
  const rows: OrderRow[] = [];
  const now = Date.now();
  let id = 1;

  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    // Busier at weekends, and today is only part-done.
    const weekday = new Date(now - daysAgo * 864e5).getDay();
    const busy = weekday === 5 || weekday === 6 ? 4 : 2;
    // Today gets a fuller spread on purpose: a demo whose Today tile reads
    // zero, with one unfinished order, shows the least interesting case.
    const count = daysAgo === 0 ? 6 : Math.floor(rand() * busy) + 1;

    for (let n = 0; n < count; n++) {
      const lineCount = rand() > 0.65 ? 2 : 1;
      const items = Array.from({ length: lineCount }, () => {
        const product = drinks[Math.floor(rand() * drinks.length)];
        const size = product.sizes[Math.floor(rand() * product.sizes.length)];
        const qty = rand() > 0.75 ? 2 : 1;
        return {
          name: product.name,
          volume: size.volume,
          qty,
          line_cents: size.priceCents * qty,
        };
      });

      const subtotal = items.reduce((sum, i) => sum + i.line_cents, 0);
      const method: "delivery" | "pickup" = rand() > 0.35 ? "delivery" : "pickup";
      const delivery =
        method === "pickup" || subtotal >= FREE_DELIVERY_CENTS ? 0 : DELIVERY_FEE_CENTS;

      // Everything older than today is settled; today's is still moving.
      let status: OrderStatus = "completed";
      if (daysAgo === 0) {
        // Fixed rather than random, so today always shows both takings and a
        // queue: three done, three still moving through the kitchen.
        status = (["completed", "completed", "completed", "new", "preparing", "ready"] as const)[n];
      } else if (rand() > 0.94) {
        status = "cancelled";
      }

      const at = new Date(now - daysAgo * 864e5 - Math.floor(rand() * 8) * 36e5);

      rows.push({
        id: id++,
        ref: `VC-${(100000 + id * 7919).toString(36).toUpperCase().slice(-5)}`,
        status,
        name: NAMES[Math.floor(rand() * NAMES.length)],
        phone: `973555${String(Math.floor(rand() * 9000) + 1000)}`,
        email: rand() > 0.5 ? "customer@example.com" : null,
        method,
        address: method === "delivery" ? ADDRESSES[Math.floor(rand() * ADDRESSES.length)] : null,
        preferred_time: WHENS[Math.floor(rand() * WHENS.length)] || null,
        notes: NOTES[Math.floor(rand() * NOTES.length)] || null,
        subtotal_cents: subtotal,
        delivery_cents: delivery,
        total_cents: subtotal + delivery,
        created_at: at.toISOString(),
        items,
      });
    }
  }
  return rows.reverse();
}

let cache: OrderRow[] | null = null;
const orders = () => (cache ??= build());

const isOpen = (o: OrderRow) =>
  o.status === "new" || o.status === "confirmed" || o.status === "preparing" || o.status === "ready";

const startOfDay = (daysBack: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysBack);
  return d.getTime();
};

export function demoOrders(status?: OrderStatus) {
  const all = orders();
  return status ? all.filter((o) => o.status === status) : all;
}

export function demoSummary(): Summary {
  const all = orders();
  const done = all.filter((o) => o.status === "completed");
  const since = (days: number, rows = done) =>
    rows.filter((o) => new Date(o.created_at).getTime() >= startOfDay(days));

  const today = since(0);
  const month = since(29);
  const open = all.filter(isOpen);
  const monthCents = month.reduce((n, o) => n + o.total_cents, 0);
  const deliveries = done.filter((o) => o.method === "delivery");

  return {
    todayCount: today.length,
    todayCents: today.reduce((n, o) => n + o.total_cents, 0),
    weekCents: since(6).reduce((n, o) => n + o.total_cents, 0),
    monthCents,
    monthOrders: month.length,
    averageCents: month.length ? Math.round(monthCents / month.length) : 0,
    openCount: open.length,
    openCents: open.reduce((n, o) => n + o.total_cents, 0),
    byStatus: all.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {}),
    deliveryFeesCents: done.reduce((n, o) => n + o.delivery_cents, 0),
    feesWaivedCents:
      deliveries.filter((o) => o.delivery_cents === 0).length * DELIVERY_FEE_CENTS,
    deliveryCount: deliveries.length,
    pickupCount: done.filter((o) => o.method === "pickup").length,
  };
}

export function demoDailyTakings(days = 14) {
  const done = orders().filter((o) => o.status === "completed");
  return Array.from({ length: days }, (_, i) => {
    const from = startOfDay(days - 1 - i);
    const on = done.filter((o) => {
      const t = new Date(o.created_at).getTime();
      return t >= from && t < from + 864e5;
    });
    return {
      day: new Date(from).toISOString().slice(0, 10),
      cents: on.reduce((n, o) => n + o.total_cents, 0),
      orders: on.length,
    };
  });
}

export function demoTopProducts() {
  const totals = new Map<string, { slug: string; name: string; units: number; cents: number }>();
  for (const o of orders()) {
    if (o.status !== "completed") continue;
    for (const i of o.items) {
      const slug = drinks.find((p) => p.name === i.name)?.slug ?? i.name;
      const row = totals.get(slug) ?? { slug, name: i.name, units: 0, cents: 0 };
      row.units += i.qty;
      row.cents += i.line_cents;
      totals.set(slug, row);
    }
  }
  return [...totals.values()].sort((a, b) => b.cents - a.cents);
}

const daysAgoIso = (n: number) => new Date(Date.now() - n * 864e5).toISOString();

export function demoQuotes(): QuoteRow[] {
  return [
    {
      id: 1, ref: "VC-QT4M2", status: "new", name: "Rachel Kim",
      phone: "9735550166", email: "rachel@example.com", package_id: "party",
      event_type: "Birthday", event_date: "the 14th", guests: "35",
      venue: "Backyard, Union NJ", flavors: ["Mango Sunrise", "Classic Piña Colada"],
      notes: "Would love a non-sweet option too.", quoted_cents: null,
      created_at: daysAgoIso(1),
    },
    {
      id: 2, ref: "VC-QT9K7", status: "quoted", name: "Marcus Rivera",
      phone: "9735550177", email: "marcus@example.com", package_id: "service",
      event_type: "Corporate launch", event_date: "Sept 12", guests: "120",
      venue: "Newark, indoor", flavors: ["Tigernut Piña Colada"], notes: null,
      quoted_cents: 84000, created_at: daysAgoIso(5),
    },
    {
      id: 3, ref: "VC-QT1B8", status: "won", name: "Abena Owusu",
      phone: "9735550155", email: "abena@example.com", package_id: "dozen",
      event_type: "Baby shower", event_date: "Aug 9", guests: "14",
      venue: null, flavors: ["Strawberry Piña Colada"], notes: null,
      quoted_cents: 7800, created_at: daysAgoIso(16),
    },
    {
      id: 4, ref: "VC-QT6R3", status: "lost", name: "Jordan Blake",
      phone: "9735550144", email: "jordan@example.com", package_id: "party",
      event_type: "Wedding", event_date: "Aug 2", guests: "80",
      venue: "Jersey City", flavors: [], notes: "Went with a bar service.",
      quoted_cents: 32000, created_at: daysAgoIso(24),
    },
  ];
}
