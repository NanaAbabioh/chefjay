import { money } from "./format";
import { site } from "./site";
import type { ResolvedLine } from "./cart";

export type Fulfilment = "delivery" | "pickup";

export type RetailOrder = {
  name: string;
  phone: string;
  email: string;
  method: Fulfilment;
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

export function retailMessage(
  ref: string,
  order: RetailOrder,
  lines: ResolvedLine[],
  totals: { subtotal: number; delivery: number; total: number },
): string {
  const items = lines
    .map((l) => `• ${l.qty} × ${l.name} (${l.volume}) — ${money(l.lineCents)}`)
    .join("\n");

  return [
    `New order ${ref}`,
    ``,
    items,
    ``,
    `Subtotal: ${money(totals.subtotal)}`,
    order.method === "delivery"
      ? `Delivery: ${totals.delivery === 0 ? "Free" : money(totals.delivery)}`
      : `Pickup: Free`,
    `Total: ${money(totals.total)}`,
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
