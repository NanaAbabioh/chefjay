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
      className="inline-flex min-h-11 items-center rounded-full bg-bark px-5 text-sm font-semibold text-cream transition-colors hover:bg-palm sm:min-h-0 sm:px-4 sm:py-2 sm:text-xs"
    >
      {added ? "Added ✓" : label}
    </button>
  );
}
