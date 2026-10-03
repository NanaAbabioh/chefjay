import type { Metadata } from "next";
import Image from "next/image";
import { PromoGate } from "@/components/site/Promo";
import { Container, SectionHead } from "@/components/ui/Section";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { kpataashieMenu, kpataashieNotes } from "@/lib/catalog";
import { promo } from "@/lib/promo";
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
          {/* Said aloud before it is understood: people do not recommend a
              place whose name they cannot pronounce. Hence sound first,
              meaning second. */}
          <p className="mt-2 text-sm text-cream/60">
            <span className="italic">/kpa-tah-shee/</span>
            <span className="px-2 text-cream/40">·</span>
            Ga for kitchen
          </p>
          <p className="mt-4 max-w-md text-lg text-cream/80">
            Jollof, fried rice and goat soups, cooked to order.
          </p>
        </Container>
      </section>

      <Container className="py-20 sm:py-28">
        <SectionHead
          eyebrow="Cooked to order"
          title="On the menu"
          aside={
            <p className="text-base text-bark-faint">
              Priced by the pan — message us for a quote
            </p>
          }
        />

        <ul className="mt-10 grid sm:grid-cols-2 sm:gap-x-14">
          {kpataashieMenu.map((item, i) => (
            <li
              key={item.name}
              // A rule above each dish rather than a box around it: the list
              // reads as a menu instead of a table. An odd number of dishes
              // would leave a dead cell in the last row, so the final one
              // spans the full width instead.
              className={`border-t border-bark/15 py-6 ${
                i === kpataashieMenu.length - 1 && kpataashieMenu.length % 2 === 1
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <p className="font-display text-xl font-semibold">{item.name}</p>
              <p className="mt-1 text-base italic text-bark-soft">{item.dish}</p>
            </li>
          ))}
        </ul>

        <PromoGate>
          <p className="mt-8 border-l-2 border-clay/40 pl-4 text-base text-bark-soft">
            <span className="font-semibold text-clay">
              {promo.mealDiscountPercent}% off every meal, {promo.window}.
            </span>{" "}
            Quote <span className="font-semibold">{promo.code}</span> when you
            order and it comes off your quote.
          </p>
        </PromoGate>

        <ul className="mt-6 space-y-1 text-base text-bark-faint">
          {kpataashieNotes.map((note) => (
            <li key={note}>{note}</li>
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
          <ArrowLink href="/events">See event packages</ArrowLink>
        </div>
      </Container>
    </>
  );
}
