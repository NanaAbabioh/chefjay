import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Container } from "@/components/ui/Section";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-bark text-cream">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-cream" />
            <p className="prose-measure mt-4 text-sm leading-relaxed text-cream/70">
              {site.description}
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-cream/50">
              Explore
            </h2>
            <ul className="mt-2 text-sm sm:mt-4 sm:space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-cream/80 hover:text-pineapple sm:min-h-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center text-cream/80 hover:text-pineapple sm:min-h-0"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-cream/50">
              Find us
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
              <li>{site.city}</li>
              <li>{site.hours}</li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex min-h-11 items-center hover:text-pineapple sm:min-h-0"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center hover:text-pineapple sm:min-h-0"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Serving {site.serviceArea}.</p>
        </div>
      </Container>
    </footer>
  );
}
