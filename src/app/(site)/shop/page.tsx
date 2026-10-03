import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/Button";
import { PromoGate } from "@/components/site/Promo";
import { promo } from "@/lib/promo";
import { Container, Eyebrow, Seal } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { drinks } from "@/lib/catalog";
import { FREE_DELIVERY_CENTS } from "@/lib/cart";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Eight piña coladas made to order — classic, mango, tigernut, peach, passion fruit, strawberry, raspberry, and a less-sweet classic.",
};

export default function ShopPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Piña colada, eight ways</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">
            The fridge
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-base text-bark-faint">
            <PromoGate>
              <p className="font-semibold text-clay">
                {promo.short} — mix any flavours
              </p>
            </PromoGate>
            <p>Free delivery over {money(FREE_DELIVERY_CENTS)}</p>
          </div>
          <span className="hidden sm:block">
              <Seal lines={["Blended", "to order"]} />
            </span>
        </div>
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {drinks.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bark/10 pt-8">
        <p className="font-display text-xl font-semibold">
          Drinking these every week?
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <ArrowLink href="/subscribe">Subscribe monthly</ArrowLink>
          <ArrowLink href="/events">Event packages</ArrowLink>
        </div>
      </div>
    </Container>
  );
}
