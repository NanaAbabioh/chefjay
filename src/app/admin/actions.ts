"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  adminConfigured,
  endSession,
  isSignedIn,
  startSession,
  verifyPassword,
} from "@/lib/admin-auth";
import type { OrderStatus, QuoteStatus } from "@/lib/reports";

const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];
const QUOTE_STATUSES: QuoteStatus[] = ["new", "quoted", "won", "lost"];

export async function signIn(_: string | null, form: FormData) {
  if (!adminConfigured()) {
    return "The dashboard has no password set. Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET.";
  }
  const password = String(form.get("password") ?? "");
  if (!verifyPassword(password)) return "That password is not right.";

  await startSession();
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/admin/login");
}

/**
 * Status changes. Every mutation re-checks the session — a server action is a
 * public endpoint, so guarding the page that renders the button is not enough.
 * The status itself is checked against the known list before it reaches SQL.
 */
export async function setOrderStatus(id: number, status: OrderStatus) {
  if (!(await isSignedIn())) return;
  if (!ORDER_STATUSES.includes(status)) return;

  const sql = db();
  if (!sql) return;
  await sql`
    update orders set status = ${status}, updated_at = now() where id = ${id}
  `;
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

export async function setQuoteStatus(id: number, status: QuoteStatus) {
  if (!(await isSignedIn())) return;
  if (!QUOTE_STATUSES.includes(status)) return;

  const sql = db();
  if (!sql) return;
  await sql`
    update event_quotes set status = ${status}, updated_at = now() where id = ${id}
  `;
  revalidatePath("/admin/quotes");
}

/** The figure you quoted an event, in cents. */
export async function setQuoteAmount(id: number, form: FormData) {
  if (!(await isSignedIn())) return;

  const raw = String(form.get("amount") ?? "").trim();
  // Typed in dollars, stored in cents — the boundary where money enters.
  const dollars = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(dollars) || dollars < 0) return;

  const sql = db();
  if (!sql) return;
  await sql`
    update event_quotes
    set quoted_cents = ${Math.round(dollars * 100)},
        status = case when status = 'new' then 'quoted' else status end,
        updated_at = now()
    where id = ${id}
  `;
  revalidatePath("/admin/quotes");
}
