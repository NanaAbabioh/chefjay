"use client";

import { useState } from "react";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/order";
import {
  bands,
  bottlesIn,
  perBottleCents,
  plans,
  savingPercent,
  subscriptionSummary,
  type Plan,
} from "@/lib/subscriptions";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * Flavour first, then rhythm.
 *
 * Twelve prices laid out at once is a spreadsheet. Choosing the band first —
 * the enjoyable decision — leaves four cards on screen instead, and the
 * frequency question answers itself once the per-bottle price is visible.
 */
export function SubscribePicker() {
  const [bandId, setBandId] = useState(bands[0].id);
  const [planId, setPlanId] = useState<string | null>(null);

  const band = bands.find((b) => b.id === bandId)!;
  const chosen: Plan | null = plans.find((p) => p.id === planId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {bands.map((b) => {
          const active = b.id === bandId;
          return (
            <Button
              key={b.id}
              type="button"
              variant={active ? "solid" : "outline"}
              onClick={() => setBandId(b.id)}
              aria-pressed={active}
            >
              {b.name}
            </Button>
          );
        })}
      </div>
      <p className="mt-3 text-base text-bark-faint">{band.covers}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const active = plan.id === planId;
          const saving = savingPercent(band, plan);
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setPlanId(plan.id)}
              aria-pressed={active}
              className={`rounded-card border p-6 text-left transition-colors ${
                active
                  ? "border-bark bg-bark text-cream"
                  : "border-bark/15 bg-cream hover:border-bark/40"
              }`}
            >
              <p className="font-display text-xl font-semibold">{plan.name}</p>
              <p
                className={`mt-1 text-sm ${active ? "text-cream/70" : "text-bark-faint"}`}
              >
                {plan.rhythm}
              </p>

              {/* The per-bottle price leads: it is the number that reads as a
                  treat rather than a commitment. */}
              <p className="mt-5 font-display text-3xl font-semibold">
                {money(perBottleCents(band, plan))}
                <span
                  className={`ml-1 text-base font-normal ${
                    active ? "text-cream/70" : "text-bark-faint"
                  }`}
                >
                  a bottle
                </span>
              </p>
              <p className={`mt-1 text-base ${active ? "text-cream/80" : "text-bark-soft"}`}>
                {money(band.prices[plan.id])} a month · {bottlesIn(plan)} bottles
              </p>

              {saving && (
                <p
                  className={`mt-3 inline-block text-sm font-semibold ${
                    active ? "text-pineapple" : "text-clay"
                  }`}
                >
                  Save {saving}%
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10 border-t border-bark/10 pt-8">
        {chosen ? (
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="font-display text-2xl font-semibold">
                {chosen.name} · {band.name}
              </p>
              <p className="mt-1 text-base text-bark-soft">
                {bottlesIn(chosen)} bottles a month, {money(band.prices[chosen.id])} —
                tell us which flavours when we confirm.
              </p>
            </div>
            <ButtonLink
              href={whatsappUrl(
                `Hi ${site.owner}, I'd like to start a monthly subscription.\n\n` +
                  subscriptionSummary(band, chosen, ""),
              )}
              size="lg"
            >
              Start on WhatsApp
            </ButtonLink>
          </div>
        ) : (
          <p className="text-base text-bark-faint">
            Pick a rhythm above and we&rsquo;ll set it up by message.
          </p>
        )}
      </div>
    </div>
  );
}
