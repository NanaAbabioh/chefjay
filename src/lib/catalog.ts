/**
 * Product catalog. Prices are in whole cents — never floats — so cart totals
 * stay exact. `category` exists so the future meals menu drops in here without
 * a refactor.
 */

export type Category = "drink" | "meal";

export type Size = {
  id: string;
  label: string;
  /** e.g. "12 oz" */
  volume: string;
  priceCents: number;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** One line. This is the only prose a product gets — the photograph does
   * the rest of the talking. */
  blurb: string;
  /** Placeholder photography under /public/images, named by slug. */
  image: string;
  ingredients: string[];
  sizes: Size[];
  tags?: string[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "house-signature",
    name: "House Signature",
    category: "drink",
    blurb: "The one we built the business around.",
    image: "/images/house-signature.jpg",
    ingredients: ["Tiger nut", "Young coconut", "Mango", "Pineapple", "Date", "Sea salt"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 750 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 950 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3200 },
    ],
    tags: ["Dairy-free", "No refined sugar"],
    featured: true,
  },
  {
    slug: "classic-pina-colada",
    name: "Classic Piña Colada",
    category: "drink",
    blurb: "Pineapple and coconut cream. Nothing to hide behind.",
    image: "/images/classic-pina-colada.jpg",
    ingredients: ["Pineapple", "Coconut cream", "Lime", "Cane sugar"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 700 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 900 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3000 },
    ],
    tags: ["Alcohol-free", "Mixer base"],
    featured: true,
  },
  {
    slug: "mango-sunrise",
    name: "Mango Sunrise",
    category: "drink",
    blurb: "Mango-forward, and lighter than it looks.",
    image: "/images/mango-sunrise.jpg",
    ingredients: ["Mango", "Pineapple", "Coconut water", "Lime"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 750 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 950 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3200 },
    ],
    tags: ["Seasonal fruit"],
    featured: true,
  },
  {
    slug: "tiger-nut-horchata",
    name: "Tiger Nut Horchata",
    category: "drink",
    blurb: "Earthy, spiced, and the one that surprises people.",
    image: "/images/tiger-nut-horchata.jpg",
    ingredients: ["Tiger nut", "Date", "Cinnamon", "Nutmeg", "Vanilla"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 800 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 1000 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3400 },
    ],
    tags: ["Dairy-free", "Nut-free"],
  },
  {
    slug: "pineapple-ginger",
    name: "Pineapple Ginger",
    category: "drink",
    blurb: "Sharp, cold-pressed, honestly a little aggressive.",
    image: "/images/pineapple-ginger.jpg",
    ingredients: ["Pineapple", "Ginger", "Lime", "Cane sugar"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 700 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 900 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3000 },
    ],
    tags: ["Spicy", "No dairy"],
  },
  {
    slug: "coconut-cloud",
    name: "Coconut Cloud",
    category: "drink",
    blurb: "The quiet one.",
    image: "/images/coconut-cloud.jpg",
    ingredients: ["Young coconut", "Coconut water", "Vanilla bean"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 750 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 950 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3200 },
    ],
    tags: ["Low sugar"],
  },
];

/**
 * Event packages. These are starting points for a quote, not a checkout —
 * every event gets confirmed by a human before anything is charged.
 */
export type EventPackage = {
  id: string;
  name: string;
  guests: string;
  /** Display price, e.g. "$69" or "from $4.25 / guest". */
  price: string;
  summary: string;
  includes: string[];
  popular?: boolean;
};

export const eventPackages: EventPackage[] = [
  {
    id: "dozen",
    name: "The Dozen",
    guests: "10 – 15 guests",
    price: "$78",
    summary: "A dozen chilled 12 oz bottles, mixed or matched. Drop-off only.",
    includes: [
      "12 × 12 oz bottles",
      "Up to 3 flavors",
      "Delivered chilled in an ice pack tote",
      "Free delivery within 5 miles",
    ],
  },
  {
    id: "party",
    name: "Party Pack",
    guests: "25 – 40 guests",
    price: "$185",
    summary: "Two 3-gallon dispensers, cups and ice. You pour, we handle the rest.",
    includes: [
      "2 × 3-gallon dispensers",
      "Up to 4 flavors",
      "50 compostable cups + ice",
      "Delivery, setup and same-day pickup",
    ],
    popular: true,
  },
  {
    id: "service",
    name: "Full Service",
    guests: "50 – 150 guests",
    price: "from $6.50 / guest",
    summary: "Attended drink station with one of our hosts for the length of your event.",
    includes: [
      "Attended station, up to 4 hours",
      "Unlimited pours, up to 6 flavors",
      "Garnish bar, cups, ice and linens",
      "Custom flavor developed for your event",
    ],
  },
  {
    id: "custom",
    name: "Something Else",
    guests: "150+ guests",
    price: "Let's talk",
    summary: "Weddings, corporate launches, multi-day festivals, standing accounts.",
    includes: [
      "Multiple stations and hosts",
      "Branded cups and signage",
      "Alcohol-ready mixer bases",
      "Invoicing and standing orders",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const drinks = products.filter((p) => p.category === "drink");
