"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { promo, promoActive } from "@/lib/promo";

/** The offer never starts or ends mid-visit, so there is nothing to subscribe
 *  to — the snapshot is read once on the client and left alone. */
const noop = () => () => {};

/**
 * Shows its children only while the offer is running.
 *
 * Deliberately client-side. Most of this site is prerendered at deploy time,
 * so a server-rendered check would freeze whatever was true when the build
 * ran — the offer would appear on the day it was deployed rather than the day
 * it starts, and would still be there after it ends until someone redeployed.
 * The check runs after mount instead, against the business's clock.
 *
 * This is presentation only. The discount itself is applied on the server in
 * `submitOrder`, where a stale page or a tampered clock cannot reach it.
 */
export function PromoGate({ children }: { children: ReactNode }) {
  const running = useSyncExternalStore(
    noop,
    () => promoActive(),
    // Prerendered HTML always says "not running", so the markup the server
    // baked and the markup the client first paints agree.
    () => false,
  );
  return running ? <>{children}</> : null;
}

/**
 * The scrolling bar above the header.
 *
 * The message travels rather than sitting still, which is the point — but it
 * is one sentence repeated, not a stack of competing claims, and it pauses
 * when the pointer is over it so it can actually be read. Someone who has
 * asked their system for less motion gets it frozen, courtesy of the global
 * reduced-motion rule.
 */
export function PromoBar() {
  const message = `${promo.bar} · ${promo.window}`;
  // Four copies, animating across half the track: two fill the widest screen,
  // and the second pair is what the loop lands on.
  const run = [message, message, message, message];

  return (
    <PromoGate>
      <div className="overflow-hidden bg-bark py-2.5 text-cream">
        <div
          className="marquee"
          // Speed, not duration: longer sentences take proportionally longer
          // so the text moves at the same pace whatever it says.
          style={{ ["--marquee-duration" as string]: `${message.length * 0.26}s` }}
        >
          {run.map((text, i) => (
            <p
              key={i}
              aria-hidden={i > 0}
              className="shrink-0 whitespace-nowrap px-8 text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </PromoGate>
  );
}
