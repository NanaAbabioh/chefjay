"use client";

import { useState, useTransition } from "react";
import { joinKitchenList } from "@/app/actions";
import { Button } from "@/components/ui/Button";

export function KitchenSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ done: boolean; error?: string }>({
    done: false,
  });
  const [pending, startTransition] = useTransition();

  if (state.done) {
    return (
      <p className="rounded-xl bg-palm px-5 py-4 text-cream" role="status">
        You are on the list. We will write to you before the first menu goes out.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await joinKitchenList(email);
          setState(res.ok ? { done: true } : { done: false, error: res.error });
        });
      }}
    >
      <div className="flex-1">
        <label htmlFor="kitchen-email" className="sr-only">
          Email address
        </label>
        <input
          id="kitchen-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          className="w-full rounded-full border border-bark/20 bg-cream px-5 py-3.5 text-base placeholder:text-bark-faint/70 focus:border-palm focus:outline-none sm:text-sm"
        />
        {state.error && (
          <p className="mt-2 px-2 text-sm text-clay" role="alert">
            {state.error}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Adding…" : "Join the list"}
      </Button>
    </form>
  );
}
