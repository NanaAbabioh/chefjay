import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* A sun disc with a leaf cutting across it — reads as fruit at 28px. */}
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="16" cy="16" r="11" fill="currentColor" />
        <path
          d="M16 5 C 22 9 25 15 24 22 C 17 22 12 17 12 9 C 13 7 14 6 16 5 Z"
          fill="var(--color-cream)"
          fillOpacity="0.85"
        />
        <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">
        {site.name}
      </span>
    </span>
  );
}
