import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin access.
 *
 * One password, held in `ADMIN_PASSWORD`, exchanged for a signed session
 * cookie. No dependency and no user table — proportionate for a business with
 * one owner, and the same instinct that had us call Resend over plain fetch.
 *
 * The cookie carries an expiry and an HMAC of it, so it cannot be extended or
 * forged without `ADMIN_SESSION_SECRET`. It is httpOnly, so page scripts
 * cannot read it, and Secure outside development.
 *
 * If either variable is missing the dashboard refuses every login rather than
 * falling open. An unset password must never mean "no password required".
 */

const COOKIE = "vincents_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

export const adminConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD?.trim() && process.env.ADMIN_SESSION_SECRET?.trim());

const sign = (payload: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET!.trim())
    .update(payload)
    .digest("hex");

/** Constant-time compare that cannot throw on length mismatch. */
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Both sides are trimmed. A value pasted into a hosting dashboard picks up a
 * trailing newline or space remarkably easily, and an invisible character
 * there would lock you out of your own dashboard with no way to see why. A
 * password whose leading or trailing spaces are load-bearing is not a password
 * anyone meant to set.
 */
export function verifyPassword(attempt: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  return safeEqual(attempt.trim(), expected);
}

export async function startSession() {
  // A nonce keeps two sessions issued in the same second distinguishable.
  const payload = `${Date.now() + MAX_AGE_SECONDS * 1000}.${randomBytes(8).toString("hex")}`;
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isSignedIn() {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;

  const cut = raw.lastIndexOf(".");
  if (cut < 0) return false;

  const payload = raw.slice(0, cut);
  const signature = raw.slice(cut + 1);
  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload.split(".")[0]);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/**
 * Guard for admin pages and data reads. Called by every protected page rather
 * than only by the layout — a layout can be reused across a navigation, and a
 * page that reads customer records should not depend on someone else having
 * checked.
 */
export async function requireAdmin() {
  if (!(await isSignedIn())) redirect("/admin/login");
}
