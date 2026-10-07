import type { Metadata } from "next";
import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/Section";
import { SubscribePicker } from "@/components/subscribe/SubscribePicker";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "A standing order of piña colada — two or four bottles, weekly or fortnightly, from $4 a bottle. Delivered across New Jersey and New York.",
};

/** Answers the questions a standing order raises, before they are asked. */
const terms: [string, string][] = [
  ["Billing", "Monthly, settled with Chef Jay. No card stored on the site."],
  [
    "Bottle size",
    "Plan prices are for 8 oz bottles. Ask when you start if you would rather have 12 oz.",
  ],
  ["Flavours", "Chosen each month. Change them whenever you like."],
  ["Delivery", `${site.serviceArea}. We agree a day that suits you.`],
  ["Pausing", "Skip a month or stop entirely — just say so before the next drop."],
  [
    "Opening offer",
    "The free fourth bottle is a shop offer. Subscriptions are priced separately and do not stack with it.",
  ],
];

export default function SubscribePage() {
  return (
    <>
      <section className="relative flex min-h-[46vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/promo-opening.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-transparent" />
        </div>
        <Container className="relative pb-14 pt-24">
          <Eyebrow>Monthly subscription</Eyebrow>
          <h1 className="mt-3 max-w-xl font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">
            A constant pour of piña colada.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-bark-soft sm:text-xl">
            A standing order of drinks at your door.
          </p>
        </Container>
      </section>

      <Container className="py-20 sm:py-28">
        <SubscribePicker />

        <dl className="mt-16 grid gap-x-12 gap-y-5 border-t border-bark/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {terms.map(([term, detail]) => (
            <div key={term} className="border-t border-bark/15 pt-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-bark-faint">
                {term}
              </dt>
              <dd className="mt-1.5 text-bark-soft">{detail}</dd>
            </div>
          ))}
        </dl>

        {/* Said plainly rather than in a footnote: someone signing up during
            the opening fortnight should not discover later that they were
            buying under different terms from the shop. */}
        <p className="mt-10 text-base text-bark-faint">
          Subscriptions start with the grand opening and carry on after it.
        </p>
      </Container>
    </>
  );
}
