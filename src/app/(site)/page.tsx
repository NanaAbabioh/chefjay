import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
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

      {/* Two paths */}
      <section className="py-20 sm:py-24">
        <Container>
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
      </section>

      {/* Lineup */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            The lineup
          </h2>
          {/* All of them. A link to the rest is too easy to miss, and there is
              room on the page to simply show the lot. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drinks.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Kpataashie */}
      <section className="pb-20 sm:pb-24">
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
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-pineapple">
                Now serving from the
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Kpataashie
              </h2>
              <p className="mt-2 text-cream/75">
                Jollof, fried rice, goat soups.
              </p>
            </div>
          </Link>
        </Container>
      </section>
    </>
  );
}
