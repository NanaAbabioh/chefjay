import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { hasDatabase } from "@/lib/db";
import { money } from "@/lib/format";
import { getOrders, type OrderStatus } from "@/lib/reports";
import { Empty, NoDatabase } from "@/components/admin/Pieces";
import { OrderCard } from "@/components/admin/OrderCard";

export const dynamic = "force-dynamic";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const metadata = { title: "Orders" };

export default async function OrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  await requireAdmin();
  if (!hasDatabase()) return <NoDatabase />;

  const { status } = await searchParams;
  const active = FILTERS.find((f) => f.value === status)?.value ?? "all";
  const orders = await getOrders(active === "all" ? undefined : active);

  const value = orders.reduce((n, o) => n + o.total_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="text-sm text-bark-soft tabular-nums">
          {orders.length} shown · {money(value)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/orders" : `/admin/orders?status=${f.value}`}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium ${
              active === f.value
                ? "border-bark bg-bark text-cream"
                : "border-bark/20 text-bark-soft hover:bg-bark/5"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <Empty>No orders with that status.</Empty>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
