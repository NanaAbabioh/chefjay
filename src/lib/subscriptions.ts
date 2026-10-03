/**
 * Monthly subscriptions, running alongside the grand opening.
 *
 * Three price bands rather than eight, because what a subscriber picks is a
 * rhythm, not a shopping list. The bands follow the shelf price exactly —
 * Less Sweet sits with the Classic at $4.99, Tiger nut stands alone at $6.99,
 * and the five $5.99 flavours share the third. A band that spanned two shelf
 * prices would quietly overcharge one set of subscribers and undercharge the
 * other.
 *
 * Money is integer cents here as everywhere else. Per-bottle figures are
 * derived, never typed in, so they cannot drift from the price.
 */
import { money } from "./format";

export type PlanId = "weekly4" | "weekly2" | "fortnightly4" | "fortnightly2";

export type Plan = {
  id: PlanId;
  name: string;
  /** Bottles per delivery. */
  each: number;
  /** Deliveries in a month. */
  drops: number;
  /** How it reads on the card, under the name. */
  rhythm: string;
};

/** The four rhythms, same for every band. */
export const plans: Plan[] = [
  {
    id: "weekly4",
    name: "The Standing Four",
    each: 4,
    drops: 4,
    rhythm: "Four bottles, every week",
  },
  {
    id: "weekly2",
    name: "The Standing Pair",
    each: 2,
    drops: 4,
    rhythm: "Two bottles, every week",
  },
  {
    id: "fortnightly4",
    name: "The Fortnightly Four",
    each: 4,
    drops: 2,
    rhythm: "Four bottles, twice a month",
  },
  {
    id: "fortnightly2",
    name: "The Fortnightly Pair",
    each: 2,
    drops: 2,
    rhythm: "Two bottles, twice a month",
  },
];

export type Band = {
  id: string;
  /** What the chooser calls it. */
  name: string;
  /** The flavours it covers, for the line under the chooser. */
  covers: string;
  /** Shelf price per bottle, used to show what the plan saves. */
  shelfCents: number;
  prices: Record<PlanId, number>;
};

export const bands: Band[] = [
  {
    id: "classic",
    name: "Classic",
    covers: "Classic and Classic Less Sweet",
    shelfCents: 499,
    prices: { weekly4: 6500, weekly2: 3500, fortnightly4: 3200, fortnightly2: 1800 },
  },
  {
    id: "flavours",
    name: "The flavours",
    covers: "Mango, peach, passion fruit, strawberry and raspberry",
    shelfCents: 599,
    prices: { weekly4: 7200, weekly2: 4000, fortnightly4: 3800, fortnightly2: 2200 },
  },
  {
    id: "tigernut",
    name: "Tiger nut",
    covers: "Tiger nut only",
    shelfCents: 699,
    prices: { weekly4: 9500, weekly2: 5500, fortnightly4: 5000, fortnightly2: 2700 },
  },
];

export const bottlesIn = (plan: Plan) => plan.each * plan.drops;

/** Per-bottle price in cents, rounded to the nearest cent for display. */
export const perBottleCents = (band: Band, plan: Plan) =>
  Math.round(band.prices[plan.id] / bottlesIn(plan));

/**
 * Whole percent saved against buying the same bottles in the shop, or null
 * when the saving is under a percent. Shown only where it is real: a "save 2%"
 * badge invites the arithmetic that disproves it.
 */
export function savingPercent(band: Band, plan: Plan): number | null {
  const shelf = band.shelfCents * bottlesIn(plan);
  const saved = Math.round(((shelf - band.prices[plan.id]) / shelf) * 100);
  return saved >= 5 ? saved : null;
}

export const getBand = (id: string) => bands.find((b) => b.id === id) ?? bands[0];
export const getPlan = (id: string) => plans.find((p) => p.id === id) ?? plans[0];

/** The line that goes to Chef Jay, so a subscription arrives already specified. */
export function subscriptionSummary(band: Band, plan: Plan, flavours: string): string {
  return [
    `${plan.name} — ${band.name}`,
    `${plan.rhythm}, ${bottlesIn(plan)} bottles a month`,
    `${money(band.prices[plan.id])} a month (${money(perBottleCents(band, plan))} a bottle)`,
    flavours ? `Flavours: ${flavours}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
