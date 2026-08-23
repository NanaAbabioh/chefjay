import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { ORDER_FLOW, type OrderRow } from "@/lib/reports";
import { setOrderStatus } from "@/app/admin/actions";
import { StatusBadge } from "./Pieces";

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: site.timeZone,
  }).format(new Date(iso));

/**
 * One order, with everything you need to act on it without leaving the page:
 * what they want, how to reach them, and the single next step.
 *
 * The status buttons are plain forms bound to a server action, so the whole
 * card works with no client JavaScript at all.
 */
export function OrderCard({ order }: { order: OrderRow }) {
  const stage = ORDER_FLOW.indexOf(order.status);
  const next = stage >= 0 ? ORDER_FLOW[stage + 1] : undefined;
  const settled = order.status === "completed" || order.status === "cancelled";

  return (
    <article className="rounded-card border border-bark/10 bg-cream p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-lg font-semibold">{order.name}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-bark-faint">
            {order.ref} · {when(order.created_at)}
          </p>
        </div>
        <p className="font-display text-xl font-semibold tabular-nums">
          {money(order.total_cents)}
        </p>
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {order.items.map((i, n) => (
          <li key={n} className="flex justify-between gap-4">
            <span>
              {i.qty} × {i.name}{" "}
              <span className="text-bark-faint">({i.volume})</span>
            </span>
            <span className="tabular-nums text-bark-soft">{money(i.line_cents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid gap-x-6 gap-y-1.5 border-t border-bark/10 pt-4 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-bark-faint">Phone</dt>
          <dd>
            <a href={`tel:${order.phone.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4">
              {order.phone}
            </a>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-bark-faint">Fulfilment</dt>
          <dd className="capitalize">
            {order.method}
            {order.method === "delivery" &&
              ` · ${order.delivery_cents === 0 ? "free" : money(order.delivery_cents)}`}
          </dd>
        </div>
        {order.address && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0 text-bark-faint">Address</dt>
            <dd>{order.address}</dd>
          </div>
        )}
        {order.preferred_time && (
          <div className="flex gap-2">
            <dt className="text-bark-faint">Wants it</dt>
            <dd>{order.preferred_time}</dd>
          </div>
        )}
        {order.email && (
          <div className="flex gap-2">
            <dt className="text-bark-faint">Email</dt>
            <dd className="truncate">{order.email}</dd>
          </div>
        )}
        {order.notes && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0 text-bark-faint">Notes</dt>
            <dd className="text-clay">{order.notes}</dd>
          </div>
        )}
      </dl>

      {!settled && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-bark/10 pt-4">
          {next && (
            <form action={setOrderStatus.bind(null, order.id, next)}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-full bg-bark px-5 text-sm font-semibold text-cream hover:bg-palm"
              >
                Mark {next}
              </button>
            </form>
          )}
          <form action={setOrderStatus.bind(null, order.id, "cancelled")}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-bark-faint hover:text-clay"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
