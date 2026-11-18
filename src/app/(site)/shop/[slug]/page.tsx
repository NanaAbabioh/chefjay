import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { drinks, getProduct, shopProducts } from "@/lib/catalog";

/**
 * What the shop sells by the bottle or the bowl. A Kpataashie pan is a product
 * like any other in the catalog but has no page here: it is sold off the menu
 * at /kpataashie, where the pan sizes and the servings make sense.
 */
const sold = (slug: string) => {
  const product = getProduct(slug);
  return product && shopProducts.includes(product) ? product : undefined;
};

export function generateStaticParams() {
  return shopProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = sold(slug);
  if (!product) return {};
  // A product waiting on its photograph still gets a title and a description;
  // only the share cards, which are nothing without a picture, are held back.
  const shots = product.image ? { images: [product.image] } : {};
  return {
    title: product.name,
    description: product.blurb,
    openGraph: {
      title: product.name,
      description: product.blurb,
      type: "website",
      ...shots,
    },
    twitter: {
      card: product.image ? "summary_large_image" : "summary",
      title: product.name,
      description: product.blurb,
      ...shots,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = sold(slug);
  if (!product) notFound();

  const others = drinks.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Container className="py-10 sm:py-14">
        <Link href="/shop" className="text-sm text-bark-faint hover:text-bark">
          ← The fridge
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Empty until the photograph lands. Dropping the file in at
              /images/<slug>.jpg fills it with no code change — the same rule
              the pans follow. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-shell">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="lg:pt-6">
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-bark-soft">{product.blurb}</p>

            {product.ingredients && (
              <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-sm text-bark-faint">
                {product.ingredients.map((i, n) => (
                  <li key={i}>
                    {i}
                    {n < product.ingredients!.length - 1 && (
                      <span className="ml-2">·</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <AddToCart slug={product.slug} sizes={product.sizes} />

            <p className="mt-8 border-t border-bark/10 pt-6 text-sm text-bark-faint">
              Ordering for a crowd?{" "}
              <Link href="/events" className="text-clay underline underline-offset-4">
                Dispensers and bulk
              </Link>
            </p>
          </div>
        </div>
      </Container>

      <section className="py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold">More from the fridge</h2>
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
