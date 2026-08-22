"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import type { Size } from "@/lib/catalog";

export function AddToCart({ slug, sizes }: { slug: string; sizes: Size[] }) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState(sizes[0].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const size = sizes.find((s) => s.id === sizeId)!;

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-bark-faint">
          Size
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {sizes.map((s) => {
            const active = s.id === sizeId;
            return (
              <label
                key={s.id}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                  active
                    ? "border-bark bg-bark text-cream"
                    : "border-bark/15 bg-cream hover:border-bark/40"
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={s.id}
                  checked={active}
                  onChange={() => setSizeId(s.id)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold">{s.volume}</span>
                <span
                  className={`block text-xs ${active ? "text-cream/65" : "text-bark-faint"}`}
                >
                  {s.label}
                </span>
                <span className="mt-2 block font-display text-lg font-semibold">
                  {money(s.priceCents)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-bark/20">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="inline-flex h-11 w-11 items-center justify-center text-lg leading-none disabled:opacity-30"
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="inline-flex h-11 w-11 items-center justify-center text-lg leading-none"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button
          size="lg"
          onClick={() => {
            add(slug, sizeId, qty);
            setAdded(true);
          }}
        >
          Add {qty > 1 ? `${qty} · ` : ""}
          {money(size.priceCents * qty)}
        </Button>
      </div>

      {added && (
        <p className="mt-4 text-sm text-palm" role="status">
          Added to your cart.{" "}
          <Link href="/cart" className="font-semibold underline underline-offset-4">
            Review and order →
          </Link>
        </p>
      )}
    </div>
  );
}
