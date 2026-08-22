"use client";

import { site } from "@/lib/site";

/**
 * Shown after a form is accepted. The order is already recorded server-side —
 * these buttons just open the customer's own messaging app so the conversation
 * starts in a place they can reply from.
 */
export function Handoff({
  reference,
  whatsapp,
  mailto,
  heading,
  body,
}: {
  /** Named `reference`, not `ref` — `ref` is reserved by React. */
  reference: string;
  whatsapp: string;
  mailto: string;
  heading: string;
  body: string;
}) {
  return (
    <div className="rounded-card border border-palm/25 bg-palm p-8 text-cream sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pineapple">
        Reference {reference}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold">{heading}</h2>
      <p className="prose-measure mt-3 leading-relaxed text-cream/80">{body}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-pineapple px-6 py-3.5 text-sm font-bold text-bark hover:bg-cream"
        >
          Send on WhatsApp
        </a>
        <a
          href={mailto}
          className="rounded-full border border-cream/35 px-6 py-3.5 text-sm font-semibold hover:bg-cream/10"
        >
          Send by email instead
        </a>
      </div>

      <p className="mt-6 text-sm text-cream/60">
        Prefer to talk? Call {site.phone} — {site.hours}.
      </p>
    </div>
  );
}
