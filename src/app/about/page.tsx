import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} exists, what goes in the bottle, and what does not.`,
};

const principles: [string, string][] = [
  ["Fruit, not concentrate", "Pressed here, every batch. Slower and dearer."],
  ["Sweet enough, no sweeter", "Dates and ripe fruit do the work."],
  ["Honestly small batches", "Flavors sell out. We prefer that to old stock."],
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-bark/10">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 sm:py-20">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1] sm:text-6xl">
              A drink nobody
              <br />
              could name.
            </h1>
            <p className="prose-measure mt-6 text-lg leading-relaxed text-bark-soft">
              People call it a piña colada because it&rsquo;s the closest word
              they have. Coconut and pineapple are there — but so is tiger nut,
              and that&rsquo;s the body they can&rsquo;t place.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-shell">
            <Image
              src="/images/house-signature.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <dl className="grid gap-8 md:grid-cols-3">
            {principles.map(([title, body]) => (
              <div key={title} className="border-t border-bark/15 pt-4">
                <dt className="font-display text-xl font-semibold">{title}</dt>
                <dd className="mt-2 text-bark-soft">{body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Kept in full: this is allergy information, not marketing. */}
      <section className="bg-palm py-16 text-cream">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <h2 className="font-display text-4xl font-semibold">
            A word about tiger nut.
          </h2>
          <p className="text-lg leading-relaxed text-cream/80">
            It isn&rsquo;t a nut. It&rsquo;s a small tuber — atadwe in Ghana,
            chufa in Spain — and it&rsquo;s safe for people with tree-nut
            allergies. Soaked and pressed, it gives a milk with real weight,
            which is why our drinks are creamy without dairy.
          </p>
        </Container>
      </section>

      <section className="py-16 text-center">
        <Container>
          <ButtonLink href="/shop" size="lg">
            Shop the fridge
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
