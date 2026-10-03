import { getProduct } from "./catalog";
import { freeBottleCents } from "./promo";

/** What we persist. Deliberately minimal — prices are always re-read from the
 * catalog so a price change never leaves a stale total in someone's browser. */
export type CartLine = {
  slug: string;
  sizeId: string;
  qty: number;
};

export type ResolvedLine = CartLine & {
  name: string;
  volume: string;
  unitCents: number;
  lineCents: number;
  image: string;
};

export const lineKey = (slug: string, sizeId: string) => `${slug}:${sizeId}`;

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug);
    const size = product?.sizes.find((s) => s.id === line.sizeId);
    // A product or size removed from the catalog silently drops out of the cart.
    if (!product || !size) return [];
    return [
      {
        ...line,
        name: product.name,
        volume: size.volume,
        unitCents: size.priceCents,
        lineCents: size.priceCents * line.qty,
        image: product.image,
      },
    ];
  });
}

export const subtotalCents = (lines: ResolvedLine[]) =>
  lines.reduce((sum, l) => sum + l.lineCents, 0);

/** Every bottle in the basket as its own price, which is what the free-bottle
 * offer counts. Four lines of one bottle and one line of four are the same
 * basket, so the offer must not be able to tell them apart. */
export const unitPrices = (lines: ResolvedLine[]) =>
  lines.flatMap((l) => Array<number>(l.qty).fill(l.unitCents));

/** Positive cents to subtract for the grand opening offer, or 0. */
export const discountCents = (lines: ResolvedLine[], now?: Date) =>
  freeBottleCents(unitPrices(lines), now);

export const itemCount = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.qty, 0);

/** Free local delivery over this amount; below it, a flat fee. */
export const FREE_DELIVERY_CENTS = 5000;
export const DELIVERY_FEE_CENTS = 600;

/** Judged on what is actually paid: a basket discounted below the threshold
 * should not still qualify for free delivery. */
export function deliveryCents(subtotal: number, method: "delivery" | "pickup") {
  if (method === "pickup") return 0;
  return subtotal >= FREE_DELIVERY_CENTS ? 0 : DELIVERY_FEE_CENTS;
}
