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
  /** One line, used on cards. */
  blurb: string;
  /** Full paragraph, used on the product page. */
  story: string;
  ingredients: string[];
  sizes: Size[];
  /** Two hex stops used to render the drink illustration. */
  pour: { top: string; bottom: string };
  tags?: string[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "sunroot-signature",
    name: "Sunroot Signature",
    category: "drink",
    blurb: "The house blend — coconut, mango, pineapple and tiger nut.",
    story:
      "The one we built the business around. Tiger nut is soaked overnight and pressed into a milk with real body, then blended with ripe mango, cold-pressed pineapple and young coconut. Creamy without a drop of dairy, sweet without a spoon of refined sugar.",
    ingredients: ["Tiger nut", "Young coconut", "Mango", "Pineapple", "Date", "Sea salt"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 750 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 950 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3200 },
    ],
    pour: { top: "#F7D9A6", bottom: "#E0A45C" },
    tags: ["Dairy-free", "No refined sugar"],
    featured: true,
  },
  {
    slug: "classic-pina-colada",
    name: "Classic Piña Colada",
    category: "drink",
    blurb: "Pineapple and coconut cream. Nothing to hide behind.",
    story:
      "Cold-pressed pineapple folded into coconut cream and a little lime to keep it bright. Served alcohol-free by default — add your own rum at home, or ask us to build it as a mixer base for your bar.",
    ingredients: ["Pineapple", "Coconut cream", "Lime", "Cane sugar"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 700 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 900 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3000 },
    ],
    pour: { top: "#FDF0D2", bottom: "#F3C877" },
    tags: ["Alcohol-free", "Mixer base"],
    featured: true,
  },
  {
    slug: "mango-sunrise",
    name: "Mango Sunrise",
    category: "drink",
    blurb: "Alphonso mango, pineapple, a whisper of coconut.",
    story:
      "Mango-forward and lighter than the Signature. We use Alphonso when the season allows and Kent the rest of the year, which is why this one tastes a little different in July than it does in January. That is on purpose.",
    ingredients: ["Mango", "Pineapple", "Coconut water", "Lime"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 750 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 950 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3200 },
    ],
    pour: { top: "#FFCF7A", bottom: "#EE8B3C" },
    tags: ["Seasonal fruit"],
    featured: true,
  },
  {
    slug: "tiger-nut-horchata",
    name: "Tiger Nut Horchata",
    category: "drink",
    blurb: "Atadwe, dates and warm spice. Creamy, earthy, ancient.",
    story:
      "Known as atadwe in Ghana and kunun aya in Nigeria, tiger nut milk has been made this way for centuries. We soak, press and spice it with cinnamon and a little nutmeg. This is the drink that surprises people the most.",
    ingredients: ["Tiger nut", "Date", "Cinnamon", "Nutmeg", "Vanilla"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 800 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 1000 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3400 },
    ],
    pour: { top: "#F0E3CE", bottom: "#CBA97E" },
    tags: ["Dairy-free", "Nut-free"],
  },
  {
    slug: "pineapple-ginger",
    name: "Pineapple Ginger",
    category: "drink",
    blurb: "Sharp, cold-pressed, and honestly a little aggressive.",
    story:
      "No coconut, no cream — just pineapple pressed with a serious amount of fresh ginger and lime. The one our regulars buy by the jug and drink through the week.",
    ingredients: ["Pineapple", "Ginger", "Lime", "Cane sugar"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 700 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 900 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3000 },
    ],
    pour: { top: "#FBE38C", bottom: "#E3A621" },
    tags: ["Spicy", "No dairy"],
  },
  {
    slug: "coconut-cloud",
    name: "Coconut Cloud",
    category: "drink",
    blurb: "Young coconut and vanilla bean. The quiet one.",
    story:
      "Young coconut flesh blended with its own water and a real vanilla bean. Barely sweet. This is what we drink ourselves at the end of a long production day.",
    ingredients: ["Young coconut", "Coconut water", "Vanilla bean"],
    sizes: [
      { id: "12", label: "Single", volume: "12 oz", priceCents: 750 },
      { id: "16", label: "Large", volume: "16 oz", priceCents: 950 },
      { id: "64", label: "Jug", volume: "64 oz", priceCents: 3200 },
    ],
    pour: { top: "#FBF6EC", bottom: "#DFD3BE" },
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
    summary: "Attended drink station with a Sunroot host for the length of your event.",
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
