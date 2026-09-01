import type { ReactNode } from "react";
import { money } from "@/lib/format";

/** A single headline figure. */
export function Stat({
  label,
  value,
  hint,
  tone = "plain",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "plain" | "good" | "warn";
}) {
  const tones = {
    plain: "border-bark/10 bg-cream",
    good: "border-palm/20 bg-palm/5",
    warn: "border-mango/30 bg-mango/5",
  };
  return (
    <div className={`rounded-card border p-5 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-bark-faint">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-sm text-bark-soft">{hint}</p>}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  new: "bg-mango/15 text-mango",
  confirmed: "bg-palm/10 text-palm",
  preparing: "bg-pineapple/25 text-bark",
  ready: "bg-palm/15 text-palm",
  completed: "bg-bark/8 text-bark-soft",
  cancelled: "bg-clay/10 text-clay",
  quoted: "bg-pineapple/25 text-bark",
  won: "bg-palm/10 text-palm",
  lost: "bg-clay/10 text-clay",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_TONE[status] ?? "bg-bark/8 text-bark-soft"
      }`}
    >
      {status}
    </span>
  );
}

export function Panel({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-bark/10 bg-cream p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-sm text-bark-faint">{children}</p>;
}

/**
 * Fourteen days of takings. Drawn with plain divs rather than a charting
 * library — it is one series of one number, and a dependency would cost more
 * than it gives.
 */
export function TakingsChart({
  days,
}: {
  days: { day: string; cents: number; orders: number }[];
}) {
  const peak = Math.max(...days.map((d) => d.cents), 1);
  return (
    <div>
      {/* items-stretch, not items-end: each column must inherit the row's full
          height or the bars' percentage heights resolve against nothing. */}
      <div className="flex h-32 items-stretch gap-1.5">
        {days.map((d) => (
          <div key={d.day} className="group relative flex flex-1 flex-col justify-end">
            <div
              className="rounded-t bg-palm/70 transition-colors group-hover:bg-palm"
              style={{ height: `${Math.max((d.cents / peak) * 100, d.cents ? 3 : 1)}%` }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-bark px-2 py-1 text-xs text-cream group-hover:block">
              {money(d.cents)} · {d.orders}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-bark-faint">
        <span>{days[0]?.day.slice(5)}</span>
        <span>{days.at(-1)?.day.slice(5)}</span>
      </div>
    </div>
  );
}

/** Shown when DATABASE_URL is unset — the dashboard has nothing to read. */
export function NoDatabase() {
  return (
    <div className="rounded-card border border-mango/30 bg-mango/5 p-6">
      <h2 className="font-display text-xl font-semibold">No database connected</h2>
      <p className="prose-measure mt-2 text-bark-soft">
        Orders are still being taken, logged and emailed — but nothing is being
        stored, so there is nothing to report on yet. Set <code>DATABASE_URL</code>{" "}
        to your Neon connection string and run <code>db/001_init.sql</code> against
        it, and this fills in.
      </p>
    </div>
  );
}

/**
 * Sits above every dashboard page while sample data is on. Deliberately hard
 * to miss: a figure you cannot bank should never be mistaken for one you can.
 */
export function DemoBanner() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-card border border-clay/30 bg-clay/8 px-5 py-3">
      <span className="rounded-full bg-clay px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cream">
        Sample data
      </span>
      <p className="text-sm text-bark-soft">
        Invented orders, so you can see how this works. Nothing here is real and
        nothing you click is saved. Connect a database and it disappears.
      </p>
    </div>
  );
}
