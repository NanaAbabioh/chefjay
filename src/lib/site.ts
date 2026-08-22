/**
 * Single source of truth for business details.
 * Change these values and the whole site updates — nothing else hardcodes them.
 */
export const site = {
  name: "Vincent’s",
  tagline: "Coconut, mango and pineapple, blended fresh.",
  description:
    "Piña colada and tropical blends made with real coconut, ripe mango, cold-pressed pineapple and tiger nut. Blended fresh in small batches.",

  /**
   * Public origin of the deployed site, no trailing slash. Social previews and
   * canonical URLs are resolved against it. Set NEXT_PUBLIC_SITE_URL in your
   * host's environment to override it per deployment.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vincents.com",

  // Contact + order handoff
  phone: "+1 (646) 707-2097",
  /** Digits only, with country code. Used to build wa.me links. */
  whatsapp: "16467072097",
  email: "orders@vincents.com",

  // Where you operate
  city: "Elizabeth, NJ",
  serviceArea: "New Jersey & New York",
  hours: "Wed – Sun · 9am – 6pm",

  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },

  /** Minimum lead time for event orders, in days. Shown on the quote form. */
  eventLeadTimeDays: 4,
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/events", label: "Events & Bulk" },
  { href: "/kitchen", label: "Kitchen" },
  { href: "/about", label: "About" },
] as const;
