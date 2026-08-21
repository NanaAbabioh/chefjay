import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${site.name} by phone, WhatsApp or email. ${site.hours}.`,
};

const tel = site.phone.replace(/[^\d+]/g, "");

const channels = [
  {
    label: "WhatsApp",
    value: "Fastest — usually within the hour",
    href: `https://wa.me/${site.whatsapp}`,
    external: true,
  },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${tel}`,
    external: false,
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
];

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold sm:text-6xl">
            Talk to a person.
          </h1>
          <p className="prose-measure mt-5 text-lg leading-relaxed text-bark-soft">
            There is no support queue here — messages come to the same people who
            press the fruit. For anything time-sensitive, WhatsApp is the fastest
            way to reach us.
          </p>

          <ul className="mt-10 space-y-3">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center justify-between gap-4 rounded-card border border-bark/15 bg-shell px-6 py-5 transition-colors hover:border-bark/40"
                >
                  <span>
                    <span className="block font-display text-xl font-semibold">
                      {c.label}
                    </span>
                    <span className="text-sm text-bark-soft">{c.value}</span>
                  </span>
                  <span className="text-xl text-clay" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card bg-shell p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold">The details</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="font-semibold">Hours</dt>
              <dd className="mt-1 text-bark-soft">{site.hours}</dd>
            </div>
            <div>
              <dt className="font-semibold">Based in</dt>
              <dd className="mt-1 text-bark-soft">{site.city}</dd>
            </div>
            <div>
              <dt className="font-semibold">Delivery area</dt>
              <dd className="mt-1 text-bark-soft">
                {site.serviceArea}. Further out is usually possible with a travel
                fee — ask.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Event notice</dt>
              <dd className="mt-1 text-bark-soft">
                {site.eventLeadTimeDays} days for most events. Ask anyway if it is
                sooner.
              </dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-bark/15 pt-6">
            <p className="text-sm text-bark-soft">
              Planning something with a guest list?{" "}
              <Link
                href="/events"
                className="font-semibold text-clay underline underline-offset-4"
              >
                Use the quote form
              </Link>{" "}
              instead — it asks the things we would ask anyway.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
