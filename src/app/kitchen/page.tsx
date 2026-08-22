import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { KitchenSignup } from "@/components/forms/KitchenSignup";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kitchen",
  description: `Food is coming to ${site.name}. Join the list to hear first.`,
};

const planned = [
  "Jollof & sides",
  "Grilled tilapia",
  "Waakye bowls",
  "Plantain, three ways",
];

export default function KitchenPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[58vh] items-end overflow-hidden">
        <Image
          src="/images/kitchen.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bark/85 via-bark/35 to-transparent" />
        <Container className="pb-14 text-cream">
          <span className="inline-flex rounded-full bg-pineapple px-3 py-1 text-xs font-bold uppercase tracking-widest text-bark">
            In development
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold sm:text-6xl">
            {site.name} Kitchen
          </h1>
          <p className="mt-4 max-w-md text-lg text-cream/80">
            Food is next. No date yet — this list hears first.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-xl">
          <KitchenSignup />
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-card border border-bark/15 bg-bark/15 sm:grid-cols-2 lg:grid-cols-4">
          {planned.map((item) => (
            <li
              key={item}
              className="bg-cream p-6 font-display text-lg font-semibold"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bark/10 pt-8">
          <p className="font-display text-xl font-semibold">
            Catering something before then?
          </p>
          <ButtonLink href="/events">See event packages</ButtonLink>
        </div>
      </Container>
    </>
  );
}
