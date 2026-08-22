# Vincent’s

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
- Each product has an `image` path pointing at `public/images/<slug>.jpg`. Keep
  the filename matched to the slug and swapping in a new photograph needs no
  code change.
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

Every product and hero is a photograph rendered through `next/image`, referenced
by the catalog's `image` field. The current set is AI-generated placeholder
photography — replace a file in `public/images/` with a real shot of the same
name and nothing else needs to change.

Type is Fraunces (display) and Plus Jakarta Sans (body). The palette is cream,
terracotta, amber and deep palm green, defined once in `globals.css`.

## Receiving orders by email

Every order, event quote and kitchen signup is written to the server log — a
record you can read in your hosting dashboard — and emailed to you through
[Resend](https://resend.com) as it arrives.

Email is off until you set a key, so nothing is sent in development:

| Variable | What it does |
| --- | --- |
| `RESEND_API_KEY` | Turns email on. Without it, submissions are logged only. |
| `ORDER_EMAIL_FROM` | Sender. Must be on a domain verified with Resend. Defaults to their test sender, which only delivers to your own Resend account address. |
| `ORDER_EMAIL_TO` | Where notifications land. Defaults to the `email` in `src/lib/site.ts`. |

Copy `.env.example` to `.env.local` for local use, and set the same variables in
your host's dashboard for production.

A send failure is logged and swallowed on purpose — a bounced notification must
never cost a customer their order. If email goes quiet, the log is still
complete. Any other destination you want (a webhook, a spreadsheet, a database)
belongs in `record()` in `src/app/actions.ts`, alongside the email call.

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

- [x] Real business name, phone, WhatsApp number and email in `src/lib/site.ts`
- [x] Email notifications wired into `record()` — set `RESEND_API_KEY` to switch them on
- [x] `metadataBase` set, driven by `site.url` in `src/lib/site.ts`
- [ ] Real prices in `src/lib/catalog.ts`
- [ ] Confirm the WhatsApp number receives messages
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain once it is decided — social
      previews currently resolve against the `https://vincents.com` placeholder
- [ ] Verify your sending domain with Resend, then set `ORDER_EMAIL_FROM`
- [ ] Product photography — `public/images/` is AI-generated placeholder work
- [ ] Real Instagram and TikTok links in `site.socials`
