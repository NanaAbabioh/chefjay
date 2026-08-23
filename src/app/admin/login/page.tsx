import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSignedIn } from "@/lib/admin-auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign in",
  // Nothing here should ever reach a search result.
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isSignedIn()) redirect("/admin");

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark-faint">
          {site.name}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-bark-soft">Orders, events and takings.</p>
        <LoginForm />
      </div>
    </Container>
  );
}
