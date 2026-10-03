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

/** One line above the header. Slim, because it sits above everything. */
export function PromoBar() {
  return (
    <PromoGate>
      <div className="bg-bark px-5 py-2.5 text-center text-cream">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs">
          {promo.bar}
          <span className="hidden text-cream/50 sm:inline"> · {promo.window}</span>
        </p>
      </div>
    </PromoGate>
  );
}
