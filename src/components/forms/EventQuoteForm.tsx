"use client";

import { useState, useTransition } from "react";
import { drinks, eventPackages } from "@/lib/catalog";
import { site } from "@/lib/site";
import type { EventQuote } from "@/lib/order";
import { submitQuote, type SubmitResult } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Field, Select, TextArea } from "@/components/ui/Field";
import { Handoff } from "./Handoff";

const eventTypes = [
  "Birthday",
  "Wedding",
  "Baby shower",
  "Corporate / launch",
  "Church or community event",
  "Festival or market",
  "Standing weekly order",
  "Something else",
];

/** Today + lead time, so the date picker cannot be set inside our lead time. */
function earliestDate(leadDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + leadDays);
  return d.toISOString().slice(0, 10);
}

export function EventQuoteForm({
  selectedPackage,
  onPackageChange,
}: {
  selectedPackage: string;
  onPackageChange: (id: string) => void;
}) {
  const [quote, setQuote] = useState<Omit<EventQuote, "packageId">>({
    name: "",
    phone: "",
    email: "",
    eventType: eventTypes[0],
    date: "",
    guests: "",
    venue: "",
    flavors: [],
    notes: "",
  });
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof typeof quote>(key: K, value: (typeof quote)[K]) =>
    setQuote((q) => ({ ...q, [key]: value }));

  const toggleFlavor = (name: string) =>
    setQuote((q) => ({
      ...q,
      flavors: q.flavors.includes(name)
        ? q.flavors.filter((f) => f !== name)
        : [...q.flavors, name],
    }));

  if (result?.ok) {
    return (
      <Handoff
        reference={result.ref}
        whatsapp={result.whatsapp}
        mailto={result.mailto}
        heading="Quote request in."
        body="We price every event by hand, so give us a few hours. Send this over on WhatsApp and we can go back and forth on flavors and timing in one thread."
      />
    );
  }

  return (
    <form
      className="rounded-card border border-bark/10 bg-shell p-6 sm:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setResult(await submitQuote({ ...quote, packageId: selectedPackage }));
        });
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Package"
          value={selectedPackage}
          onChange={(e) => onPackageChange(e.target.value)}
        >
          {eventPackages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.guests}
            </option>
          ))}
        </Select>

        <Select
          label="Occasion"
          value={quote.eventType}
          onChange={(e) => set("eventType", e.target.value)}
        >
          {eventTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>

        <Field
          label="Event date"
          required
          type="date"
          min={earliestDate(site.eventLeadTimeDays)}
          value={quote.date}
          onChange={(e) => set("date", e.target.value)}
          hint={`${site.eventLeadTimeDays} days' notice`}
        />

        <Field
          label="How many guests"
          required
          inputMode="numeric"
          value={quote.guests}
          onChange={(e) => set("guests", e.target.value)}
          placeholder="Roughly is fine"
        />

        <Field
          label="Venue or neighbourhood"
          className="sm:col-span-2"
          value={quote.venue}
          onChange={(e) => set("venue", e.target.value)}
          placeholder="Bed-Stuy backyard, midtown office, Prospect Park…"
        />
      </div>

      <fieldset className="mt-7">
        <legend className="text-sm font-semibold">
          Flavors you have in mind{" "}
          <span className="font-normal text-bark-faint">— optional</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {drinks.map((d) => {
            const on = quote.flavors.includes(d.name);
            return (
              <label
                key={d.slug}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  on
                    ? "border-palm bg-palm text-cream"
                    : "border-bark/20 bg-cream hover:border-bark/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleFlavor(d.name)}
                  className="sr-only"
                />
                {d.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        <Field
          label="Your name"
          required
          value={quote.name}
          onChange={(e) => set("name", e.target.value)}
          autoComplete="name"
        />
        <Field
          label="Phone"
          required
          type="tel"
          value={quote.phone}
          onChange={(e) => set("phone", e.target.value)}
          autoComplete="tel"
        />
        <Field
          label="Email"
          required
          type="email"
          value={quote.email}
          onChange={(e) => set("email", e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="mt-5">
        <TextArea
          label="Tell us about it"
          value={quote.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Indoors or out, is there power and a table, do you want us to stay and pour, anything you need us to avoid…"
        />
      </div>

      {result && !result.ok && (
        <p className="mt-5 rounded-xl bg-clay/10 px-4 py-3 text-sm text-clay" role="alert">
          {result.error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-7 w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : "Request a quote"}
      </Button>
      <p className="mt-3 text-xs text-bark-faint">
        Free, no commitment. We usually reply the same day.
      </p>
    </form>
  );
}
