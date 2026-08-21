"use server";

import { resolveLines, subtotalCents, deliveryCents, type CartLine } from "@/lib/cart";
import { eventPackages } from "@/lib/catalog";
import {
  eventMessage,
  mailtoUrl,
  orderRef,
  retailMessage,
  whatsappUrl,
  type EventQuote,
  type RetailOrder,
} from "@/lib/order";

export type SubmitResult =
  | { ok: true; ref: string; whatsapp: string; mailto: string; summary: string }
  | { ok: false; error: string };

/**
 * Orders are recorded here before the customer is handed off to WhatsApp, so
 * an abandoned handoff still leaves you a record in the server logs.
 *
 * To also receive these by email, add your provider's send call in this one
 * function — nothing else needs to change.
 */
async function record(kind: "order" | "quote", ref: string, message: string) {
  console.info(`[${kind}] ${ref}\n${message}\n`);
}

export async function submitOrder(
  order: RetailOrder,
  lines: CartLine[],
): Promise<SubmitResult> {
  if (!order.name.trim() || !order.phone.trim()) {
    return { ok: false, error: "Please give us a name and a phone number." };
  }
  if (order.method === "delivery" && !order.address.trim()) {
    return { ok: false, error: "We need a delivery address to bring this to you." };
  }

  const resolved = resolveLines(lines);
  if (resolved.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const subtotal = subtotalCents(resolved);
  const delivery = deliveryCents(subtotal, order.method);
  const ref = orderRef(Date.now());
  const message = retailMessage(ref, order, resolved, {
    subtotal,
    delivery,
    total: subtotal + delivery,
  });

  await record("order", ref, message);

  return {
    ok: true,
    ref,
    summary: message,
    whatsapp: whatsappUrl(message),
    mailto: mailtoUrl(`Order ${ref}`, message),
  };
}

export async function submitQuote(quote: EventQuote): Promise<SubmitResult> {
  if (!quote.name.trim() || !quote.phone.trim() || !quote.email.trim()) {
    return { ok: false, error: "Please give us a name, phone number and email." };
  }
  if (!quote.date.trim() || !quote.guests.trim()) {
    return { ok: false, error: "Please tell us the date and roughly how many guests." };
  }

  const pkg = eventPackages.find((p) => p.id === quote.packageId);
  const ref = orderRef(Date.now());
  const message = eventMessage(ref, quote, pkg?.name ?? "Not specified");

  await record("quote", ref, message);

  return {
    ok: true,
    ref,
    summary: message,
    whatsapp: whatsappUrl(message),
    mailto: mailtoUrl(`Event quote ${ref}`, message),
  };
}

/** Kitchen waitlist. Same recording path as orders. */
export async function joinKitchenList(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const clean = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { ok: false, error: "That email does not look right." };
  }
  await record("quote", "KITCHEN", `Kitchen waitlist signup: ${clean}`);
  return { ok: true };
}
