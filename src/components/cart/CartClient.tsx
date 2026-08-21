"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "./CartProvider";
import {
  deliveryCents,
  resolveLines,
  subtotalCents,
  FREE_DELIVERY_CENTS,
} from "@/lib/cart";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import type { Fulfilment, RetailOrder } from "@/lib/order";
import { submitOrder, type SubmitResult } from "@/app/actions";
import { DrinkGlass } from "@/components/product/DrinkGlass";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";
import { Handoff } from "@/components/forms/Handoff";

const empty: RetailOrder = {
  name: "",
  phone: "",
  email: "",
  method: "delivery",
  address: "",
  when: "",
  notes: "",
};

export function CartClient() {
  const { lines, setQty, remove, clear, ready } = useCart();
  const [order, setOrder] = useState<RetailOrder>(empty);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [pending, startTransition] = useTransition();

  const resolved = resolveLines(lines);
  const subtotal = subtotalCents(resolved);
  const delivery = deliveryCents(subtotal, order.method);
  const total = subtotal + delivery;

  const set = <K extends keyof RetailOrder>(key: K, value: RetailOrder[K]) =>
    setOrder((o) => ({ ...o, [key]: value }));

  if (result?.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Handoff
          reference={result.ref}
          whatsapp={result.whatsapp}
          mailto={result.mailto}
          heading="Order received."
          body={`We have your order and will confirm it by message shortly. Send it over on WhatsApp to get the fastest reply — nothing is charged until we confirm.`}
        />
        <div className="mt-8 text-center">
          <ButtonLink
            href="/shop"
            variant="outline"
            onClick={() => setResult(null)}
          >
            Start another order
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!ready) {
    return <p className="py-20 text-center text-bark-faint">Loading your cart…</p>;
  }

  if (resolved.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="font-display text-3xl font-semibold">Your cart is empty.</h2>
        <p className="mt-3 text-bark-soft">
          Six blends are waiting. Start with the Signature.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop">Shop the drinks</ButtonLink>
          <ButtonLink href="/events" variant="outline">
            Ordering for an event?
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      {/* Lines */}
      <div>
        <ul className="divide-y divide-bark/10 border-y border-bark/10">
          {resolved.map((l) => (
            <li key={`${l.slug}:${l.sizeId}`} className="flex gap-4 py-5">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${l.pour.top}55` }}
              >
                <DrinkGlass
                  id={`cart-${l.slug}-${l.sizeId}`}
                  top={l.pour.top}
                  bottom={l.pour.bottom}
                  garnish={false}
                  className="h-14 w-auto"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight">
                      <Link href={`/shop/${l.slug}`} className="hover:text-palm">
                        {l.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-bark-faint">
                      {l.volume} · {money(l.unitCents)} each
                    </p>
                  </div>
                  <span className="font-semibold">{money(l.lineCents)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-bark/20">
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.sizeId, l.qty - 1)}
                      className="px-3 py-1.5 leading-none"
                      aria-label={`Fewer ${l.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.sizeId, l.qty + 1)}
                      className="px-3 py-1.5 leading-none"
                      aria-label={`More ${l.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(l.slug, l.sizeId)}
                    className="text-sm text-bark-faint underline underline-offset-4 hover:text-clay"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/shop"
            className="text-sm font-semibold text-bark-soft underline underline-offset-4"
          >
            ← Keep shopping
          </Link>
          {subtotal < FREE_DELIVERY_CENTS && order.method === "delivery" && (
            <p className="text-sm text-bark-faint">
              {money(FREE_DELIVERY_CENTS - subtotal)} more for free delivery.
            </p>
          )}
        </div>
      </div>

      {/* Details + submit */}
      <form
        className="rounded-card border border-bark/10 bg-shell p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            const res = await submitOrder(order, lines);
            setResult(res);
            // The order is recorded server-side at this point, so holding the
            // cart would only risk an accidental duplicate.
            if (res.ok) clear();
          });
        }}
      >
        <h2 className="font-display text-2xl font-semibold">Where is it going?</h2>

        <fieldset className="mt-5">
          <legend className="sr-only">Delivery or pickup</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["delivery", "Deliver to me"],
                ["pickup", "I'll pick it up"],
              ] as [Fulfilment, string][]
            ).map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors ${
                  order.method === value
                    ? "border-bark bg-bark text-cream"
                    : "border-bark/20 bg-cream hover:border-bark/40"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={value}
                  checked={order.method === value}
                  onChange={() => set("method", value)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 space-y-4">
          <Field
            label="Name"
            required
            value={order.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
          <Field
            label="Phone"
            required
            type="tel"
            value={order.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
            hint="so we can confirm"
          />
          <Field
            label="Email"
            type="email"
            value={order.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
          {order.method === "delivery" ? (
            <Field
              label="Delivery address"
              required
              value={order.address}
              onChange={(e) => set("address", e.target.value)}
              autoComplete="street-address"
              placeholder="Street, apt, borough"
            />
          ) : (
            <p className="rounded-xl bg-cream px-4 py-3 text-sm text-bark-soft">
              Pick up from {site.city} — we will send the exact address when we
              confirm. {site.hours}.
            </p>
          )}
          <Field
            label="When would you like it?"
            value={order.when}
            onChange={(e) => set("when", e.target.value)}
            placeholder="Today after 4pm, Saturday morning…"
          />
          <TextArea
            label="Anything else"
            rows={3}
            value={order.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Less sweet, no ginger, leave with the doorman…"
          />
        </div>

        <dl className="mt-7 space-y-2 border-t border-bark/15 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-bark-soft">Subtotal</dt>
            <dd className="font-semibold">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bark-soft">
              {order.method === "delivery" ? "Delivery" : "Pickup"}
            </dt>
            <dd className="font-semibold">
              {delivery === 0 ? "Free" : money(delivery)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-bark/15 pt-2 font-display text-xl font-semibold">
            <dt>Total</dt>
            <dd>{money(total)}</dd>
          </div>
        </dl>

        {result && !result.ok && (
          <p className="mt-4 rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay" role="alert">
            {result.error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
          {pending ? "Sending…" : "Place order"}
        </Button>
        <p className="mt-3 text-center text-xs text-bark-faint">
          No payment now. We confirm by message, then take payment on delivery.
        </p>
      </form>
    </div>
  );
}
