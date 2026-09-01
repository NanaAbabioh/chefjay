import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { kpataashieMenu } from "@/lib/catalog";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/order";

export const metadata: Metadata = {
  title: "Kpataashie",
  description: `Jollof, fried rice and goat soups from ${site.name}. Ordered by message — pans and proteins confirmed by hand.`,
};

export default function KpataashiePage() {
  return (
    <>
      <section className="relative flex min-h-[58vh] items-end overflow-hidden">
        {/* Backdrop in its own positioned wrapper: painting follows DOM

            order, so no negative z-index can drop it behind the body. */}

        <div className="absolute inset-0">

          <Image
            src="/images/kpataashie.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/35 to-transparent" />

        </div>
        <Container className="relative pb-14 text-cream">
          <h1 className="font-display text-5xl font-semibold sm:text-6xl">
            Kpataashie
          </h1>
          <p className="mt-4 max-w-md text-lg text-cream/80">
            The kitchen. Jollof, fried rice and goat soups, cooked to order.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold">On the menu</h2>
          <p className="text-sm text-bark-faint">
            Priced by the pan — message us for a quote
          </p>
        </div>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-card border border-bark/15 bg-bark/15 sm:grid-cols-2">
          {kpataashieMenu.map((item, i) => (
            <li
              key={item.name}
              // An odd number of dishes would leave a dead cell in the last
              // row, so the final one spans the full width instead.
              className={`bg-cream p-6 ${
                i === kpataashieMenu.length - 1 && kpataashieMenu.length % 2 === 1
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <p className="font-display text-lg font-semibold">{item.name}</p>
              {item.detail && (
                <p className="mt-1 text-sm text-bark-soft">{item.detail}</p>
              )}
            </li>
          ))}
        </ul>

        {/* No cart for food: pans and proteins are worth confirming by hand. */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink
            href={whatsappUrl(`Hi ${site.owner}, I'd like to order from Kpataashie.`)}
            size="lg"
          >
            Order on WhatsApp
          </ButtonLink>
          <a
            href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex min-h-11 items-center rounded-full border border-bark/40 px-6 font-semibold hover:bg-bark/5"
          >
            {site.phone}
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bark/10 pt-8">
          <p className="font-display text-xl font-semibold">
            Feeding a crowd?
          </p>
          <ButtonLink href="/events" variant="outline">
            See event packages
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
