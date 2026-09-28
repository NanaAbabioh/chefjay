import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/Button";
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
          <p className="text-base text-bark-faint">
            Free delivery over {money(FREE_DELIVERY_CENTS)}
          </p>
          <Seal lines={["Blended", "to order"]} className="hidden sm:inline-flex" />
        </div>
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {drinks.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bark/10 pt-8">
        <p className="font-display text-xl font-semibold">
          Buying for more than ten people?
        </p>
        <ArrowLink href="/events">Event packages</ArrowLink>
      </div>
    </Container>
  );
}
