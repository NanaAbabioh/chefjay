"use server";

import { resolveLines, subtotalCents, deliveryCents, type CartLine } from "@/lib/cart";
import { eventPackages } from "@/lib/catalog";
import { site } from "@/lib/site";
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
 * Emails one submission through Resend. Returns quietly on failure — a bounced
 * notification must never cost the customer their order, and the server log in
 * `record` below is still a complete record.
 *
 * Set RESEND_API_KEY to switch this on. Until it is set, nothing is sent, so
 * local development and builds behave exactly as before.
 */
async function notify(subject: string, message: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Resend only accepts a From on a domain you have verified with them.
        from: process.env.ORDER_EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
        to: [process.env.ORDER_EMAIL_TO ?? site.email],
        subject,
        text: message,
      }),
    });

    if (!response.ok) {
      console.error(`[notify] ${response.status} ${await response.text()}`);
    }
  } catch (error) {
    console.error("[notify] send failed", error);
  }
}

const subjects = {
  order: "Order",
  quote: "Event quote",
  signup: "Kitchen waitlist",
} as const;

/**
 * Orders are recorded here before the customer is handed off to WhatsApp, so
 * an abandoned handoff still leaves you a record in the server logs — and, once
 * RESEND_API_KEY is set, in your inbox too.
 *
 * This is the only place a submission is handled. Any other destination you
 * want — a webhook, a spreadsheet, a database — belongs in this one function.
 */
async function record(kind: keyof typeof subjects, ref: string, message: string) {
  console.info(`[${kind}] ${ref}\n${message}\n`);
  await notify(`${subjects[kind]} ${ref} — ${site.name}`, message);
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
  await record("signup", clean, `Kitchen waitlist signup: ${clean}`);
  return { ok: true };
}
