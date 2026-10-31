import type { Metadata } from "next";
import Image from "next/image";
import { PromoGate } from "@/components/site/Promo";
import { Offer, Window } from "@/components/site/PromoMarks";
import { CartLink } from "@/components/cart/CartLink";
import { PanList } from "@/components/product/PanList";
import { Container, SectionHead } from "@/components/ui/Section";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { kpataashieMenu, kpataashieNotes } from "@/lib/catalog";
import { promo } from "@/lib/promo";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/order";

export const metadata: Metadata = {
  title: "Kpataashie",
  description: `Jollof, fried rice and goat soups from ${site.name}. Order a half or full pan online, or message for anything off the list.`,
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
            Jollof, fried rice and goat soups, cooked to order. Priced by the
            pan, ordered right here.
          </p>
        </Container>
      </section>

      <PromoGate>
        {/* Above the menu, not under it. The discount is the reason someone
            is reading this page this fortnight. */}
        <div className="bg-clay/8">
          <Container className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-8">
            <Offer>{`${promo.mealDiscountPercent}% off`}</Offer>
            <p className="text-base text-bark-soft">
              Comes off every pan in your cart. Orders close{" "}
              {promo.ordersClose}.{" "}
              <ArrowLink href={promo.href}>See the Thanksgiving special</ArrowLink>
            </p>
          </Container>
        </div>
      </PromoGate>

      <Container className="py-20 sm:py-28">
        <SectionHead
          eyebrow="Cooked to order"
          title="On the menu"
          aside={
            <p className="text-base text-bark-faint">
              Ordered by the pan — pick a rice, what goes on it, and a size
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

        <ul className="mt-8 space-y-1 text-base text-bark-faint">
          {kpataashieNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        {/* The price list is the order form — one list, so a price can never
            drift between what is advertised and what is charged. The question
            everyone asks first goes above it. */}
        <div className="mt-16 border-t border-bark/10 pt-10">
          <SectionHead
            eyebrow="By the pan"
            title="Build your order."
            aside={
              <PromoGate>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Window />
                  <p className="text-base font-semibold text-clay">
                    {promo.mealDiscountPercent}% off, taken off in your cart
                  </p>
                </div>
              </PromoGate>
            }
          />

          <div className="mt-8">
            <PanList />
          </div>

          <p className="mt-8 text-base text-bark-faint">
            Anything not listed — indomie, gɔbɛ, the peppered goat — is quoted
            when you message. So is tilapia, veal or mackerel in place of a
            protein above.
          </p>
        </div>

        {/* The cart link appears only once something is in it. Everything
            else here is for the orders a price list cannot close. */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <CartLink />
          <ButtonLink
            href={whatsappUrl(`Hi ${site.owner}, I'd like to order from Kpataashie.`)}
            variant="outline"
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
