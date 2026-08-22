import type { ComponentProps, ReactNode } from "react";

/**
 * `text-base` below the `sm` breakpoint is deliberate: iOS Safari zooms the
 * whole page when a focused control is under 16px. Desktop keeps `text-sm`.
 */
const control =
  "w-full rounded-xl border border-bark/20 bg-cream px-4 py-3 text-base text-bark placeholder:text-bark-faint/70 focus:border-palm focus:outline-none sm:text-sm";

/**
 * `className` on any of these applies to the field wrapper, not the control —
 * so grid spans and widths behave, and the control keeps its own styling.
 */
function Label({
  label,
  required,
  hint,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline gap-1.5 text-sm font-semibold">
        {label}
        {required && <span className="text-clay">*</span>}
        {hint && <span className="text-xs font-normal text-bark-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

type Shared = { label: string; required?: boolean; hint?: string; className?: string };

export function Field({
  label,
  required,
  hint,
  className,
  ...rest
}: Shared & Omit<ComponentProps<"input">, "className">) {
  return (
    <Label label={label} required={required} hint={hint} className={className}>
      <input className={control} required={required} {...rest} />
    </Label>
  );
}

export function TextArea({
  label,
  required,
  hint,
  className,
  ...rest
}: Shared & Omit<ComponentProps<"textarea">, "className">) {
  return (
    <Label label={label} required={required} hint={hint} className={className}>
      <textarea rows={4} className={control} required={required} {...rest} />
    </Label>
  );
}

export function Select({
  label,
  required,
  hint,
  className,
  children,
  ...rest
}: Shared & Omit<ComponentProps<"select">, "className">) {
  return (
    <Label label={label} required={required} hint={hint} className={className}>
      <select className={control} required={required} {...rest}>
        {children}
      </select>
    </Label>
  );
}
