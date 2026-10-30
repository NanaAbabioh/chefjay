import { money } from "./format";
import { site } from "./site";
import type { Discounts, ResolvedLine, Zone } from "./cart";
import { only, zoneLabel } from "./cart";
import { promo } from "./promo";

export type Fulfilment = "delivery" | "pickup";

export type RetailOrder = {
  name: string;
  phone: string;
  email: string;
  method: Fulfilment;
  /** Which price band the address falls in. Asked for, never inferred. */
  zone: Zone;
  address: string;
  when: string;
  notes: string;
};

export type EventQuote = {
  name: string;
  phone: string;
  email: string;
  packageId: string;
  eventType: string;
  date: string;
  guests: string;
  venue: string;
  flavors: string[];
  notes: string;
};

/** A short, human-readable reference so you and the customer can talk about
 * the same order on the phone. Not a database id — just a handle. */
export function orderRef(seed: number): string {
  return `VC-${seed.toString(36).toUpperCase().slice(-5)}`;
}

export type Totals = {
  subtotal: number;
  discount: Discounts;
  /** null when the address is outside both states and needs a quote. */
  delivery: number | null;
  total: number;
};

export function retailMessage(
  ref: string,
  order: RetailOrder,
  lines: ResolvedLine[],
  totals: Totals,
): string {
  const item = (l: ResolvedLine) =>
    `• ${l.qty} × ${l.name} (${l.volume}) — ${money(l.lineCents)}`;

  const pans = only(lines, "meal");
  const bottles = only(lines, "drink");
  // Headed only when an order crosses both. On the morning of, the kitchen
  // and the fridge are two different jobs, and one undifferentiated list
  // leaves someone to sort it by hand.
  const items =
    pans.length && bottles.length
      ? [
          "Kitchen",
          ...pans.map(item),
          "",
          "Fridge",
          ...bottles.map(item),
        ].join("\n")
      : lines.map(item).join("\n");

  return [
    `New order ${ref}`,
    ``,
    items,
    ``,
    `Subtotal: ${money(totals.subtotal)}`,
    // Shown as lines of their own: this message is what the customer
    // screenshots, so a discount has to be visible, not just netted off. The
    // two offers come off different halves of the basket and are never rolled
    // into one figure.
    totals.discount.meals > 0
      ? `${promo.eyebrow} (${promo.mealDiscountPercent}% off food): -${money(totals.discount.meals)}`
      : null,
    totals.discount.bottles > 0
      ? `${promo.eyebrow} (4th bottle free): -${money(totals.discount.bottles)}`
      : null,
    order.method === "delivery"
      ? totals.delivery === null
        ? `Delivery (${zoneLabel(order.zone)}): to be confirmed`
        : `Delivery (${zoneLabel(order.zone)}): ${money(totals.delivery)}`
      : `Pickup: Free`,
    // An unpriced delivery makes the total a subtotal, and saying so is the
    // difference between a quote and a surprise.
    totals.delivery === null
      ? `Total so far: ${money(totals.total)} — plus delivery, confirmed before it goes out`
      : `Total: ${money(totals.total)}`,
    ``,
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    order.email ? `Email: ${order.email}` : null,
    `Fulfilment: ${order.method === "delivery" ? "Delivery" : "Pickup"}`,
    order.method === "delivery" ? `Address: ${order.address}` : null,
    order.when ? `Preferred time: ${order.when}` : null,
    order.notes ? `Notes: ${order.notes}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function eventMessage(ref: string, q: EventQuote, packageName: string): string {
  return [
    `Event quote request ${ref}`,
    ``,
    `Package: ${packageName}`,
    `Event: ${q.eventType}`,
    `Date: ${q.date}`,
    `Guests: ${q.guests}`,
    q.venue ? `Venue: ${q.venue}` : null,
    q.flavors.length ? `Flavors: ${q.flavors.join(", ")}` : null,
    ``,
    `Name: ${q.name}`,
    `Phone: ${q.phone}`,
    `Email: ${q.email}`,
    q.notes ? `Notes: ${q.notes}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const mailtoUrl = (subject: string, message: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
