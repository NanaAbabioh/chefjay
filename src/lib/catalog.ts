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
  /** One line, describing what is actually in the drink. This is the only
   * prose a product gets — the photograph does the rest of the talking. */
  blurb: string;
  /** Placeholder photography under /public/images, named by slug. */
  image: string;
  ingredients: string[];
  sizes: Size[];
  tags?: string[];
};

/**
 * One shared description, with the flavour added on the end — every drink is
 * the same build, so the copy says so.
 */
const BASE = "Ripe pineapple whipped through thick coconut cream, with a squeeze of lime";
const BASE_INGREDIENTS = ["Pineapple", "Coconut cream", "Lime", "Cane sugar"];

/**
 * One size per flavour. Confirmed with the caterer. This shows in the cart,
 * on the WhatsApp handoff and in the dashboard — changing it here changes it
 * everywhere.
 */
const VOLUME = "8 oz";
const size = (priceCents: number) => [
  { id: "std", label: "Bottle", volume: VOLUME, priceCents },
];

export const products: Product[] = [
  {
    slug: "classic-pina-colada",
    name: "Classic Piña Colada",
    category: "drink",
    blurb: `${BASE}.`,
    image: "/images/classic-pina-colada.jpg",
    ingredients: BASE_INGREDIENTS,
    sizes: size(499),
    tags: ["Alcohol-free", "Mixer base"],
  },
  {
    slug: "mango-pina-colada",
    name: "Mango Piña Colada",
    category: "drink",
    blurb: `${BASE}, and sweet ripe mango.`,
    image: "/images/mango-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Mango"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "tigernut-pina-colada",
    name: "Tigernut Piña Colada",
    category: "drink",
    blurb: `${BASE}, and creamy tiger nut.`,
    image: "/images/tigernut-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Tiger nut"],
    sizes: size(699),
    tags: ["Alcohol-free", "Dairy-free"],
  },
  {
    slug: "passion-fruit-pina-colada",
    name: "Passion Fruit Piña Colada",
    category: "drink",
    blurb: `${BASE}, and sharp passion fruit.`,
    image: "/images/passion-fruit-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Passion fruit"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "strawberry-pina-colada",
    name: "Strawberry Piña Colada",
    category: "drink",
    blurb: `${BASE}, and ripe strawberry.`,
    image: "/images/strawberry-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Strawberry"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "raspberry-pina-colada",
    name: "Raspberry Piña Colada",
    category: "drink",
    blurb: `${BASE}, and tart raspberry.`,
    image: "/images/raspberry-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Raspberry"],
    sizes: size(599),
    tags: ["Alcohol-free"],
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
    price: "Starting from $185",
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

/**
 * Kpataashie — the food menu. ("Kpataashie" is Ga for kitchen.)
 *
 * Deliberately not a `Product`. These are shown so people know what is on,
 * and ordered by message: pan sizes and proteins want confirming by hand, and
 * nothing here has a fixed online price yet. When it does, each item becomes a
 * `Product` with `category: "meal"` and drops into the array above — which is
 * what that field was put there for.
 */
export type MenuItem = {
  name: string;
  /** Portions, or the choice that comes with it. */
  detail?: string;
};

export const kpataashieMenu: MenuItem[] = [
  { name: "Jollof rice", detail: "Half pan or full pan, with fried goat or turkey" },
  { name: "Fried rice", detail: "Half pan or full pan, with turkey or chicken" },
  { name: "Peppered goat sauce", detail: "With white rice and plantain" },
  { name: "Indomie" },
  { name: "Gobɛ" },
  { name: "Goat light soup" },
  { name: "Goat peanut butter soup" },
  { name: "Goat abɛnkwan" },
  { name: "Goat nkatebɛ" },
];
