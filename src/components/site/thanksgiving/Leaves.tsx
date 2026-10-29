/**
 * A few leaves falling behind the hero.
 *
 * Five, not fifty. The difference between a seasonal note and a screensaver
 * is almost entirely how many there are and how slowly they go, so each one
 * is given its own duration, delay, horizontal drift and spin — sharing one
 * keyframe but never falling in step, which is what stops the eye reading
 * them as a loading animation.
 *
 * Decorative throughout: `aria-hidden`, no text, and the global
 * reduced-motion rule freezes them along with everything else on the site.
 */
const leaves = [
  { left: "6%", size: 30, time: 21, delay: 0, drift: 70, spin: 380, tint: "text-clay" },
  { left: "23%", size: 20, time: 17, delay: 6, drift: -40, spin: -300, tint: "text-mango" },
  { left: "48%", size: 26, time: 25, delay: 11, drift: 90, spin: 440, tint: "text-clay" },
  { left: "71%", size: 18, time: 19, delay: 3, drift: -55, spin: 320, tint: "text-pineapple" },
  { left: "88%", size: 34, time: 23, delay: 14, drift: 45, spin: -360, tint: "text-mango" },
];

export function Leaves({ fallTo = 820 }: { fallTo?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <span
          key={leaf.left}
          className={`leaf ${leaf.tint}`}
          style={{
            left: leaf.left,
            ["--fall-time" as string]: `${leaf.time}s`,
            ["--fall-delay" as string]: `${-leaf.delay}s`,
            ["--fall-drift" as string]: `${leaf.drift}px`,
            ["--fall-spin" as string]: `${leaf.spin}deg`,
            ["--fall-to" as string]: `${fallTo}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={leaf.size}
            height={leaf.size}
            fill="currentColor"
          >
            {/* One leaf, drawn as a body with a stem and a single vein. At
                twenty pixels and a third opacity nothing more survives. */}
            <path d="M12 1.5c5.2 4.1 8.4 8.7 8.4 12.6a8.4 8.4 0 0 1-16.8 0c0-3.9 3.2-8.5 8.4-12.6Z" />
            <path
              d="M12 5v17"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
