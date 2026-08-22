import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { EventsPlanner } from "@/components/forms/EventsPlanner";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events & Bulk",
  description:
    "Drink dispensers, bottle drops and attended stations for parties, weddings, offices and community events.",
};

/**
 * Logistics, not marketing. No photograph can answer these, and people will not
 * spend on an event without them — so they stay, compressed into specs rather
 * than paragraphs.
 */
const facts: [string, string][] = [
  ["Lead time", `${site.eventLeadTimeDays} days. Ask anyway if it's sooner.`],
  ["How much", "Two 12 oz servings per guest, per two hours."],
  ["Alcohol", "None served. The Classic works as a rum base."],
  ["Allergies", "All dairy-free. Tiger nut is a tuber, not a nut."],
  ["Delivery", `${site.serviceArea}. Further out for a travel fee.`],
  ["Changes", "Free up to 48 hours before."],
];

export default function EventsPage() {
  return (
    <>
      <section className="relative flex min-h-[62vh] items-end overflow-hidden">
        {/* Backdrop in its own positioned wrapper: painting follows DOM

            order, so no negative z-index can drop it behind the body. */}

        <div className="absolute inset-0">

          <Image
            src="/images/event-table.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/40 to-bark/10" />

        </div>

        <Container className="relative pb-14 text-cream">
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[0.98] sm:text-6xl">
            You handle the guests.
            <br />
            We handle the pour.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#quote" variant="light" size="lg">
              Get a quote
            </ButtonLink>
            <a
              href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center rounded-full border border-cream/40 px-8 py-4 font-semibold hover:bg-cream/10"
            >
              {site.phone}
            </a>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Pick a starting point.
          </h2>
          <div className="mt-10">
            <EventsPlanner />
          </div>
        </Container>
      </section>

      <section className="border-t border-bark/10 bg-shell py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold">Good to know</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map(([term, detail]) => (
              <div key={term} className="border-t border-bark/15 pt-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-bark-faint">
                  {term}
                </dt>
                <dd className="mt-1.5 text-bark-soft">{detail}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
