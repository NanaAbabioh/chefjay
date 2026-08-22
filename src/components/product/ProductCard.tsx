import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/format";
import { QuickAdd } from "./QuickAdd";

export function ProductCard({ product }: { product: Product }) {
  const cheapest = product.sizes[0];

  return (
    <article className="group flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-card bg-shell"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-tight">
          <Link href={`/shop/${product.slug}`} className="hover:text-clay">
            {product.name}
          </Link>
        </h3>
        <span className="shrink-0 text-sm text-bark-faint">
          {money(cheapest.priceCents)}
        </span>
      </div>

      <p className="mt-1 text-sm leading-relaxed text-bark-soft">{product.blurb}</p>

      <div className="mt-3">
        <QuickAdd
          slug={product.slug}
          sizeId={cheapest.id}
          label={`Add ${cheapest.volume}`}
        />
      </div>
    </article>
  );
}
