/**
 * A drink rendered from the product's own two colors. This exists so the site
 * looks composed before real photography exists — swap this component for
 * <Image> once you have shots, and nothing else has to change.
 */
export function DrinkGlass({
  top,
  bottom,
  id,
  className = "",
  garnish = true,
}: {
  top: string;
  bottom: string;
  /** Must be unique per instance — SVG gradient ids are global. */
  id: string;
  className?: string;
  garnish?: boolean;
}) {
  const g = `pour-${id}`;
  const clip = `glass-${id}`;
  const shine = `shine-${id}`;
  const body =
    "M 62 78 L 74 246 Q 75 257 86 257 L 114 257 Q 125 257 126 246 L 138 78 Z";

  return (
    <svg
      viewBox="42 16 116 258"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={shine} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clip}>
          <path d={body} />
        </clipPath>
      </defs>

      {/* Contact shadow, so the glass sits on the surface instead of floating */}
      <ellipse cx="100" cy="262" rx="44" ry="7" fill={bottom} opacity="0.18" />

      {/* Glass itself. Without this the empty part above the liquid is fully
          transparent, which reads as a dirty cap on dark backgrounds. */}
      <path d={body} fill="#FFFDF7" fillOpacity="0.2" />

      {/* Liquid, clipped to the glass silhouette */}
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="104" width="100" height="170" fill={`url(#${g})`} />
        {/* Foam / cream cap */}
        <rect x="50" y="96" width="100" height="16" fill="#FFFDF7" opacity="0.92" />
        <rect x="50" y="78" width="100" height="20" fill={top} opacity="0.28" />
        <rect x="50" y="0" width="100" height="300" fill={`url(#${shine})`} />
      </g>

      {/* Glass walls */}
      <path
        d={body}
        fill="none"
        stroke="#241a12"
        strokeOpacity="0.35"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Rim */}
      <ellipse
        cx="100"
        cy="78"
        rx="38"
        ry="7.5"
        fill="#FFFDF7"
        fillOpacity="0.5"
        stroke="#241a12"
        strokeOpacity="0.35"
        strokeWidth="2.5"
      />

      {garnish && (
        <>
          {/* Straw */}
          <path
            d="M 118 40 L 104 150"
            stroke="#B4472C"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 118 40 L 104 150"
            stroke="#FFFDF7"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="10 14"
            opacity="0.85"
          />
          {/* Pineapple leaf tucked at the rim */}
          <path
            d="M 62 72 C 48 58 44 40 50 26 C 62 34 70 52 68 72 Z"
            fill="#1E4638"
          />
          <path
            d="M 68 74 C 58 56 60 38 72 28 C 78 44 78 62 74 76 Z"
            fill="#2C6350"
          />
          {/* Fruit wedge on the rim */}
          <circle cx="136" cy="76" r="13" fill={top} />
          <path
            d="M 136 63 A 13 13 0 0 1 136 89 Z"
            fill="#F2B93B"
            opacity="0.9"
          />
          <circle
            cx="136"
            cy="76"
            r="13"
            fill="none"
            stroke="#241a12"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  );
}
