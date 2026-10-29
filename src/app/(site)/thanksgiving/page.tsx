import type { Metadata } from "next";
import Image from "next/image";
import { Band, Container, Eyebrow, SectionHead, Seal } from "@/components/ui/Section";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { ShippedClip } from "@/components/site/ShippedClip";
import { ClosedNotice, Deadline, Spent } from "@/components/site/thanksgiving/Deadline";
import { Leaves } from "@/components/site/thanksgiving/Leaves";
import { Offer, Window } from "@/components/site/PromoMarks";
import { kpataashieMenu, panServings, products } from "@/lib/catalog";
import { zones } from "@/lib/cart";
import { money } from "@/lib/format";
import { whatsappUrl } from "@/lib/order";
import { promo } from "@/lib/promo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thanksgiving",
  description: `${promo.mealDiscountPercent}% off every food order and a free fourth drink at ${site.name}, ${promo.window}. Jollof, fried rice and goat soups by the pan for Thanksgiving and Friendsgiving. Orders close ${promo.ordersClose}.`,
};

/**
 * The Thanksgiving page.
 *
 * Built to be deleted. Everything seasonal lives in this folder, in
 * `components/site/thanksgiving/`, and in the handful of values at the top of
 * `lib/promo.ts` — taking it down on the fifteenth is removing the route, the
 * nav entry and the two turkeys, and pointing `promo.href` back at /shop.
 * Nothing in the shared components knows the word Thanksgiving — `PromoMarks`
 * sits outside this folder for that reason, because the home and Kpataashie
 * pages use it too and the next offer will want it.
 *
 * The page is deliberately readable in all three phases of the offer. Someone
 * arriving from a printed flyer before the first of November should be told
 * when to come back rather than meet a blank page, and someone arriving after
 * the fourteenth should be told the kitchen has shut the list rather than be
 * sold a pan nobody can now cook. `Deadline` and `ClosedNotice` carry that;
 * the rest of the page is the same whenever it is read.
 */
export default function ThanksgivingPage() {
  const picks = ["classic-pina-colada", "mango-pina-colada", "fura"]
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  const order = whatsappUrl(
    `Hi ${site.owner}, I'd like to order for Thanksgiving.`,
  );

  return (
    <>
      <ClosedNotice />

      {/* Hero. Dark against a cream site, so arriving here from the bar above
          feels like stepping into a different room of the same house. */}
      <section className="relative overflow-hidden bg-bark text-cream">
        <Leaves fallTo={900} />

        <Container className="relative py-14 sm:py-20 lg:py-24">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/55">
                {site.name} Kpataashie · {promo.eyebrow}
              </p>

              {/* Their own phrase off the flyer, and the best three words on
                  it. The joke is the bird holding the drink; the headline
                  does not need to wink as well. */}
              <h1 className="mt-4 font-display text-6xl font-semibold leading-[0.9] sm:text-7xl lg:text-8xl">
                All the givings.
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/75 sm:text-xl">
                Need a pan or two? {site.owner}’s got you.
              </p>

              {/* The window before the offer, not after it. An early-bird
                  promotion whose dates arrive last is just a discount. */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Window />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/55 sm:text-sm">
                  Early bird
                </span>
              </div>

              <Spent>
                <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-card border border-cream/20 bg-cream/5 p-5">
                    <p className="font-display text-5xl font-semibold leading-none text-pineapple xl:text-6xl">
                      20% off
                    </p>
                    <p className="mt-3 text-sm leading-snug text-cream/70">
                      all food — pans and event quotes
                    </p>
                  </div>
                  <div className="rounded-card border border-cream/20 bg-cream/5 p-5">
                    <p className="font-display text-5xl font-semibold leading-none text-pineapple xl:text-6xl">
                      4th free
                    </p>
                    <p className="mt-3 text-sm leading-snug text-cream/70">
                      buy three drinks, any flavour
                    </p>
                  </div>
                </div>
              </Spent>

              <div className="mt-7">
                <Deadline />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href={order} variant="light" size="lg">
                  Order food on WhatsApp
                </ButtonLink>
                <ButtonLink href="/shop" variant="outline" size="lg" className="border-cream/40 text-cream hover:border-cream hover:bg-cream/10">
                  Shop the fridge
                </ButtonLink>
              </div>
            </div>

            {/* Feet on the bottom edge of the band, so the bird is standing in
                the section rather than floating in it. */}
            <div className="order-first justify-self-center lg:order-none lg:-mb-14 lg:justify-self-end">
              <Image
                src="/images/turkey.webp"
                alt="A turkey raising a hurricane glass of piña colada"
                width={654}
                height={970}
                priority
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 16rem, 12rem"
                className="nod w-48 drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] sm:w-64 lg:w-[22rem]"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* The dates. On a page whose entire pitch is "order early", the day it
          closes is the most important thing on it. */}
      <Band tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <SectionHead
                eyebrow="Order early"
                title="Two weeks to order. Then the kitchen cooks."
                aside={<Window />}
              />
              <p className="prose-measure mt-6 text-lg leading-relaxed text-bark-soft">
                Every pan is cooked to order, so the list shuts before the week
                itself. The offer and the deadline are the same date — there is
                no extension after it.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={order} size="lg">
                  Order on WhatsApp
                </ButtonLink>
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-bark/40 px-6 font-semibold hover:bg-bark/5"
                >
                  {site.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <ol className="flex-1">
                {[
                  {
                    date: "1 November",
                    head: "Orders open",
                    note: "20% off food, every fourth drink free.",
                  },
                  {
                    date: "14 November",
                    head: "Orders close",
                    note: "Last day to get a pan on the list.",
                    loud: true,
                  },
                  {
                    date: "26 November",
                    head: "Thanksgiving",
                    note: "Everything lands before the day.",
                  },
                ].map((row) => (
                  <li
                    key={row.date}
                    className="border-t border-bark/15 py-5 last:border-b"
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                        row.loud ? "text-clay" : "text-bark-faint"
                      }`}
                    >
                      {row.date}
                    </p>
                    <p className="mt-1.5 font-display text-2xl font-semibold">
                      {row.head}
                    </p>
                    <p className="mt-1 text-base text-bark-soft">{row.note}</p>
                  </li>
                ))}
              </ol>

              <Seal
                lines={["Orders", "close", "Nov 14"]}
                className="mt-6 hidden sm:inline-flex"
              />
            </div>
          </div>
        </Container>
      </Band>

      {/* The food. The 20% is the headline offer, so it goes first. */}
      <Band tone="shell">
        <Container>
          <SectionHead
            eyebrow="From the kitchen"
            title="Pans for the table."
            aside={<Offer>20% off</Offer>}
          />

          <ul className="mt-10 grid sm:grid-cols-2 sm:gap-x-14">
            {kpataashieMenu.map((item, i) => (
              <li
                key={item.name}
                className={`border-t border-bark/15 py-5 ${
                  i === kpataashieMenu.length - 1 &&
                  kpataashieMenu.length % 2 === 1
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <p className="font-display text-xl font-semibold">{item.name}</p>
                <p className="mt-1 text-base italic text-bark-soft">
                  {item.dish}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-2 text-base">
            {panServings.map((p) => (
              <div key={p.size} className="flex gap-2">
                <dt className="font-semibold">{p.size}</dt>
                <dd className="text-bark-soft">feeds {p.serves}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 border-l-2 border-clay/40 pl-4 text-base text-bark-soft">
            <span className="font-semibold text-clay">
              {promo.mealDiscountPercent}% off every food order, {promo.window}.
            </span>{" "}
            Pans and event quotes alike, taken off when the order is confirmed.
            Proteins swap; anything off the list is quoted on WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <ButtonLink href={order} size="lg">
              Order on WhatsApp
            </ButtonLink>
            <ArrowLink href="/kpataashie">See the full pan pricing</ArrowLink>
            <ArrowLink href="/events">Feeding a crowd</ArrowLink>
          </div>
        </Container>
      </Band>

      {/* The drinks. Ordered through the cart, where the free bottle comes off
          by itself — so this section sends people to the shop, not WhatsApp. */}
      <Band tone="cream">
        <Container>
          <SectionHead
            eyebrow="From the fridge"
            title="And what goes in the glass."
            aside={<Offer>4th free</Offer>}
          />

          <p className="prose-measure mt-6 text-lg leading-relaxed text-bark-soft">
            Eight piña coladas, the Gold Coast Corn Shake and Fura-liscious.
            Buy three of any flavours and the fourth comes off at checkout, on
            the cheapest bottle in each four.
          </p>

          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-10">
            <ButtonLink href="/shop" size="lg">
              See all ten
            </ButtonLink>
          </div>
        </Container>
      </Band>

      {/* Shipping. The claim is made beside the evidence for it, and no
          arrival date is promised — see the note below. */}
      <Band tone="sand">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <SectionHead eyebrow="Further than the driveway" title="It travels." />
              <p className="prose-measure mt-6 text-lg leading-relaxed text-bark-soft">
                Food and drinks both ship, vacuum sealed. The first out-of-state
                box went to Massachusetts — sent overnight, three days with the
                courier, still intact. Which is why the list closes on the
                fourteenth and not the week of.
              </p>

              <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-2 text-base">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex gap-2">
                    <dt className="font-semibold">{zone.label}</dt>
                    <dd className="text-bark-soft">
                      {zone.feeCents === null
                        ? "quoted by message"
                        : `delivery ${money(zone.feeCents)}`}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7">
                <ArrowLink href="/contact">Ask about your address</ArrowLink>
              </div>
            </div>

            <figure className="lg:w-[22rem] lg:justify-self-end">
              <ShippedClip
                poster="/video/massachusetts-poster.jpg"
                src="/video/massachusetts.mp4"
                music="/audio/log-drum-shaker.m4a"
              />
              <figcaption className="mt-3 text-xs leading-snug text-bark-faint">
                The Massachusetts plate, sped up.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Band>

      {/* The bird again, glass empty. The gag pays off for anyone who got to
          the bottom of the page, which is the only place it belongs. */}
      <section className="relative bg-bark text-cream">
        <Container className="relative py-14 sm:py-16">
          <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-end sm:gap-12 sm:text-left">
            <Image
              src="/images/turkey-done.webp"
              alt="The same turkey, its glass now empty"
              width={633}
              height={951}
              loading="lazy"
              sizes="(min-width: 640px) 13rem, 9rem"
              className="nod w-40 shrink-0 drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] sm:w-60"
            />

            <div className="sm:pb-6">
              <Eyebrow>
                <span className="text-cream/55">
                  {promo.thanksgiving}
                </span>
              </Eyebrow>
              <p className="mt-3 font-display text-4xl font-semibold leading-[0.95] sm:text-5xl">
                Get your order in. He already has.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <Window />
                <span className="text-sm font-semibold text-cream/70">
                  Orders close {promo.ordersClose}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <ButtonLink href={order} variant="light" size="lg">
                  Order on WhatsApp
                </ButtonLink>
                <ButtonLink
                  href="/shop"
                  variant="outline"
                  size="lg"
                  className="border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
                >
                  Shop the fridge
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
