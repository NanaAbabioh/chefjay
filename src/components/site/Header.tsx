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
          <Link href="/" className="inline-flex min-h-11 items-center text-bark" aria-label="Home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-bark/8 text-bark"
                      : "text-bark-soft hover:bg-bark/5 hover:text-bark"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex min-h-11 items-center rounded-full border border-bark/20 px-4 text-sm font-semibold transition-colors hover:border-bark hover:bg-bark/5"
            >
              Cart
              {ready && count > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-mango px-1.5 text-xs font-bold text-cream">
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
            {nav.map((item) => (
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
