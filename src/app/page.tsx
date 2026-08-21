import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { DrinkGlass } from "@/components/product/DrinkGlass";
import { ProductCard } from "@/components/product/ProductCard";
import { drinks, products } from "@/lib/catalog";
import { site } from "@/lib/site";

const featured = products.filter((p) => p.featured);

const claims = [
  "Pressed, never from concentrate",
  "Dairy-free by default",
  "Blended weekly in small batches",
  "Real tiger nut, soaked overnight",
  "No syrups, no powders",
];

const steps = [
  {
    n: "01",
    title: "Pick your pour",
    body: "Single bottles for the week, jugs for the fridge, dispensers for the room.",
  },
  {
    n: "02",
    title: "Tell us when",
    body: `Same-day on bottles. Events need ${site.eventLeadTimeDays} days so we can press fruit for you.`,
  },
  {
    n: "03",
    title: "We confirm by hand",
    body: "A real person checks every order and messages you back before anything is charged.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(90% 70% at 78% 12%, #F7D9A6 0%, #FBEBD3 38%, #FDF8EF 72%)",
          }}
        />
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-rise">
            <Eyebrow>Small batch · {site.city}</Eyebrow>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
              Piña colada,
              <br />
              <span className="text-clay">grown up.</span>
            </h1>
            <p className="prose-measure mt-6 text-lg leading-relaxed text-bark-soft">
              Coconut, mango, pineapple and tiger nut — pressed and blended in
              small batches. Buy a bottle for the walk home, or a dispenser for
              two hundred people.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop the bottles
              </ButtonLink>
              <ButtonLink href="/events" size="lg" variant="outline">
                Order for an event
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-bark-faint">
              Free delivery over $50 across {site.serviceArea}.
            </p>
          </div>

          {/* Three glasses, overlapping so they read as one group shot */}
          <div className="relative flex min-w-0 items-end justify-center">
            {featured.map((p, i) => (
              <DrinkGlass
                key={p.slug}
                id={`hero-${p.slug}`}
                top={p.pour.top}
                bottom={p.pour.bottom}
                garnish={i === 1}
                className={
                  i === 1
                    ? "relative z-10 h-64 w-auto animate-rise sm:h-80"
                    : `h-48 w-auto animate-rise sm:h-60 ${i === 0 ? "-mr-5" : "-ml-5"}`
                }
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Claims strip */}
      <section className="border-y border-bark/10 bg-bark py-4 text-cream">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 text-center">
          {claims.map((claim) => (
            <span
              key={claim}
              className="text-xs font-medium uppercase tracking-[0.16em] text-cream/70"
            >
              {claim}
            </span>
          ))}
        </div>
      </section>

      {/* The two paths — the whole point of the site */}
      <section className="py-20 sm:py-28">
        <Container>
          <Eyebrow>Two ways to order</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            However many people you are feeding.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-card border border-bark/10 bg-shell p-8 transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(36,26,18,0.5)] sm:p-10"
            >
              <span className="inline-flex rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-widest text-bark-soft">
                For one, or a few
              </span>
              <h3 className="mt-6 font-display text-3xl font-semibold">
                By the bottle
              </h3>
              <p className="prose-measure mt-3 text-bark-soft">
                Six blends, three sizes. Grab a 12 oz for now or a 64 oz jug that
                lives in your fridge all week. Same-day delivery across the city.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-clay">
                Browse the drinks
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>

            <Link
              href="/events"
              className="group relative overflow-hidden rounded-card border border-transparent bg-palm p-8 text-cream transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(30,70,56,0.9)] sm:p-10"
            >
              <span className="inline-flex rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream/80">
                For a crowd
              </span>
              <h3 className="mt-6 font-display text-3xl font-semibold">
                By the dispenser
              </h3>
              <p className="prose-measure mt-3 text-cream/75">
                Birthdays, weddings, launches, church socials. We deliver, set up,
                pour if you want us to, and come back for the empties.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-pineapple">
                Get an event quote
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured drinks */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>The lineup</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                Start with these three.
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-semibold text-clay underline underline-offset-4"
            >
              All {drinks.length} blends →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-bark/10 bg-shell py-20 sm:py-24">
        <Container>
          <Eyebrow>How ordering works</Eyebrow>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-display text-5xl font-semibold text-sand">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-bark-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Kitchen teaser */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="overflow-hidden rounded-card bg-bark px-8 py-14 text-cream sm:px-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="inline-flex rounded-full bg-pineapple px-3 py-1 text-xs font-bold uppercase tracking-widest text-bark">
                  Coming soon
                </span>
                <h2 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">
                  {site.name} Kitchen
                </h2>
                <p className="prose-measure mt-4 text-lg leading-relaxed text-cream/75">
                  The food is next. Jollof, grilled tilapia, waakye, plantain —
                  built for the same events we already pour at. Put your name
                  down and you will hear before anyone else.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <ButtonLink href="/kitchen" variant="light" size="lg">
                  Join the list
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
