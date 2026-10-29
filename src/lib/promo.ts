/**
 * The offer currently running, in one place.
 *
 * Everything that mentions the promotion — the bar above the header, the
 * stamp on the shop page, the home page band, the Kpataashie note, the
 * Thanksgiving page, the cart total and the WhatsApp handoff — reads from
 * here. Changing the dates or pulling the offer is one edit, and nothing is
 * left advertising a promotion that ended.
 *
 * One offer runs at a time. The grand opening that ran in October had exactly
 * this shape — a free nth bottle and a percentage off meals — so Thanksgiving
 * replaces its values rather than adding a second mechanism beside it. The
 * October figures are in the git history if they are ever wanted back.
 *
 * Dates are business-local (site.timeZone), inclusive of both ends. A customer
 * in another timezone sees the offer by Chef Jay's clock, which is the one the
 * kitchen keeps.
 */
import { site } from "./site";

export const promo = {
  /** First and last day the offer runs, inclusive, as YYYY-MM-DD.
   *
   * Live a day before the advertised start so the offer can be tested on the
   * real site in real conditions. `window` below is what customers are told,
   * and the two are deliberately allowed to differ: starting early only ever
   * honours the offer for someone who turns up sooner. Never the reverse —
   * ending before the advertised last day would refuse a customer the thing
   * the banner promised them. */
  startsOn: "2026-10-31",
  endsOn: "2026-11-14",

  /** Bottles: every nth bottle in the cart is free. 4 = buy three, get one. */
  bottlesPerFree: 4,
  /** Food, applied by hand when the order is confirmed. Covers Kpataashie
   *  pans and event quotes alike this time round. */
  mealDiscountPercent: 20,

  eyebrow: "Thanksgiving special",
  /** The scrolling bar above the header. It repeats, so it reads as one
   *  sentence rather than a headline. */
  bar: "Thanksgiving special — 20% off every food order, and buy 3 drinks and the 4th is on us. Orders close 14 November so the kitchen can cook",
  heading: "Need a pan or two? Chef Jay’s got you.",
  /** Said the same way everywhere a short version is needed. */
  short: "Buy 3 drinks, get the 4th free",
  /** Shown wherever the dates matter. Kept as prose: "1–14 November" reads
   *  better than a date range nobody parses. */
  window: "1 – 14 November",
  /** The same fortnight, short enough to set in caps on a chip. The window is
   *  the one fact on the page that is worthless the day after it matters, so
   *  it is repeated as a label rather than left inside a sentence. */
  windowShort: "Nov 1 – 14",

  /**
   * The hard close, written out.
   *
   * This is not a marketing deadline that quietly slips — the kitchen stops
   * taking orders on this day in order to cook the ones it has. Said in full
   * wherever there is room for it, because "order early" means nothing
   * without the date it is early against.
   */
  ordersClose: "Saturday 14 November",
  /** The day it is all for. */
  thanksgiving: "Thursday 26 November",

  /**
   * Where the offer is explained in full.
   *
   * The bar at the top of every page is already the loudest thing on the
   * site; pointing it at the page rather than adding a second shout beside
   * it is what keeps the header from competing with itself. An offer without
   * a page of its own can point this at /shop.
   */
  href: "/thanksgiving",
} as const;

/** Today where the business trades, as YYYY-MM-DD. */
function businessToday(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD, which compares correctly as a string.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: site.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function promoActive(now: Date = new Date()): boolean {
  const today = businessToday(now);
  return today >= promo.startsOn && today <= promo.endsOn;
}

/**
 * Where we are in the offer, for the page built around it.
 *
 * `promoActive` answers the only question the cart and the banner need — is
 * there a discount to apply right now. A page whose whole subject is the
 * offer has to say something in the other two cases as well, and "nothing at
 * all" is the wrong answer for both: someone who arrives from a flyer before
 * it opens should be told when to come back, and someone who arrives after it
 * closes should be told it closed rather than be sold a thing the kitchen can
 * no longer cook.
 */
export type Phase = "before" | "open" | "closed";

export function promoPhase(now: Date = new Date()): Phase {
  const today = businessToday(now);
  if (today < promo.startsOn) return "before";
  if (today > promo.endsOn) return "closed";
  return "open";
}

/** Whole days from today until `date` (YYYY-MM-DD), by the kitchen's clock.
 *
 * Both ends are taken as calendar days in the business timezone and compared
 * as dates, so the answer never depends on the hour: at 11pm on the 13th the
 * answer is still one day, which is what a customer means by "tomorrow".
 */
export function daysUntil(date: string, now: Date = new Date()): number {
  const day = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  return Math.round((day(date) - day(businessToday(now))) / 86_400_000);
}

/** The free-bottle line, as a positive number of cents to subtract.
 *
 * Mix and match is the point of the offer, so the discount is worked out
 * across the whole basket rather than per flavour: every unit is laid out,
 * sorted, and the cheapest one in each complete group of four comes off. Eight
 * bottles means two free, and the customer is never punished for the free one
 * landing on an expensive flavour.
 */
export function freeBottleCents(
  units: number[],
  now: Date = new Date(),
): number {
  if (!promoActive(now)) return 0;
  const free = Math.floor(units.length / promo.bottlesPerFree);
  if (free < 1) return 0;
  return [...units]
    .sort((a, b) => a - b)
    .slice(0, free)
    .reduce((sum, cents) => sum + cents, 0);
}
