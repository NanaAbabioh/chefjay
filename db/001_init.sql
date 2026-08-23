-- Vincent's — order storage.
--
-- Run this once against your Neon database:
--   psql "$DATABASE_URL" -f db/001_init.sql
--
-- Two conventions carry over from the application code and matter here:
--
--   * Money is integer cents. Never a float, never numeric-with-scale — the
--     same rule the catalog and cart follow, so totals stay exact end to end.
--
--   * Line items snapshot their own price. The cart deliberately stores only
--     ids and re-reads prices from the catalog, which is right for a live cart
--     and wrong for history: raising a price must not rewrite what a customer
--     was charged last month. So name, volume and unit_cents are copied in at
--     order time and never read back from the catalog.

create table if not exists orders (
  id             bigserial primary key,
  ref            text        not null unique,
  status         text        not null default 'new'
                 check (status in ('new','confirmed','preparing','ready','completed','cancelled')),

  -- Customer, as given to us. Kept verbatim; this is what you ring.
  name           text        not null,
  phone          text        not null,
  email          text,

  method         text        not null check (method in ('delivery','pickup')),
  address        text,
  preferred_time text,
  notes          text,

  -- Totals as computed on the server at order time.
  subtotal_cents integer     not null check (subtotal_cents >= 0),
  delivery_cents integer     not null check (delivery_cents >= 0),
  total_cents    integer     not null check (total_cents >= 0),

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists order_items (
  id          bigserial primary key,
  order_id    bigint  not null references orders(id) on delete cascade,

  -- Ids, so you can still group by product across history.
  slug        text    not null,
  size_id     text    not null,

  -- Snapshot of what this actually was, and cost, on the day.
  name        text    not null,
  volume      text    not null,
  qty         integer not null check (qty > 0),
  unit_cents  integer not null check (unit_cents >= 0),
  line_cents  integer not null check (line_cents >= 0)
);

create table if not exists event_quotes (
  id           bigserial primary key,
  ref          text        not null unique,
  status       text        not null default 'new'
               check (status in ('new','quoted','won','lost')),

  name         text        not null,
  phone        text        not null,
  email        text        not null,

  package_id   text,
  event_type   text,
  -- Free text on purpose: the form asks for a date and guest count in the
  -- customer's own words, and "the 14th, maybe 60 people" is a real answer.
  event_date   text,
  guests       text,
  venue        text,
  flavors      text[]      not null default '{}',
  notes        text,

  -- What you quoted them, once you have. Null until then.
  quoted_cents integer     check (quoted_cents >= 0),

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists kitchen_signups (
  id         bigserial primary key,
  email      text        not null unique,
  created_at timestamptz not null default now()
);

-- The dashboard reads newest-first and filters by status; events are read by
-- how soon they are.
create index if not exists orders_created_at_idx  on orders (created_at desc);
create index if not exists orders_status_idx      on orders (status);
create index if not exists order_items_order_idx  on order_items (order_id);
create index if not exists quotes_created_at_idx  on event_quotes (created_at desc);
create index if not exists quotes_status_idx      on event_quotes (status);
