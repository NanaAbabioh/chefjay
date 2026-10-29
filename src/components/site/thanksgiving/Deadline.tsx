"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { daysUntil, promo, promoPhase, type Phase } from "@/lib/promo";

/** The offer never opens or closes mid-visit, so there is nothing to
 *  subscribe to — the snapshot is read once on the client and left alone. */
const noop = () => () => {};

/** What the server renders: the date, with no day count against it. */
const PENDING = "pending";

/**
 * Phase and the days to whichever date matters in it, as one string.
 *
 * `useSyncExternalStore` compares snapshots by identity, so a function that
 * built a fresh `{ phase, days }` object on every call would re-render
 * forever. A string compares by value and costs one `split`.
 *
 * Before the offer opens the date that matters is the opening, and it is the
 * real `startsOn` rather than the advertised one: the offer is deliberately
 * switched on a day early, and counting to the advertised date would have the
 * page saying "opens tomorrow" on a day the discount is already working.
 */
function snapshot(): string {
  const phase = promoPhase();
  return `${phase}:${daysUntil(phase === "before" ? promo.startsOn : promo.endsOn)}`;
}

function useOffer(): { phase: Phase | typeof PENDING; days: number } {
  const snap = useSyncExternalStore(noop, snapshot, () => PENDING);
  if (snap === PENDING) return { phase: PENDING, days: 0 };
  const [phase, days] = snap.split(":");
  return { phase: phase as Phase, days: Number(days) };
}

function note(phase: Phase, days: number): string {
  if (phase === "closed") return "closed";
  if (phase === "before") return days === 1 ? "opens tomorrow" : `opens in ${days} days`;
  if (days === 0) return "last day";
  if (days === 1) return "closes tomorrow";
  return `${days} days left`;
}

/**
 * The closing date, and how long is left against it.
 *
 * Read on the client for the same reason `PromoGate` is: most of this site is
 * prerendered at deploy time, and a day count baked at build would be wrong
 * by however long the deployment has been up — the one number on the page
 * nobody would think to doubt.
 *
 * The server renders the date alone, which is true in every phase. The client
 * then adds the count to the end of the same line, so the upgrade changes
 * words rather than the shape of the page and nothing jumps.
 */
export function Deadline() {
  const { phase, days } = useOffer();

  return (
    <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream sm:text-base">
      <span>Orders close {promo.ordersClose}</span>
      {phase !== PENDING && (
        // The separator travels with the words it separates. Left as its own
        // flex item it would be stranded at the end of the first line every
        // time the pill wrapped, which on a phone is every time.
        <span className={phase === "closed" ? "text-cream/60" : "text-pineapple"}>
          <span aria-hidden className="pr-3 text-cream/35">
            ·
          </span>
          {note(phase, days)}
        </span>
      )}
    </p>
  );
}

/**
 * Dims what it wraps once the window has shut.
 *
 * The notice at the top of the page says the offer has closed; two large
 * numbers underneath it still shouting the discount say the opposite, and a
 * page that contradicts itself is read as the more flattering of the two.
 * Dimming rather than removing keeps the page describing what ran, which is
 * what someone arriving late is trying to find out.
 */
export function Spent({ children }: { children: ReactNode }) {
  const { phase } = useOffer();
  return (
    <div className={phase === "closed" ? "opacity-40 saturate-50" : undefined}>
      {children}
    </div>
  );
}

/**
 * Shown only once the window has shut.
 *
 * The page is meant to be deleted on the fourteenth, but a page that is still
 * up after its offer has ended must not keep selling it. Everything else here
 * stays readable; this is the one thing that has to change.
 */
export function ClosedNotice() {
  const { phase } = useOffer();
  if (phase !== "closed") return null;

  return (
    <div className="border-b border-bark/10 bg-clay/10">
      <p className="mx-auto max-w-[88rem] px-5 py-4 text-center text-sm font-semibold text-clay sm:px-8 sm:text-base">
        Thanksgiving orders are closed — the kitchen is cooking. Everything in
        the fridge is still available at the usual prices.
      </p>
    </div>
  );
}
