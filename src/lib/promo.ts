/**
 * The grand opening offer, in one place.
 *
 * Everything that mentions the promotion — the bar above the header, the
 * stamp on the shop page, the home page band, the Kpataashie note, the cart
 * total and the WhatsApp handoff — reads from here. Changing the dates or
 * pulling the offer is one edit, and nothing is left advertising a promotion
 * that ended.
 *
 * Dates are business-local (site.timeZone), inclusive of both ends. A customer
 * in another timezone sees the offer by Chef Jay's clock, which is the one the
 * kitchen keeps.
 */
import { site } from "./site";

export const promo = {
  /** Shown on flyers and posts; the bottle offer applies without it. */
  code: "B3G1",
  /** First and last day the offer runs, inclusive, as YYYY-MM-DD. */
  startsOn: "2026-10-03",
  endsOn: "2026-10-11",

  /** Bottles: every nth bottle in the cart is free. 4 = buy three, get one. */
  bottlesPerFree: 4,
  /** Kpataashie meals, applied by hand when the order is confirmed. */
  mealDiscountPercent: 15,

  eyebrow: "Grand opening",
  /** One line. It goes in the bar above the header, so it has to fit a phone. */
  bar: "Grand opening — buy 3 bottles, the 4th is on us",
  heading: "Three bottles. The fourth is on us.",
  body:
    "Mix any flavours you like: add four bottles and the cheapest comes off " +
    "at checkout, no code needed. Ordering from Kpataashie? Quote B3G1 and " +
    "take 15% off your meal.",
  /** Shown wherever the dates matter. Kept as prose: "3–11 October" reads
   *  better than a date range nobody parses. */
  window: "3 – 11 October",
} as const;

/** Today where the business trades, as YYYY-MM-DD. */
function businessToday(now: Date): string {
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
