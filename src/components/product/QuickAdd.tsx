"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { money } from "@/lib/format";
import type { Size } from "@/lib/catalog";

const distinct = <T,>(xs: T[]) => [...new Set(xs)];

const pill = (active: boolean) =>
  `min-h-9 rounded-full px-3 text-xs font-semibold transition-colors ${
    active ? "bg-bark text-cream" : "text-bark-soft hover:text-bark"
  }`;

/**
 * Choose, then add, from the grid.
 *
 * The card used to add the small bottle and say so on the button, which made
 * the 12 oz reachable only by opening the product page — most people never
 * did, so for them it may as well not have existed. The choice sits on the
 * card now, and the price follows it.
 *
 * A pan of rice is chosen along two axes rather than one — what goes on it,
 * and how big — so where the sizes carry a `with` the control grows a second
 * row. Both rows still resolve to a single `sizeId`, because that is all the
 * cart stores.
 */
export function QuickAdd({ slug, sizes }: { slug: string; sizes: Size[] }) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState(sizes[0].id);
  const [added, setAdded] = useState(false);

  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  const proteins = distinct(sizes.map((s) => s.with));
  const volumes = distinct(sizes.map((s) => s.volume));

  // Switching one axis keeps the other, so picking turkey leaves a half pan a
  // half pan. A combination the kitchen does not sell has no size to move to,
  // and the choice is left where it was rather than silently reset.
  const moveTo = (w: string | undefined, volume: string) => {
    const next = sizes.find((s) => s.with === w && s.volume === volume);
    if (next) setSizeId(next.id);
  };

  const button = (
    <button
      type="button"
      onClick={() => {
        add(slug, size.id);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="inline-flex min-h-11 items-center rounded-full bg-bark px-5 text-sm font-semibold text-cream transition-colors hover:bg-bark-soft sm:min-h-9 sm:px-4 sm:text-xs"
    >
      {/* The price rides the button so changing a choice shows its effect
          immediately, without a second number to look for. */}
      {added ? "Added ✓" : `Add ${money(size.priceCents)}`}
    </button>
  );

  // One axis: the picker sits inline with the button, as it does on a bottle.
  if (proteins.length === 1) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {volumes.length > 1 && (
          <div
            role="radiogroup"
            aria-label="Size"
            className="inline-flex rounded-full border border-bark/20 p-0.5"
          >
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={s.id === sizeId}
                onClick={() => setSizeId(s.id)}
                className={pill(s.id === sizeId)}
              >
                {s.volume}
              </button>
            ))}
          </div>
        )}
        {button}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Protein wraps as separate pills rather than one segmented control:
          four options do not fit across a phone, and a segmented control that
          wraps inside its own border reads as a broken shape. */}
      <Row label="With">
        <div role="radiogroup" aria-label="Goes with" className="flex flex-wrap gap-1.5">
          {proteins.map((w) => {
            const active = w === size.with;
            return (
              <button
                key={w ?? "plain"}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => moveTo(w, size.volume)}
                className={`min-h-9 rounded-full border px-3 text-xs font-semibold transition-colors first-letter:uppercase ${
                  active
                    ? "border-bark bg-bark text-cream"
                    : "border-bark/20 text-bark-soft hover:border-bark/40 hover:text-bark"
                }`}
              >
                {w ?? "Rice only"}
              </button>
            );
          })}
        </div>
      </Row>

      <Row label="Size">
        <div
          role="radiogroup"
          aria-label="Size"
          className="inline-flex rounded-full border border-bark/20 p-0.5"
        >
          {volumes.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={v === size.volume}
              onClick={() => moveTo(size.with, v)}
              className={pill(v === size.volume)}
            >
              {v}
            </button>
          ))}
        </div>
      </Row>

      <div className="mt-0.5">{button}</div>
    </div>
  );
}

/** A labelled row of choices. The label is set narrow and fixed so the two
 *  rows of controls line up with each other. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="w-10 shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-bark-faint">
        {label}
      </span>
      {children}
    </div>
  );
}
