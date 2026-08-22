/**
 * Single source of truth for business details.
 * Change these values and the whole site updates — nothing else hardcodes them.
 */
export const site = {
  name: "Vincent’s",
  tagline: "Tropical blends, made properly.",
  description:
    "Small-batch piña colada and tropical blends made with real coconut, mango, pineapple and tiger nut. Order by the bottle, or by the crowd.",

  // Contact + order handoff
  phone: "+1 (555) 014-2200",
  /** Digits only, with country code. Used to build wa.me links. */
  whatsapp: "15550142200",
  email: "orders@vincents.co",

  // Where you operate
  city: "Brooklyn, NY",
  serviceArea: "Brooklyn, Manhattan & Queens",
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
