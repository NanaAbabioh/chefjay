import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark-faint">
      {children}
    </p>
  );
}

/**
 * Full-bleed section with the house vertical rhythm.
 *
 * The page used to be one unbroken sheet of cream, which reads as a single
 * long scroll rather than a sequence of rooms. Alternating the tone between
 * sections is what gives a page its pacing — `shell` and `sand` exist in the
 * palette for exactly this and were going unused.
 */
type Tone = "cream" | "shell" | "sand";

const tones: Record<Tone, string> = {
  cream: "bg-cream",
  shell: "bg-shell",
  sand: "bg-sand",
};

export function Band({
  tone = "cream",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${tones[tone]} py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

/**
 * Eyebrow + heading, with an optional note sitting on the same baseline.
 *
 * Headings sit at 36/48px on a 0.95 leading: large enough to open a section
 * rather than label it. The eyebrow does the explaining so the heading can
 * stay short.
 */
export function SectionHead({
  eyebrow,
  title,
  aside,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-3 ${className}`}
    >
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2
          className={`font-display text-4xl font-semibold leading-[0.95] sm:text-5xl ${
            eyebrow ? "mt-3" : ""
          }`}
        >
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}
