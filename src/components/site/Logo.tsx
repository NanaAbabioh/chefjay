import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* A fruit disc with a leaf knocked out of it. The leaf is a hole rather
          than a filled shape, so the mark reads on cream and on dark alike. */}
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
          d="M5 16a11 11 0 1 0 22 0a11 11 0 1 0-22 0Z M16 5.5 C 21.8 9 24.4 15 23.4 21.6 C 16.6 21.6 12 17 12 9.4 C 13 7.7 14.2 6.4 16 5.5 Z"
        />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">
        {site.name}
      </span>
    </span>
  );
}
