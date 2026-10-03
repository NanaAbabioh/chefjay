import { site } from "@/lib/site";

/**
 * Instagram and TikTok, drawn inline rather than pulled from an icon font.
 *
 * Two glyphs do not justify a dependency, and a font that fails to load takes
 * the links with it. Each is a 44px target with its own label, so the row works
 * by thumb and by screen reader — on a phone these are the two links most
 * likely to be tapped by someone who found us through a post.
 */
const links = [
  {
    name: "Instagram",
    href: site.socials.instagram,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: site.socials.tiktok,
    // Solid rather than stroked: the note is too fine to read at 20px as an
    // outline, where Instagram's square survives it.
    path: (
      <path
        fill="currentColor"
        stroke="none"
        d="M16.5 2h-3v12.4a2.4 2.4 0 1 1-2-2.37V9a5.4 5.4 0 1 0 5 5.39V8.9a6.6 6.6 0 0 0 3.8 1.2V7.1a3.75 3.75 0 0 1-3.8-3.7V2Z"
      />
    ),
  },
];

export function Social({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            // noreferrer as well as noopener: the destination has no business
            // knowing which page sent the tap.
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <span className="sr-only">
              {link.name} — {site.socials.handle}
            </span>
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
              {link.path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
