"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

export function QuickAdd({
  slug,
  sizeId,
  label,
}: {
  slug: string;
  sizeId: string;
  label: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(slug, sizeId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="rounded-full bg-bark px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-palm"
    >
      {added ? "Added ✓" : label}
    </button>
  );
}
