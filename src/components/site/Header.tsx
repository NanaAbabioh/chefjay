"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Section";

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  // The menu records which route it was opened on. Navigating changes
  // `pathname`, so the menu closes as a consequence of render rather than
  // through an effect that would trigger a second render pass.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-bark/10 bg-cream/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            // The wordmark must never wrap: with the Subscribe pill alongside
            // the cart on a phone, the row is tight enough that it would.
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap text-bark"
            aria-label="Home"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              // "/" is a prefix of every route, so the home link has to match
              // exactly or it would read as active on every page.
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
                // Subscribe is the newest item and the one nobody is looking
                // for, so it is filled rather than nudged: colour holds
                // attention where a small movement only catches it once. The
                // one filled accent on the site, and it earns being the one.
                const promoted = item.href === "/subscribe";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-base font-medium transition-colors ${
                      promoted
                        ? "bg-clay font-semibold text-cream hover:bg-clay/90"
                        : active
                          ? "bg-bark/8 text-bark"
                          : "text-bark-soft hover:bg-bark/5 hover:text-bark"
                    } ${promoted && !active ? "sway" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* On a phone the menu is closed by default, so an item inside it
                is invisible until someone goes looking. This one sits in the
                bar instead, where the cart already is. */}
            <Link
              href="/subscribe"
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-clay px-3 text-sm font-semibold text-cream transition-colors hover:bg-clay/90 md:hidden"
            >
              Subscribe
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bark/20 transition-colors hover:border-bark hover:bg-bark/5"
            >
              {/* A basket needs no caption. The label stays for screen
                  readers, and the count rides the rim where it reads as a
                  number of things rather than part of a word. */}
              <span className="sr-only">Cart</span>
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 4h2l1.6 8.4a1.5 1.5 0 0 0 1.5 1.2h6.3a1.5 1.5 0 0 0 1.5-1.2L17 7H6" />
                <circle cx="9" cy="16.5" r="1" />
                <circle cx="14.5" cy="16.5" r="1" />
              </svg>
              {ready && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1.5 text-xs font-bold text-cream">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpenAt(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-bark/20 md:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                {open ? (
                  <path
                    d="M4 4 L16 16 M16 4 L4 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 6h14M3 10h14M3 14h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" className="border-t border-bark/10 md:hidden">
          <Container className="flex flex-col py-2">
            {/* Subscribe is already in the bar above on this breakpoint, so
                listing it again here would only pad the menu. */}
            {nav
              .filter((item) => item.href !== "/subscribe")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-bark/5 py-3.5 text-base font-medium last:border-0"
                >
                  {item.label}
                </Link>
              ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
