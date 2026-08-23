"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export function LoginForm() {
  const [error, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="mt-8">
      <Field
        label="Password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
      />
      {error && (
        <p className="mt-3 text-sm text-clay" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="mt-5 w-full" disabled={pending}>
        {pending ? "Checking…" : "Sign in"}
      </Button>
    </form>
  );
}
