import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid: "bg-bark text-cream hover:bg-palm",
  outline: "border border-bark/25 text-bark hover:border-bark hover:bg-bark/5",
  ghost: "text-bark hover:bg-bark/5",
  light: "bg-cream text-bark hover:bg-pineapple",
};

// Every size clears the 44px minimum touch target — most traffic is phones.
const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-12 px-6 py-4 text-base sm:px-8",
};

const cls = (variant: Variant, size: Size, extra?: string) =>
  [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");

export function ButtonLink({
  href,
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={cls(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">) {
  return (
    <button className={cls(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
