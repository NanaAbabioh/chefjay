import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { isSignedIn } from "@/lib/admin-auth";
import { signOut } from "@/app/admin/actions";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: `%s · ${site.name} dashboard` },
  robots: { index: false, follow: false },
};

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/quotes", label: "Events" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // The pages guard themselves too. This is the shell, not the lock.
  if (!(await isSignedIn())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-shell">
      <header className="border-b border-bark/10 bg-cream">
        <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          <Link href="/admin" className="font-display text-lg font-semibold">
            {site.name}
            <span className="ml-2 text-sm font-normal text-bark-faint">dashboard</span>
          </Link>

          <nav className="flex items-center gap-1">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-bark-soft hover:bg-bark/5 hover:text-bark"
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-bark-faint hover:text-bark"
            >
              View site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-full border border-bark/20 px-4 text-sm font-semibold hover:bg-bark/5"
              >
                Sign out
              </button>
            </form>
          </div>
        </Container>
      </header>

      <Container className="py-8">{children}</Container>
    </div>
  );
}
