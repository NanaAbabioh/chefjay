import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/Button";
import { PromoGate } from "@/components/site/Promo";
import { promo } from "@/lib/promo";
import { Container, Eyebrow, Seal, SectionHead } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { PanList } from "@/components/product/PanList";
import { drinks } from "@/lib/catalog";
import { zones } from "@/lib/cart";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Eight piña coladas made to order — classic, mango, tigernut, peach, passion fruit, strawberry, raspberry and a less-sweet classic — plus the Gold Coast Corn Shake and Fura-liscious, iced kenkey and millet fura. Every drink in 8 oz or 12 oz, and jollof, fried rice and goat soups by the half or full pan.",
};

export default function ShopPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Eight coladas, two from home, and the kitchen</Eyebrow>
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
            <p>Every drink in 8 oz or 12 oz</p>
            <p>
              Delivery {money(zones[0].feeCents!)} in New Jersey,{" "}
              {money(zones[1].feeCents!)} in New York
            </p>
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

      {/* The kitchen sells through the same cart, so it sells on the same
          page. The pans are not a seasonal act and nothing here is gated on a
          promotion — /kpataashie is the kitchen's own room, not the only door
          into it. */}
      <div className="mt-24 border-t border-bark/10 pt-12">
        <SectionHead
          eyebrow="From the kitchen"
          title="By the pan."
          aside={
            <div className="text-base text-bark-faint">
              <PromoGate>
                <p className="font-semibold text-clay">
                  {promo.mealDiscountPercent}% off every pan, {promo.windowShort}
                </p>
              </PromoGate>
              <p>
                Cooked to order ·{" "}
                <ArrowLink href="/kpataashie">See the menu</ArrowLink>
              </p>
            </div>
          }
        />
        <div className="mt-10">
          <PanList />
        </div>
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
