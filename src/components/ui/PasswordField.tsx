"use client";

import { useState, type ComponentProps } from "react";
import { control, Label } from "./Field";

/**
 * A password box with a reveal toggle.
 *
 * Hidden by default, because the point of the dots is that someone standing
 * behind you cannot read them. The toggle exists for the opposite case — a
 * long password typed on a phone keyboard, where a silent "wrong password"
 * usually means a mistyped one.
 */
export function PasswordField({
  label,
  required,
  hint,
  className,
  ...rest
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
} & Omit<ComponentProps<"input">, "className" | "type">) {
  const [shown, setShown] = useState(false);

  return (
    <Label label={label} required={required} hint={hint} className={className}>
      <div className="relative">
        <input
          {...rest}
          type={shown ? "text" : "password"}
          required={required}
          // Room for the button, so a long password never runs under it.
          className={`${control} pr-14`}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-pressed={shown}
          className="absolute inset-y-0 right-0 flex w-14 items-center justify-center rounded-r-xl text-bark-faint transition-colors hover:text-bark"
        >
          <span className="sr-only">{shown ? "Hide password" : "Show password"}</span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="3.2" />
            {/* The struck-through eye reads as "currently visible, tap to hide". */}
            {shown && <path d="M4 20 20 4" />}
          </svg>
        </button>
      </div>
    </Label>
  );
}
