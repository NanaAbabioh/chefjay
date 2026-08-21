# Sunroot

Marketing and ordering site for a small-batch tropical drinks business, built to
serve two very different customers from one codebase: someone buying a single
bottle, and someone buying for two hundred guests.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4.

```bash
npm run dev
```

## The two order paths

| Path | Route | How it completes |
| --- | --- | --- |
| Individual | `/shop` → `/shop/[slug]` → `/cart` | Cart, then a details form. Prices are exact. |
| Events & bulk | `/events` | Package picker, then a quote form. No prices charged — every event is quoted by hand. |

Both paths end the same way: a server action validates the submission, records
it, and returns a reference plus a prefilled WhatsApp and email link. **No
payment is taken online.** You confirm by message and collect payment your own
way. See "Taking payment online" below when you are ready to change that.

## Where to change things

Almost everything a non-developer needs to edit lives in two files.

### `src/lib/site.ts` — the business

Business name, tagline, phone, WhatsApp number, email, city, service area,
opening hours, socials, and the event lead time. Changing the name here changes
it everywhere, including page titles, the footer and the logo.

The WhatsApp number must be **digits only, with country code** — `15550142200`,
not `+1 (555) 014-2200`. That is what `wa.me` links need.

### `src/lib/catalog.ts` — what you sell

Products, sizes, prices and event packages.

- **Prices are in whole cents.** `750` is $7.50. This is deliberate — floating
  point money produces totals that are off by a penny, so nothing in this
  codebase ever stores a price as a decimal.
- Each product has a `pour` color pair. That pair draws the drink illustration,
  so a new product looks right without a photograph.
- `category` is `"drink" | "meal"`. The meals menu drops straight in here when
  the kitchen launches — no restructuring needed.

Delivery thresholds live in `src/lib/cart.ts` (`FREE_DELIVERY_CENTS`,
`DELIVERY_FEE_CENTS`).

## How the code is arranged

```
src/
  app/
    actions.ts          Server actions — the only place orders are handled
    layout.tsx          Fonts, header, footer, cart provider
    globals.css         Design tokens (colors, fonts, grain)
    shop/ events/ cart/ kitchen/ about/ contact/
  components/
    cart/               Cart state (localStorage) + the checkout screen
    product/            Cards, size picker, drink illustration
    forms/              Event quote, kitchen waitlist, handoff panel
    site/               Header, footer, logo
    ui/                 Button, form fields, layout container
  lib/                  site config, catalog, cart maths, message builders
```

Cart state lives in `localStorage` and holds only `{slug, sizeId, qty}` —
**prices are always re-read from the catalog**, so a price change never leaves a
stale total sitting in a customer's browser.

## Design notes

There is no photography yet. Rather than use stock imagery, every drink is drawn
by `components/product/DrinkGlass.tsx` from its own two catalog colors. When you
have real shots, replace that one component with `next/image` — nothing else
needs to change.

Type is Fraunces (display) and Plus Jakarta Sans (body). The palette is cream,
terracotta, amber and deep palm green, defined once in `globals.css`.

## Receiving orders by email

Orders are currently written to the server log — visible in your hosting
dashboard. That is a record, not a notification. To also get them by email, add
your provider's send call inside `record()` in `src/app/actions.ts`. It is one
function and it is the only place that needs to change.

## Taking payment online

When you want card or wallet checkout, the change is contained:

1. Add your processor's SDK and keys.
2. In `submitOrder`, create a payment intent from the server-computed total —
   never a total sent from the browser.
3. Replace the WhatsApp handoff in `components/forms/Handoff.tsx` with the
   processor's confirmation step.

The totals are already computed server-side in `submitOrder`, which is the part
that usually has to be rewritten. It does not here.

## Before going live

- [ ] Real business name, phone, WhatsApp number and email in `src/lib/site.ts`
- [ ] Real prices in `src/lib/catalog.ts`
- [ ] Confirm the WhatsApp number receives messages
- [ ] Email notifications wired into `record()`
- [ ] Product photography, if you have it
- [ ] `metadataBase` set in `src/app/layout.tsx` for correct social preview URLs
