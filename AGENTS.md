<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Chef Jay’s — project notes

A drinks ordering site. Read `README.md` first; it explains the two order paths
and where business details live.

## Rules specific to this codebase

- **Money is integer cents, everywhere.** `750` means $7.50. Never introduce a
  float price, and never compute a total in the browser and trust it on the
  server — `submitOrder` recomputes totals from the catalog on purpose.
- **Business facts belong in `src/lib/site.ts`.** Do not hardcode a phone
  number, email, city or business name into a component.
- **Products belong in `src/lib/catalog.ts`.** Drinks and Kpataashie pans are
  both `Product`s and both go through the same cart; `category` tells them
  apart. Never price a pan the kitchen has not priced — see the README.
- **The cart stores ids, not prices.** `{slug, sizeId, qty}` only. Prices are
  resolved from the catalog on every render so stale localStorage cannot produce
  a wrong total. A per-line choice that moves the price has to be part of the
  size — that is why a rice pan's protein is a `Size` and not a note. A swap
  that costs nothing goes in the order's notes field.
- **The two offers are not interchangeable.** The free nth bottle counts
  bottles only; the percentage comes off food only. `discounts()` keeps them
  itemised all the way to the WhatsApp message, because a single netted figure
  tells neither the customer nor the kitchen where the money went.
- **`className` on `ui/Field` components applies to the wrapper, not the
  control.** Passing layout classes is safe; the input keeps its own styling.
- **Product imagery lives in `public/images/<slug>.jpg`** and is referenced by
  the catalog's `image` field. The current set is AI-generated placeholder
  photography to be replaced with real shots; keep the filenames slug-matched
  so swapping one in needs no code change. `image` is optional — the pans
  have none yet and fall back to a typographic tile.

## Verifying changes

`npm run dev`, then exercise the flow you touched. Both order forms log their
result to the server console, which is the fastest way to confirm an order was
captured correctly. `npx next build` and `npx eslint .` should both stay clean.
