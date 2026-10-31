/**
 * Product catalog. Prices are in whole cents — never floats — so cart totals
 * stay exact. `category` exists so the future meals menu drops in here without
 * a refactor.
 */

export type Category = "drink" | "meal";

export type Size = {
  id: string;
  label: string;
  /** The size as it is sold: "12 oz" for a bottle, "Full pan" for a meal. */
  volume: string;
  /** What is cooked into it, for rice sold by the pan: "goat", "turkey".
   * Rice and protein are one price rather than two, so what goes on the rice
   * is part of the size the customer picks — priced on the server and carried
   * onto the kitchen's ticket, which a note in a free-text field would not be.
   * Absent means the rice on its own, and every drink. */
  with?: string;
  priceCents: number;
};

/**
 * How a chosen size is written down: "Full pan with goat".
 *
 * The cart, the WhatsApp handoff and the dashboard all read this one string,
 * so a choice that moved the price can never be lost on the way to the
 * kitchen.
 */
export const sizeName = (size: Size) =>
  size.with ? `${size.volume} with ${size.with}` : size.volume;

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** One line, describing what is actually in the drink. This is the only
   * prose a product gets — the photograph does the rest of the talking. */
  blurb: string;
  /** Placeholder photography under /public/images, named by slug. Optional:
   * the Kpataashie pans are sold off a typographic menu rather than a grid of
   * photographs, and a shot dropped in at /images/<slug>.jpg later needs no
   * code change. */
  image?: string;
  /** Drinks list what is in them on their product page. A pan says what it is
   * in its `blurb` instead, so this is optional. */
  ingredients?: string[];
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

/**
 * Kpataashie sells by the pan, so a pan is a size the way 8 oz is a size.
 *
 * Dollars in, cents out — the kitchen quotes round numbers and everything
 * downstream wants cents.
 */
export const panServes = { half: "7 – 10", full: "15 – 20" } as const;

/** Soup is sold by the pot and has no half. */
const pot = (dollars: number): Size[] => [
  { id: "full", label: "Sold by the pot", volume: "Full pot", priceCents: dollars * 100 },
];

/**
 * A pan of rice, priced by what is cooked into it.
 *
 * The kitchen charges the same for jollof and fried rice, so one table prices
 * both. Protein is never sold by the pan on its own — it comes on rice — so
 * these are the only prices it has, and the pairings that used to be products
 * of their own ("jollof and turkey") are a protein chosen here instead.
 */
const ricePrices: { with?: string; half: number; full: number }[] = [
  { half: 80, full: 150 },
  { with: "chicken", half: 120, full: 220 },
  { with: "turkey", half: 120, full: 220 },
  { with: "goat", half: 160, full: 240 },
];

/** The eight ways a pan of rice is sold: four proteins against two sizes. */
const rice = (): Size[] =>
  ricePrices.flatMap((row) =>
    (["half", "full"] as const).map((size) => ({
      id: row.with ? `${row.with}-${size}` : size,
      label: `Feeds ${panServes[size]}`,
      volume: size === "half" ? "Half pan" : "Full pan",
      ...(row.with ? { with: row.with } : {}),
      priceCents: row[size] * 100,
    })),
  );

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
    slug: "fura",
    name: "Fura-liscious",
    category: "drink",
    blurb: "Northern Ghana's millet drink, blended with milk and poured cold. No sugar.",
    image: "/images/fura.jpg",
    ingredients: ["Millet", "Milk"],
    // Priced with the corn shake: $6.99 and $9.99.
    sizes: size(699, 999),
    // Milk on the card as well as in the list, as on the corn shake: the two
    // drinks here that are not dairy-free say so before you open the page.
    tags: ["Alcohol-free", "No sugar", "Contains milk"],
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
  /**
   * Kpataashie — the kitchen, priced the way the kitchen quotes it.
   *
   * Rice is the product and the protein is a size of it, because that is how
   * it is sold and priced: a half pan of jollof is $80 plain and $160 with
   * goat, one figure covering both halves of the dish. Turkey and chicken have
   * no price of their own for the same reason — they are not sold by the pan
   * without rice under them.
   *
   * Soup is the exception and stays its own product: a pot of goat light soup
   * eaten with fufu is a different dish from goat on a pan of rice.
   *
   * Nothing else is priced here. The peppered goat, the gɔbɛ and anything off
   * the list is still quoted by message, and guessing a figure for them would
   * be inventing one.
   */
  {
    slug: "jollof-rice",
    name: "Jollof rice",
    category: "meal",
    blurb: "Ghanaian jollof, cooked to order by the pan.",
    sizes: rice(),
  },
  {
    slug: "fried-rice",
    name: "Fried rice",
    category: "meal",
    blurb: "Vegetable fried rice, cooked to order by the pan.",
    sizes: rice(),
  },
  {
    slug: "goat-light-soup",
    name: "Goat light soup",
    category: "meal",
    blurb: "Served with fufu or plain rice.",
    sizes: pot(120),
  },
  {
    slug: "goat-groundnut-soup",
    name: "Goat groundnut soup",
    category: "meal",
    blurb: "Served with omotuo or fufu.",
    sizes: pot(120),
  },
  {
    slug: "goat-palm-nut-soup",
    name: "Goat palm nut soup",
    category: "meal",
    blurb: "Served with omotuo or fufu.",
    sizes: pot(120),
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
export const meals = products.filter((p) => p.category === "meal");

/**
 * Kpataashie — the food menu. ("Kpataashie" is Ga for kitchen.)
 *
 * The named dishes are the showcase: what the kitchen cooks, said the way it
 * sells it. They are not what you add to the cart — a pan is rice, protein or
 * soup, and the same jollof pan is three different dish names depending on
 * what goes beside it. The pan list does the ordering.
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
 * The pan list, grouped the way the kitchen quotes it.
 *
 * Each row is a `Product` from the catalog above, so the price list and the
 * order form are the same list — there is no second place a price can drift
 * out of step.
 */
export type MealGroup = { heading: string; items: Product[] };

const group = (heading: string, ...slugs: string[]): MealGroup => ({
  heading,
  items: slugs.map((slug) => {
    const product = getProduct(slug);
    // A typo here is a missing row on a live menu, so it fails the build
    // rather than quietly shortening the list.
    if (!product) throw new Error(`kpataashieGroups: no product "${slug}"`);
    return product;
  }),
});

export const kpataashieGroups: MealGroup[] = [
  group("Rice, by the pan", "jollof-rice", "fried-rice"),
  group(
    "Soup, by the pot",
    "goat-light-soup",
    "goat-groundnut-soup",
    "goat-palm-nut-soup",
  ),
];

/** How many a pan feeds. The question every caterer is asked first. */
export const panServings = [
  { size: "Full pan", serves: `${panServes.full} people` },
  { size: "Half pan", serves: `${panServes.half} people` },
];

export const kpataashieNotes = [
  "Proteins can be swapped to your preference.",
  "Other options include chicken, tilapia, veal, mackerel and tuna.",
  "Anything marked optional can be left out — just say so when you order.",
];
