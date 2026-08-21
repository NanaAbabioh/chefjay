import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { EventsPlanner } from "@/components/forms/EventsPlanner";
import { DrinkGlass } from "@/components/product/DrinkGlass";
import { drinks } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events & Bulk",
  description:
    "Drink dispensers, bottle drops and attended stations for parties, weddings, offices and community events.",
};

const faqs = [
  {
    q: "How far ahead do you need to know?",
    a: `${site.eventLeadTimeDays} days for most events, so we can buy and press fruit for you specifically. Ask anyway if it is sooner — if the fruit is in the building, we will usually say yes.`,
  },
  {
    q: "How much drink is enough?",
    a: "Plan on two 12 oz servings per guest for a two-hour event, three if it is outdoors in summer. We will do this maths with you on the phone and would rather you did not over-order.",
  },
  {
    q: "Can we add alcohol?",
    a: "We do not serve alcohol, but the Classic Piña Colada is built to take rum and we can supply it unsweetened as a mixer base for your own bar.",
  },
  {
    q: "What about allergies?",
    a: "Everything is dairy-free. Tiger nut is a tuber, not a nut, so it is safe for tree-nut allergies. Tell us on the form and we will send a full ingredient list for your guests.",
  },
  {
    q: "Do you deliver outside the city?",
    a: `We cover ${site.serviceArea} as standard. Further out is usually possible with a travel fee — put the venue on the form and we will price it.`,
  },
  {
    q: "What if the numbers change?",
    a: "Tell us up to 48 hours before and we will adjust with no penalty. After that we will have already pressed, so the original quantity stands.",
  },
];

export default function EventsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-bark/10 bg-palm text-cream">
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pineapple">
              Events & bulk orders
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.98] sm:text-6xl">
              You handle the guests.
              <br />
              We handle the pour.
            </h1>
            <p className="prose-measure mt-6 text-lg leading-relaxed text-cream/75">
              From a dozen bottles dropped at a backyard birthday to an attended
              station at a 150-person wedding. We deliver, set up, and come back
              for the empties.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#quote" variant="light" size="lg">
                Get a free quote
              </ButtonLink>
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center rounded-full border border-cream/35 px-8 py-4 font-semibold hover:bg-cream/10"
              >
                Or call {site.phone}
              </a>
            </div>
          </div>

          <div className="flex items-end justify-center gap-2 opacity-95">
            {drinks.slice(0, 4).map((d, i) => (
              <DrinkGlass
                key={d.slug}
                id={`events-${d.slug}`}
                top={d.pour.top}
                bottom={d.pour.bottom}
                garnish={i === 1}
                className={i % 2 === 0 ? "h-40 w-auto sm:h-48" : "h-52 w-auto sm:h-64"}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Eyebrow>Pick a starting point</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            Four packages. All of them adjustable.
          </h2>
          <p className="prose-measure mt-4 text-bark-soft">
            These are the shapes most events take. Choose the closest one and we
            will move the pieces around to fit yours — nothing here is fixed.
          </p>

          <div className="mt-12">
            <EventsPlanner />
          </div>
        </Container>
      </section>

      <section className="border-t border-bark/10 bg-shell py-16 sm:py-24">
        <Container>
          <Eyebrow>Before you ask</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-semibold">
            The questions we get most.
          </h2>
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-lg font-semibold">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-bark-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
