import Image from "next/image";
import Link from "next/link";
import { Band, Container, Seal, SectionHead } from "@/components/ui/Section";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { PromoGate } from "@/components/site/Promo";
import { Testimonial } from "@/components/site/Testimonial";
import { ShippedClip } from "@/components/site/ShippedClip";
import { QuoteAudio } from "@/components/site/QuoteAudio";
import { promo } from "@/lib/promo";
import { ProductCard } from "@/components/product/ProductCard";
import { drinks } from "@/lib/catalog";
import { site } from "@/lib/site";

/** The two order paths, which are the whole point of the site. */
const paths = [
  {
    href: "/shop",
    image: "/images/event-bottles.jpg",
    label: "For one, or a few",
    title: "By the cup",
  },
  {
    href: "/events",
    image: "/images/event-dispensers.jpg",
    label: "For a crowd",
    title: "By the dispenser",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero — the photograph carries this, so the copy stays out of its way */}
      <section className="relative flex min-h-[86svh] items-stretch overflow-hidden sm:min-h-[78vh] sm:items-center">
        {/* Backdrop in its own positioned wrapper: painting follows DOM

            order, so no negative z-index can drop it behind the body. */}

        <div className="absolute inset-0">

          {/* Narrow screens crop hard into this landscape frame, so the crop
              is biased downwards to keep the foot of the glass in shot. */}
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_62%] sm:object-center"
          />
          {/* Phones get a vertical scrim (text sits above the glass); wider

              screens get the original left-to-right one. */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream/85 via-cream/45 via-42% to-transparent to-88% sm:bg-gradient-to-r sm:from-cream sm:from-15% sm:via-cream/80 sm:via-40% sm:to-transparent sm:to-72%" />

        </div>

        <Container className="relative flex w-full">
          {/* On phones the headline sits at the top and the buttons around the
              base of the glass, so the drink stands full height between them.
              From `sm` up it goes back to one centred block. */}
          <div className="flex w-full max-w-lg animate-rise flex-col pb-5 pt-11 sm:block sm:pb-0 sm:pt-0">
            <h1 className="font-display text-5xl font-semibold leading-[0.95] sm:text-7xl">
              Piña colada,
              <br />
              {/* From site.ts, never hardcoded. `owner` rather than `name`:
                  the hero reads "by Chef Jay", not "by Chef Jay's". */}
              <span className="text-clay">by {site.owner}</span>
            </h1>
            {/* Stacked on phones. A fit-content grid sizes both to the wider
                label, so they match without stretching across the screen. */}
            <div className="mt-auto grid w-fit gap-3 pt-10 sm:mt-0 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:pt-8">
              <ButtonLink href="/shop" size="lg">
                Shop the fridge
              </ButtonLink>
              <ButtonLink
                href="/events"
                size="lg"
                variant="outline"
                className="bg-cream/70 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              >
                Order for an event
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Grand opening. Lives between the hero and the two paths so it is the
          first thing after the headline, and disappears on its own when the
          dates run out. */}
      <PromoGate>
        <Band tone="sand">
          <Container>
            {/* The photograph was shot for this: drink on the right, bare wall
                on the left. The words stay words — on a phone they sit under
                the image, and from `sm` up they move onto the wall the picture
                left empty for them. */}
            <div className="overflow-hidden rounded-card bg-cream sm:relative">
              <div className="relative aspect-[16/9] sm:aspect-auto sm:absolute sm:inset-0">
                <Image
                  src="/images/promo-opening.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 640px) 90vw, 100vw"
                  className="object-cover object-right"
                />
              </div>

              <div className="relative p-7 sm:mr-auto sm:flex sm:min-h-[26rem] sm:w-[52%] sm:flex-col sm:justify-center sm:p-14">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-clay sm:text-base">
                  {promo.eyebrow} · {promo.window}
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold leading-[0.95] sm:text-5xl">
                  {promo.heading}
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-bark-soft sm:text-xl">
                  {promo.body}
                </p>
                <div className="mt-7">
                  <ButtonLink href="/shop" size="lg">
                    Shop the fridge
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </Band>
      </PromoGate>

      {/* Two paths */}
      <Band tone="shell">
        <Container>
          <SectionHead
            eyebrow="Two ways to order"
            title="However many you are"
            className="mb-10"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {paths.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group relative aspect-[3/2] overflow-hidden rounded-card"
              >
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark/75 via-bark/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-cream">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">
                    {p.label}
                  </p>
                  <h2 className="mt-1.5 font-display text-3xl font-semibold">
                    {p.title}
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Band>

      {/* Lineup */}
      <Band>
        <Container>
          <SectionHead
            eyebrow="Eight coladas, and two from home"
            title="The lineup"
            aside={
              <p className="text-base text-bark-faint">
                Every drink in 8 oz or 12 oz
              </p>
            }
          />
          {/* All of them. A link to the rest is too easy to miss, and there is
              room on the page to simply show the lot. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drinks.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </Band>

      {/* What people say. Sits after the lineup: by here someone has seen the
          drinks and the prices, and the question left is whether anyone else
          rates them. */}
      <Band tone="shell">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Testimonial
              poster="/video/testimonials-poster.jpg"
              src="/video/testimonials.mp4"
              label="Play the customer clip, one minute"
            />
            <div>
              <SectionHead
                eyebrow="From our customers"
                title="Don't take our word for it."
              />
              <p className="mt-5 max-w-md text-lg leading-relaxed text-bark-soft">
                A minute of customers with a bottle in hand and a plate in
                front of them, at parties and at home, on the drinks and the
                cooking both.
              </p>
              {/* Both halves of the business are in the clip, so both are
                  reachable from under it. */}
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="/shop" size="lg">
                  Shop the fridge
                </ButtonLink>
                <ArrowLink href="/kpataashie">See the Kpataashie menu</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </Band>

      {/* Out of state. Straight after the testimonials, because it is the same
          argument carried one step further: not only do people rate it, one of
          them is three hundred miles away. */}
      <Band>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <SectionHead
                eyebrow="New Jersey → Massachusetts"
                title="It travels now."
              />
              <p className="mt-5 max-w-md text-lg leading-relaxed text-bark-soft">
                The food leaves here vacuum-sealed and the bottles travel cold.
                The first box to go out of state went to a customer in
                Massachusetts — that is her plate, start to finish.
              </p>

              {/* Her words, not ours. The short one carries the feeling and
                  the long one carries the claim, so both earn their place. */}
              <figure className="mt-9 border-l-2 border-clay/40 pl-6">
                <blockquote>
                  <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                    &ldquo;Tastes like home.&rdquo;
                  </p>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-bark-soft">
                    &ldquo;I live in Massachusetts and this was mailed to me.
                    Vacuum sealed and it came perfectly.&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-4 text-sm text-bark-faint">
                  A customer in Massachusetts, on the first box we sent out of
                  state
                </figcaption>
                {/* The same fourteen seconds, as sound. The words are already
                    set in type above it, so they caption themselves. */}
                <div className="mt-5">
                  <QuoteAudio src="/audio/massachusetts-quote.m4a">
                    Hear her say it
                  </QuoteAudio>
                </div>
              </figure>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="/shop" size="lg">
                  Shop the fridge
                </ButtonLink>
                <ArrowLink href="/contact">Ask about your address</ArrowLink>
              </div>
              {/* Matches what the cart actually does outside the two zones, so
                  nobody reaches checkout expecting a number that isn't there. */}
              <p className="mt-6 max-w-md text-sm leading-relaxed text-bark-faint">
                New Jersey and New York have a set delivery fee. Anywhere else,
                {" "}
                {site.owner} works the shipping out with you and confirms it
                before the order goes anywhere.
              </p>
            </div>

            {/* Two recordings of the same delivery, so they sit as a pair and
                each says underneath what it is. On a phone they lead and the
                headline follows; side by side they go back to the right. */}
            <div className="order-first grid grid-cols-2 gap-4 sm:gap-5 lg:order-none lg:w-[30rem]">
              <figure>
                <ShippedClip
                  poster="/video/massachusetts-poster.jpg"
                  src="/video/massachusetts.mp4"
                  music="/audio/log-drum-shaker.m4a"
                />
                <figcaption className="mt-3 text-xs leading-snug text-bark-faint">
                  Her plate, sped up.
                </figcaption>
              </figure>
              <figure>
                <Testimonial
                  poster="/video/massachusetts-review-poster.jpg"
                  src="/video/massachusetts-review.mp4"
                  label="Play her review, about a minute and three quarters"
                  aspect="aspect-[9/16]"
                />
                <figcaption className="mt-3 text-xs leading-snug text-bark-faint">
                  Watch her review on the meals and every flavour of piña
                  colada.
                </figcaption>
              </figure>

              {/* The best thing that happened to this delivery was that it
                  went wrong. A stamp alone would state it without saying
                  what it means, so the sentence sits next to it — and that
                  way the claim is also there for anyone whose browser is
                  reading the page aloud. */}
              <div className="col-span-2 mt-6 flex items-center gap-4">
                <Seal lines={["Delayed", "three days", "still fresh"]} />
                <p className="text-xs leading-relaxed text-bark-faint">
                  Her box was sent overnight. The courier took three days, and
                  it still arrived cold and sealed.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Band>

      {/* Kpataashie */}
      <Band tone="sand">
        <Container>
          <Link
            href="/kpataashie"
            className="group relative block aspect-[16/9] overflow-hidden rounded-card sm:aspect-[21/9]"
          >
            <Image
              src="/images/kpataashie.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bark/80 via-bark/40 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-8 text-cream sm:p-12">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cream/70">
                Now serving from the
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Kpataashie
              </h2>
              {/* The gloss only, not the pronunciation — that belongs on the
                  page itself, and repeating it here would wear thin. */}
              <p className="mt-1 text-sm text-cream/55">Ga for kitchen</p>
              <p className="mt-2 text-cream/75">
                Jollof, fried rice, goat soups.
              </p>
            </div>
          </Link>
        </Container>
      </Band>
    </>
  );
}
