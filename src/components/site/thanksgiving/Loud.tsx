import { promo } from "@/lib/promo";

/**
 * The date window, as a filled chip.
 *
 * Two things have to survive a skim: the discount and the fortnight it runs
 * in. The second is the one fact on the page that is worthless the day after
 * it matters, so it is set as a label and repeated in every band rather than
 * left inside a sentence to be scrolled past.
 *
 * One style, light or dark band — pineapple on bark ink clears contrast on
 * cream, shell, sand and the dark hero alike.
 */
export function Window({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-pineapple px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-bark sm:text-sm ${className}`}
    >
      {promo.windowShort}
    </span>
  );
}

/**
 * A band's offer, in the two words it takes.
 *
 * Sits in `SectionHead`'s aside so every section opens with the number rather
 * than reaching it three lines into a paragraph.
 */
export function Offer({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="font-display text-4xl font-semibold text-clay sm:text-5xl">
        {children}
      </p>
      <Window />
    </div>
  );
}
