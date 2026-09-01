import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { drinks } from "@/lib/catalog";
import { FREE_DELIVERY_CENTS } from "@/lib/cart";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Six piña coladas made to order — classic, mango, tigernut, passion fruit, strawberry and raspberry.",
};

export default function ShopPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-5xl font-semibold sm:text-6xl">
          The fridge
        </h1>
        <p className="text-sm text-bark-faint">
          Free delivery over {money(FREE_DELIVERY_CENTS)}
        </p>
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
        <Link
          href="/events"
          className="rounded-full bg-bark px-6 py-3 text-sm font-semibold text-cream hover:bg-palm"
        >
          Event packages
        </Link>
      </div>
    </Container>
  );
}
