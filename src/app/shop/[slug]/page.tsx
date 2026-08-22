import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
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
  return {
    title: product.name,
    description: product.blurb,
    openGraph: {
      title: product.name,
      description: product.blurb,
      type: "website",
      images: [product.image],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.blurb,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Container className="py-10 sm:py-14">
        <Link href="/shop" className="text-sm text-bark-faint hover:text-bark">
          ← All drinks
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-shell">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="lg:pt-6">
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-bark-soft">{product.blurb}</p>

            <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-sm text-bark-faint">
              {product.ingredients.map((i, n) => (
                <li key={i}>
                  {i}
                  {n < product.ingredients.length - 1 && <span className="ml-2">·</span>}
                </li>
              ))}
            </ul>

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
