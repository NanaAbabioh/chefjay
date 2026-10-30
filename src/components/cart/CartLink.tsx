"use client";

import { useCart } from "./CartProvider";
import { ButtonLink } from "@/components/ui/Button";

/**
 * A way out of a long menu once something is in the basket.
 *
 * The header's basket is always there, but it is a 44px icon at the top of a
 * page someone has scrolled a long way down. This sits where they finished
 * adding, and says nothing at all until there is something to review — an
 * empty "go to cart" is just a dead end with a button on it.
 */
export function CartLink({ className = "" }: { className?: string }) {
  const { count, ready } = useCart();
  if (!ready || count === 0) return null;

  return (
    <ButtonLink href="/cart" size="lg" className={className}>
      Review your order · {count}
    </ButtonLink>
  );
}
