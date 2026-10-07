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
 * Descriptions are written per flavour, not assembled from a shared stem.
 *
 * They used to be: one constant plus the flavour appended. That kept the copy
 * honest against the recipe, but it meant all eight opened with the same
 * eleven words and the only distinguishing word landed last — on a grid, eight
 * cards that read as the same drink. So each one now leads with what makes it
 * different, and refers back to the base in its own words. The ingredient list
 * below still carries the factual record.
 */
const BASE_INGREDIENTS = ["Pineapple", "Coconut cream", "Lime", "Cane sugar"];

/**
 * Two sizes per flavour, the larger a flat two dollars more whatever the
 * flavour costs. Volumes and prices show in the cart, on the WhatsApp handoff
 * and in the dashboard — changing them here changes them everywhere.
 *
 * The 8 oz keeps the id "std" it has always had. Carts live in the browser's
 * storage as {slug, sizeId, qty}, so renaming it would silently empty every
 * basket saved before today: `resolveLines` drops a line whose size no longer
 * exists, by design, and the customer would never be told why.
 */
const LARGE_PREMIUM_CENTS = 200;

/** The 12 oz is two dollars more unless a drink prices it itself. */
const size = (
  priceCents: number,
  largeCents: number = priceCents + LARGE_PREMIUM_CENTS,
) => [
  { id: "std", label: "Bottle", volume: "8 oz", priceCents },
  { id: "lg", label: "Bottle", volume: "12 oz", priceCents: largeCents },
];

export const products: Product[] = [
  {
    slug: "classic-pina-colada",
    name: "Classic Piña Colada",
    category: "drink",
    blurb: "Pineapple, coconut cream and a squeeze of lime. The base everything else is built on.",
    image: "/images/classic-pina-colada.jpg",
    ingredients: BASE_INGREDIENTS,
    sizes: size(499),
    tags: ["Alcohol-free", "Mixer base"],
  },
  {
    slug: "classic-less-sugar-pina-colada",
    name: "Classic Piña Colada (Less Sweet)",
    category: "drink",
    blurb: "The same Classic, just less sweet.",
    image: "/images/classic-less-sugar-pina-colada.jpg",
    ingredients: BASE_INGREDIENTS,
    sizes: size(499),
    tags: ["Alcohol-free", "Less sweet"],
  },
  {
    slug: "mango-pina-colada",
    name: "Mango Piña Colada",
    category: "drink",
    blurb: "Sun-ripe mango folded through the classic.",
    image: "/images/mango-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Mango"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "tigernut-pina-colada",
    name: "Tigernut Piña Colada",
    category: "drink",
    blurb: "Earthy tiger nut over a classic piña colada base.",
    image: "/images/tigernut-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Tiger nut"],
    sizes: size(699),
    tags: ["Alcohol-free", "Dairy-free"],
  },
  {
    slug: "peach-pina-colada",
    name: "Peach Piña Colada",
    category: "drink",
    blurb: "Soft peach, barely sweet, on pineapple and coconut cream.",
    image: "/images/peach-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Peach"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "passion-fruit-pina-colada",
    name: "Passion Fruit Piña Colada",
    category: "drink",
    blurb: "Sharp passion fruit cutting through the house colada.",
    image: "/images/passion-fruit-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Passion fruit"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "strawberry-pina-colada",
    name: "Strawberry Piña Colada",
    category: "drink",
    blurb: "Ripe strawberry blended into the coconut base.",
    image: "/images/strawberry-pina-colada.jpg",
    ingredients: [...BASE_INGREDIENTS, "Strawberry"],
    sizes: size(599),
    tags: ["Alcohol-free"],
  },
  {
    slug: "gold-coast-corn-shake",
    name: "Gold Coast Corn Shake",
    category: "drink",
    blurb: "Mashed kenkey blended with milk and sugar, poured cold.",
    image: "/images/gold-coast-corn-shake.jpg",
    ingredients: ["Kenkey (fermented corn)", "Milk", "Sugar"],
    // The only drink that prices its own 12 oz: $6.99 and $9.99, a three
    // dollar step rather than the usual two.
    sizes: size(699, 999),
    // Milk is called out on the card as well as in the list: it is the one
    // drink here that is not dairy-free, and an allergy should not depend on
    // someone opening the product page to find out.
    tags: ["Alcohol-free", "Contains milk"],
  },
  {
    slug: "raspberry-pina-colada",
    name: "Raspberry Piña Colada",
    category: "drink",
    blurb: "Tart raspberry against sweet pineapple and coconut.",
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
 * and ordered by message: a pan feeds a room, proteins get swapped, and the
 * final number wants agreeing by hand. The price list below is what a pan
 * costs; it is priced by pan and protein rather than by dish, so it is kept
 * separate from the menu rather than bolted onto each name.
 */
export type MenuItem = {
  /** The name it is sold under. */
  name: string;
  /** The plain-English dish, and what it is served with. Shown underneath the
   * name, in italics — the menu name sells it, this line says what it is. */
  dish: string;
};

export const kpataashieMenu: MenuItem[] = [
  {
    name: "Golden Savannah Jollof Royale",
    dish: "Ghanaian jollof rice with fried turkey",
  },
  {
    name: "Imperial Garden Fried Rice",
    dish: "Vegetable fried rice with fried turkey — egg and sausage optional",
  },
  {
    name: "Ember-Kissed Goat in Crimson Pepper Sauce",
    dish: "Spicy peppered goat in sauce with plain rice",
  },
  {
    name: "Velvet Peanut Goat Royale",
    dish: "Goat groundnut soup with omotuo or fufu",
  },
  {
    name: "Gold Palm Nut Goat Soup",
    dish: "Goat palm nut soup with omotuo or fufu",
  },
  {
    name: "Crimson Deluxe Goat Soup",
    dish: "Goat light soup with fufu or plain rice",
  },
  {
    name: "Rustic Beans with Caramelized Plantains",
    dish: "Gɔbɛ — gari and beans with fried plantain, egg optional",
  },
];

/**
 * Shown under the menu. Kept separate from the dishes because they qualify
 * every one of them.
 */
/**
 * What a pan costs. Rice, protein and soup are priced on their own because
 * that is how the kitchen sells them — a jollof pan with turkey is two lines,
 * not one dish. The pairs at the end are the combinations that come cheaper
 * bought together than apart.
 */
export type PanPrice = {
  name: string;
  /** Dollars, whole — the kitchen quotes round numbers. */
  half?: number;
  full?: number;
  /** Shown instead of the two columns where only one size exists. */
  note?: string;
};

export type PanGroup = { heading: string; rows: PanPrice[] };

export const kpataashiePricing: PanGroup[] = [
  {
    heading: "Rice",
    rows: [{ name: "Jollof rice or fried rice", half: 80, full: 150 }],
  },
  {
    heading: "Protein",
    rows: [
      { name: "Fried turkey", half: 70, full: 125 },
      { name: "Chicken", half: 60, full: 100 },
    ],
  },
  {
    heading: "Soup",
    rows: [{ name: "Goat soup", full: 120, note: "Full pot" }],
  },
  {
    heading: "Together, by the full pan",
    rows: [
      { name: "Jollof and goat", full: 240 },
      { name: "Jollof and turkey or chicken", full: 220 },
    ],
  },
];

/** How many a pan feeds. The question every caterer is asked first. */
export const panServings = [
  { size: "Full pan", serves: "15 – 20 people" },
  { size: "Half pan", serves: "7 – 10 people" },
];

export const kpataashieNotes = [
  "Proteins can be swapped to your preference.",
  "Other options include chicken, tilapia, veal, mackerel and tuna.",
  "Anything marked optional can be left out — just say so when you order.",
];
