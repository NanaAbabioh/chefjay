import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { KitchenSignup } from "@/components/forms/KitchenSignup";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kitchen",
  description: `Food is coming to ${site.name}. Join the list to hear first.`,
};

const planned = [
  {
    name: "Jollof & sides",
    note: "Party trays for the same events we already pour at.",
  },
  {
    name: "Grilled tilapia",
    note: "Whole fish, pepper sauce, done on the day.",
  },
  {
    name: "Waakye bowls",
    note: "Single-serve, for the lunch crowd.",
  },
  {
    name: "Plantain, three ways",
    note: "Kelewele, tatale, and plain fried for the children.",
  },
];

export default function KitchenPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-pineapple px-3 py-1 text-xs font-bold uppercase tracking-widest text-bark">
          In development
        </span>
        <h1 className="mt-6 font-display text-5xl font-semibold sm:text-6xl">
          {site.name} Kitchen
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-bark-soft">
          We started with drinks because drinks are what we know. Food is next —
          the same small-batch approach, built for the parties we already cater.
          No launch date yet. When there is one, this list hears first.
        </p>
        <div className="mx-auto mt-10 max-w-xl">
          <KitchenSignup />
        </div>
      </div>

      <div className="mt-20">
        <Eyebrow>What we are working on</Eyebrow>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {planned.map((item) => (
            <div
              key={item.name}
              className="rounded-card border border-dashed border-bark/25 bg-shell p-6"
            >
              <h2 className="font-display text-xl font-semibold">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-bark-soft">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-card bg-bark px-8 py-12 text-center text-cream sm:px-14">
        <h2 className="font-display text-3xl font-semibold">
          Catering an event before then?
        </h2>
        <p className="prose-measure mx-auto mt-3 text-cream/75">
          The drinks side is running now, and we work alongside caterers all the
          time. Tell us your date and we will fit around them.
        </p>
        <div className="mt-8">
          <ButtonLink href="/events" variant="light" size="lg">
            See event packages
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
