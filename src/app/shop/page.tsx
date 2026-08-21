import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { drinks } from "@/lib/catalog";
import { FREE_DELIVERY_CENTS } from "@/lib/cart";
import { money } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Six small-batch tropical blends in three sizes — single bottles, large bottles and 64 oz jugs.",
};

export default function ShopPage() {
  return (
    <>
      <section className="border-b border-bark/10 bg-shell py-14 sm:py-20">
        <Container>
          <Eyebrow>The drinks</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold sm:text-6xl">
            Six blends. Three sizes. No concentrate.
          </h1>
          <p className="prose-measure mt-5 text-lg leading-relaxed text-bark-soft">
            Everything is pressed and blended in small batches, so what is best
            changes with the season. Free delivery on orders over{" "}
            {money(FREE_DELIVERY_CENTS)} across {site.serviceArea}.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drinks.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start gap-4 rounded-card border border-bark/10 bg-shell p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Buying for more than ten people?
              </h2>
              <p className="prose-measure mt-2 text-bark-soft">
                Dispensers, cups and setup work out cheaper per head than bottles.
              </p>
            </div>
            <Link
              href="/events"
              className="shrink-0 rounded-full bg-bark px-6 py-3 text-sm font-semibold text-cream hover:bg-palm"
            >
              See event packages
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
