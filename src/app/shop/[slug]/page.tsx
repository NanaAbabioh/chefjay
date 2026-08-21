import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { DrinkGlass } from "@/components/product/DrinkGlass";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { getProduct, products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.blurb };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Container className="py-10 sm:py-14">
        <Link
          href="/shop"
          className="text-sm font-semibold text-bark-faint hover:text-bark"
        >
          ← All drinks
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div
            className="flex items-center justify-center rounded-card p-10"
            style={{
              background: `radial-gradient(80% 70% at 50% 20%, ${product.pour.top}, ${product.pour.bottom}40)`,
            }}
          >
            <DrinkGlass
              id={`detail-${product.slug}`}
              top={product.pour.top}
              bottom={product.pour.bottom}
              className="h-80 w-auto sm:h-[26rem]"
            />
          </div>

          <div>
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-bark-soft">
              {product.story}
            </p>

            <div className="mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-bark-faint">
                What is in it
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((i) => (
                  <li
                    key={i}
                    className="rounded-full border border-bark/15 px-3 py-1.5 text-sm text-bark-soft"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <AddToCart slug={product.slug} sizes={product.sizes} />

            <p className="mt-6 border-t border-bark/10 pt-6 text-sm text-bark-faint">
              Need this for fifty people?{" "}
              <Link
                href="/events"
                className="font-semibold text-clay underline underline-offset-4"
              >
                Ask about dispensers
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>

      <section className="border-t border-bark/10 bg-shell py-16">
        <Container>
          <h2 className="font-display text-3xl font-semibold">
            You might also like
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
