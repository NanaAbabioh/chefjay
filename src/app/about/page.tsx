import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { DrinkGlass } from "@/components/product/DrinkGlass";
import { getProduct } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} exists, what goes in the bottle, and what does not.`,
};

const signature = getProduct("house-signature")!;

const principles = [
  {
    title: "Fruit, not concentrate",
    body: "Every batch starts with whole fruit we press ourselves. It costs more and it is slower, and it is the only reason the drink tastes like anything.",
  },
  {
    title: "Sweet enough, no sweeter",
    body: "Dates and ripe fruit do the work. If a blend needs sugar to be drinkable, the fruit was not good enough that week and we do not run it.",
  },
  {
    title: "Small batches, honestly small",
    body: "We make what we can sell fresh. Sometimes that means a flavor sells out by Friday. We would rather that than a fridge of week-old bottles.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-bark/10 bg-shell py-16 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1] sm:text-6xl">
              It started with a drink nobody could name.
            </h1>
            <p className="prose-measure mt-6 text-lg leading-relaxed text-bark-soft">
              People kept calling it a piña colada because that was the closest
              thing they had a word for. It is not, quite. The coconut and
              pineapple are there, but so is tiger nut — atadwe, the tuber that
              has been pressed into milk in West Africa for centuries — and that
              is what gives it the body people cannot place.
            </p>
            <p className="prose-measure mt-4 text-lg leading-relaxed text-bark-soft">
              So we kept the familiar name on the front of the bottle and put the
              real story on the back. That is the whole business, honestly:
              something you already recognise, made properly, with one ingredient
              you probably have not met yet.
            </p>
          </div>

          <div
            className="flex justify-center rounded-card p-10"
            style={{
              background: `radial-gradient(80% 70% at 50% 15%, ${signature.pour.top}, ${signature.pour.bottom}55)`,
            }}
          >
            <DrinkGlass
              id="about-hero"
              top={signature.pour.top}
              bottom={signature.pour.bottom}
              className="h-72 w-auto sm:h-80"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <Eyebrow>How we work</Eyebrow>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title}>
                <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-bark-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-bark/10 bg-palm py-16 text-cream sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <h2 className="font-display text-4xl font-semibold">
              A word about tiger nut.
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-cream/80">
              <p>
                Tiger nut is not a nut. It is a small tuber — atadwe in Ghana,
                chufa in Spain, kunun aya in Nigeria — and it is safe for people
                with tree-nut allergies.
              </p>
              <p>
                Soaked overnight and pressed, it gives a milk with real weight to
                it and a faint sweetness that means we can use far less sugar
                everywhere else. It is the reason our drinks are creamy without
                dairy and without anything thickened in a lab.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="text-center">
          <h2 className="font-display text-4xl font-semibold">
            Come try the one people cannot name.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop the drinks
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline">
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
