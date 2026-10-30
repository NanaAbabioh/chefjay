import { getProduct, type Category } from "./catalog";
import { freeBottleCents, mealDiscountCents } from "./promo";

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
  /** Drinks are photographed; a Kpataashie pan is not. See `Product.image`. */
  image: string | null;
  /** The two offers running are not the same offer — bottles get a free
   * fourth, food gets a percentage — so every line has to say which it is. */
  category: Category;
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
        image: product.image ?? null,
        category: product.category,
      },
    ];
  });
}

export const subtotalCents = (lines: ResolvedLine[]) =>
  lines.reduce((sum, l) => sum + l.lineCents, 0);

export const only = (lines: ResolvedLine[], category: Category) =>
  lines.filter((l) => l.category === category);

/** Every bottle in the basket as its own price, which is what the free-bottle
 * offer counts. Four lines of one bottle and one line of four are the same
 * basket, so the offer must not be able to tell them apart. A pan of jollof
 * is not a bottle and never counts toward it. */
export const unitPrices = (lines: ResolvedLine[]) =>
  only(lines, "drink").flatMap((l) => Array<number>(l.qty).fill(l.unitCents));

/**
 * What comes off, itemised.
 *
 * Two offers run side by side and they come off different halves of the
 * basket, so they are worked out separately and shown separately — a single
 * netted figure would leave the customer unable to tell which of the two the
 * money came from, and the kitchen unable to tell either.
 */
export type Discounts = { bottles: number; meals: number; total: number };

export function discounts(lines: ResolvedLine[], now?: Date): Discounts {
  const bottles = freeBottleCents(unitPrices(lines), now);
  const meals = mealDiscountCents(subtotalCents(only(lines, "meal")), now);
  return { bottles, meals, total: bottles + meals };
}

export const itemCount = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.qty, 0);

/** Bottles in the basket, which is what the free-bottle nudge counts down. */
export const bottleCount = (lines: ResolvedLine[]) =>
  only(lines, "drink").reduce((sum, l) => sum + l.qty, 0);

/**
 * Delivery is priced by where it is going, so the cart has to ask. The address
 * field is free text and always will be — nobody is parsing "Elizabeth, NJ"
 * out of it and getting it right every time, and a wrong guess here is a wrong
 * price on a real order.
 *
 * Anywhere outside the two states has no price: `null` means "we cannot say
 * yet", not "free". Everything downstream has to carry that distinction, or a
 * customer in Connecticut is quoted a total that excludes a fee they will
 * later be asked for.
 */
export type Zone = "NJ" | "NY" | "other";

export const zones: { id: Zone; label: string; feeCents: number | null }[] = [
  { id: "NJ", label: "New Jersey", feeCents: 999 },
  { id: "NY", label: "New York", feeCents: 1499 },
  { id: "other", label: "Somewhere else", feeCents: null },
];

export const zoneLabel = (zone: Zone) =>
  zones.find((z) => z.id === zone)?.label ?? "Somewhere else";

/** Cents to charge, or null when it has to be confirmed by hand. */
export function deliveryCents(
  method: "delivery" | "pickup",
  zone: Zone,
): number | null {
  if (method === "pickup") return 0;
  return zones.find((z) => z.id === zone)?.feeCents ?? null;
}
