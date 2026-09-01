import { requireAdmin } from "@/lib/admin-auth";
import { hasDatabase } from "@/lib/db";
import { demoMode } from "@/lib/demo";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { eventPackages } from "@/lib/catalog";
import { getQuotes, type QuoteStatus } from "@/lib/reports";
import { setQuoteAmount, setQuoteStatus } from "@/app/admin/actions";
import {
  DemoBanner,
  Empty,
  NoDatabase,
  Panel,
  Stat,
  StatusBadge,
} from "@/components/admin/Pieces";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events" };

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: site.timeZone,
  }).format(new Date(iso));

const NEXT: Record<QuoteStatus, QuoteStatus[]> = {
  new: ["quoted", "lost"],
  quoted: ["won", "lost"],
  won: [],
  lost: ["quoted"],
};

export default async function QuotesPage() {
  await requireAdmin();
  if (!hasDatabase() && !demoMode()) return <NoDatabase />;

  const quotes = await getQuotes();
  const packageName = (id: string | null) =>
    eventPackages.find((p) => p.id === id)?.name ?? "Not specified";

  const open = quotes.filter((q) => q.status === "new" || q.status === "quoted");
  const won = quotes.filter((q) => q.status === "won");
  // Only quotes you actually priced can be counted, in either direction.
  const wonCents = won.reduce((n, q) => n + (q.quoted_cents ?? 0), 0);
  const openCents = open.reduce((n, q) => n + (q.quoted_cents ?? 0), 0);

  return (
    <div className="space-y-6">
      {demoMode() && <DemoBanner />}
      <div>
        <h1 className="font-display text-3xl font-semibold">Events</h1>
        <p className="mt-1 text-bark-soft">
          Every event is priced by hand, so these figures only count quotes you
          have put a number on.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Open"
          value={String(open.length)}
          hint={openCents ? `${money(openCents)} quoted` : "none priced yet"}
          tone={open.length ? "warn" : "plain"}
        />
        <Stat label="Won" value={String(won.length)} hint={money(wonCents)} tone="good" />
        <Stat
          label="Conversion"
          value={
            won.length + quotes.filter((q) => q.status === "lost").length
              ? `${Math.round(
                  (won.length /
                    (won.length + quotes.filter((q) => q.status === "lost").length)) *
                    100,
                )}%`
              : "—"
          }
          hint="won of those decided"
        />
      </div>

      <Panel title="Enquiries">
        {quotes.length === 0 ? (
          <Empty>No event enquiries yet.</Empty>
        ) : (
          <div className="space-y-4">
            {quotes.map((q) => (
              <article key={q.id} className="rounded-card border border-bark/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-lg font-semibold">{q.name}</h3>
                      <StatusBadge status={q.status} />
                    </div>
                    <p className="mt-1 text-sm text-bark-faint">
                      {q.ref} · enquired {when(q.created_at)}
                    </p>
                  </div>
                  {q.quoted_cents !== null && (
                    <p className="font-display text-xl font-semibold tabular-nums">
                      {money(q.quoted_cents)}
                    </p>
                  )}
                </div>

                <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="text-bark-faint">Package</dt>
                    <dd>{packageName(q.package_id)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-bark-faint">Date</dt>
                    <dd>{q.event_date ?? "—"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-bark-faint">Guests</dt>
                    <dd>{q.guests ?? "—"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-bark-faint">Occasion</dt>
                    <dd>{q.event_type ?? "—"}</dd>
                  </div>
                  {q.venue && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="shrink-0 text-bark-faint">Venue</dt>
                      <dd>{q.venue}</dd>
                    </div>
                  )}
                  {q.flavors.length > 0 && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="shrink-0 text-bark-faint">Flavors</dt>
                      <dd>{q.flavors.join(", ")}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-bark-faint">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${q.phone.replace(/[^\d+]/g, "")}`}
                        className="underline underline-offset-4"
                      >
                        {q.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-bark-faint">Email</dt>
                    <dd className="truncate">
                      <a href={`mailto:${q.email}`} className="underline underline-offset-4">
                        {q.email}
                      </a>
                    </dd>
                  </div>
                  {q.notes && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="shrink-0 text-bark-faint">Notes</dt>
                      <dd className="text-clay">{q.notes}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-bark/10 pt-4">
                  <form
                    action={setQuoteAmount.bind(null, q.id)}
                    className="flex items-center gap-2"
                  >
                    <label className="sr-only" htmlFor={`amount-${q.id}`}>
                      Quoted amount in dollars
                    </label>
                    <input
                      id={`amount-${q.id}`}
                      name="amount"
                      inputMode="decimal"
                      placeholder="Quote $"
                      defaultValue={q.quoted_cents ? (q.quoted_cents / 100).toFixed(2) : ""}
                      className="h-11 w-28 rounded-full border border-bark/20 bg-cream px-4 text-base tabular-nums sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center rounded-full border border-bark/25 px-4 text-sm font-semibold hover:bg-bark/5"
                    >
                      Save
                    </button>
                  </form>

                  {NEXT[q.status].map((s) => (
                    <form key={s} action={setQuoteStatus.bind(null, q.id, s)}>
                      <button
                        type="submit"
                        className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold ${
                          s === "lost"
                            ? "px-4 text-bark-faint hover:text-clay"
                            : "bg-bark text-cream hover:bg-palm"
                        }`}
                      >
                        Mark {s}
                      </button>
                    </form>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
