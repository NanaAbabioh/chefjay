"use client";

import { useState } from "react";
import { eventPackages } from "@/lib/catalog";
import { EventQuoteForm } from "./EventQuoteForm";

export function EventsPlanner() {
  const [selected, setSelected] = useState(
    eventPackages.find((p) => p.popular)?.id ?? eventPackages[0].id,
  );

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {eventPackages.map((pkg) => {
          const active = pkg.id === selected;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setSelected(pkg.id)}
              aria-pressed={active}
              className={`relative flex flex-col rounded-card border p-6 text-left transition-all ${
                active
                  ? "border-palm bg-palm text-cream shadow-[0_20px_45px_-28px_rgba(30,70,56,0.9)]"
                  : "border-bark/12 bg-shell hover:border-bark/35"
              }`}
            >
              {pkg.popular && (
                <span
                  className={`absolute -top-2.5 left-6 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                    active ? "bg-pineapple text-bark" : "bg-bark text-cream"
                  }`}
                >
                  Most booked
                </span>
              )}

              <span
                className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                  active ? "text-cream/60" : "text-bark-faint"
                }`}
              >
                {pkg.guests}
              </span>
              <h3 className="mt-2 font-display text-2xl font-semibold">{pkg.name}</h3>
              <p className="mt-1 font-display text-xl font-semibold">{pkg.price}</p>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  active ? "text-cream/80" : "text-bark-soft"
                }`}
              >
                {pkg.summary}
              </p>

              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className={active ? "text-pineapple" : "text-clay"}>✓</span>
                    <span className={active ? "text-cream/80" : "text-bark-soft"}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <span
                className={`mt-6 rounded-full py-2.5 text-center text-sm font-semibold ${
                  active ? "bg-cream text-bark" : "border border-bark/25"
                }`}
              >
                {active ? "Selected" : "Choose this"}
              </span>
            </button>
          );
        })}
      </div>

      <div id="quote" className="mt-16 scroll-mt-24">
        <EventQuoteForm selectedPackage={selected} onPackageChange={setSelected} />
      </div>
    </>
  );
}
