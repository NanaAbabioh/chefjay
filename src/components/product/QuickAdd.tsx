"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { money } from "@/lib/format";
import type { Size } from "@/lib/catalog";

/**
 * Size, then add, from the grid.
 *
 * The card used to add the small bottle and say so on the button, which made
 * the 12 oz reachable only by opening the product page — most people never
 * did, so for them it may as well not have existed. The choice sits on the
 * card now, and the price follows it.
 */
export function QuickAdd({ slug, sizes }: { slug: string; sizes: Size[] }) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState(sizes[0].id);
  const [added, setAdded] = useState(false);

  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const choice = sizes.length > 1;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {choice && (
        <div
          role="radiogroup"
          aria-label="Size"
          className="inline-flex rounded-full border border-bark/20 p-0.5"
        >
          {sizes.map((s) => {
            const active = s.id === sizeId;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSizeId(s.id)}
                className={`min-h-9 rounded-full px-3 text-xs font-semibold transition-colors ${
                  active ? "bg-bark text-cream" : "text-bark-soft hover:text-bark"
                }`}
              >
                {s.volume}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          add(slug, size.id);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1400);
        }}
        className="inline-flex min-h-11 items-center rounded-full bg-bark px-5 text-sm font-semibold text-cream transition-colors hover:bg-bark-soft sm:min-h-9 sm:px-4 sm:text-xs"
      >
        {/* The price rides the button so switching size shows its effect
            immediately, without a second number to look for. */}
        {added ? "Added ✓" : `Add ${money(size.priceCents)}`}
      </button>
    </div>
  );
}
