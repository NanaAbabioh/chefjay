import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { hasDatabase } from "@/lib/db";
import { demoMode } from "@/lib/demo";
import { money } from "@/lib/format";
import {
  getDailyTakings,
  getOrders,
  getSummary,
  getTopProducts,
  getWaitlist,
} from "@/lib/reports";
import {
  DemoBanner,
  Empty,
  NoDatabase,
  Panel,
  Stat,
  TakingsChart,
} from "@/components/admin/Pieces";
import { OrderCard } from "@/components/admin/OrderCard";

// Every figure is read at request time; nothing here may be served stale.
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  await requireAdmin();

  if (!hasDatabase() && !demoMode()) {
    return <NoDatabase />;
  }

  const [summary, takings, products, waitlist, open] = await Promise.all([
    getSummary(),
    getDailyTakings(14),
    getTopProducts(30),
    getWaitlist(),
    getOrders(),
  ]);

  if (!summary) return <NoDatabase />;

  // The queue you actually work from, oldest first — first in, first made.
  const queue = open
    .filter((o) => o.status !== "completed" && o.status !== "cancelled")
    .reverse();

  const unitsSold = products.reduce((n, p) => n + p.units, 0);

  return (
    <div className="space-y-6">
      {demoMode() && <DemoBanner />}
      <div>
        <h1 className="font-display text-3xl font-semibold">Overview</h1>
        <p className="mt-1 text-bark-soft">
          Takings count completed orders only — nothing is charged online, so an
          order becomes money when you have fulfilled it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Today"
          value={money(summary.todayCents)}
          hint={`${summary.todayCount} completed`}
          tone="good"
        />
        <Stat
          label="Open orders"
          value={String(summary.openCount)}
          hint={`${money(summary.openCents)} waiting to be fulfilled`}
          tone={summary.openCount > 0 ? "warn" : "plain"}
        />
        <Stat label="Last 7 days" value={money(summary.weekCents)} />
        <Stat
          label="Last 30 days"
          value={money(summary.monthCents)}
          hint={`${summary.monthOrders} ${
            summary.monthOrders === 1 ? "order" : "orders"
          } · ${money(summary.averageCents)} average`}
        />
      </div>

      <Panel
        title="Needs you"
        aside={
          <Link href="/admin/orders" className="text-sm underline underline-offset-4">
            All orders
          </Link>
        }
      >
        {queue.length === 0 ? (
          <Empty>Nothing waiting. Every order is fulfilled or cancelled.</Empty>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {queue.slice(0, 6).map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Takings" aside={<span className="text-sm text-bark-faint">14 days</span>}>
          <TakingsChart days={takings} />
        </Panel>

        <Panel
          title="Delivery"
          aside={<span className="text-sm text-bark-faint">completed orders</span>}
        >
          <dl className="space-y-3 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt>Delivery fees charged</dt>
              <dd className="font-semibold tabular-nums">
                {money(summary.deliveryFeesCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt>
                Given away
                <span className="block text-xs text-bark-faint">
                  orders that crossed the free-delivery threshold
                </span>
              </dt>
              <dd className="font-semibold tabular-nums text-clay">
                −{money(summary.feesWaivedCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-bark/10 pt-3">
              <dt>Delivered vs collected</dt>
              <dd className="font-semibold tabular-nums">
                {summary.deliveryCount} · {summary.pickupCount}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="What sells"
          aside={<span className="text-sm text-bark-faint">30 days</span>}
        >
          {products.length === 0 ? (
            <Empty>No completed orders yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className="tabular-nums text-bark-soft">
                      {p.units} · {money(p.cents)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bark/8">
                    <div
                      className="h-full rounded-full bg-mango"
                      style={{ width: `${(p.units / unitsSold) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Kitchen waitlist"
          aside={<span className="text-sm text-bark-faint">{waitlist.count} signed up</span>}
        >
          {waitlist.recent.length === 0 ? (
            <Empty>Nobody on the list yet.</Empty>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {waitlist.recent.map((s) => (
                <li key={s.email} className="truncate text-bark-soft">
                  {s.email}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
