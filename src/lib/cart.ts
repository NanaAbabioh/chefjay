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
