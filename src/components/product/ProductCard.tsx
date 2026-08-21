import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { money } from "@/lib/format";
import { DrinkGlass } from "./DrinkGlass";
import { QuickAdd } from "./QuickAdd";

export function ProductCard({ product }: { product: Product }) {
  const cheapest = product.sizes[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-bark/10 bg-shell transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(36,26,18,0.45)]">
      <Link
        href={`/shop/${product.slug}`}
        className="relative flex justify-center overflow-hidden px-6 pt-8"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${product.pour.top}55, transparent 70%)`,
        }}
      >
        <DrinkGlass
          id={`card-${product.slug}`}
          top={product.pour.top}
          bottom={product.pour.bottom}
          className="h-52 w-auto transition-transform duration-500 group-hover:-translate-y-1.5"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 border-t border-bark/10 bg-cream p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-tight">
            <Link href={`/shop/${product.slug}`} className="hover:text-palm">
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 text-sm font-semibold text-bark-soft">
            {money(cheapest.priceCents)}
          </span>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-bark-soft">
          {product.blurb}
        </p>

        {product.tags && (
          <ul className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-bark-soft"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-1 flex items-center justify-between gap-3">
          <QuickAdd
            slug={product.slug}
            sizeId={cheapest.id}
            label={`Add ${cheapest.volume}`}
          />
          <Link
            href={`/shop/${product.slug}`}
            className="text-xs font-semibold text-bark-soft underline underline-offset-4 hover:text-bark"
          >
            All sizes
          </Link>
        </div>
      </div>
    </article>
  );
}
