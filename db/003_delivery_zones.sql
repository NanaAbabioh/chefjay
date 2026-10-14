-- Delivery priced by where it goes.
--
-- Two changes, both needed before an out-of-area order can be stored at all:
--
--   * delivery_zone records which band the customer picked (NJ / NY / other).
--     It is asked for in the cart, never inferred from the address.
--
--   * delivery_cents drops NOT NULL, because "we have not priced this yet" is
--     a real state and is not the same as zero. Storing 0 for an unpriced
--     delivery would read as free in the dashboard and in the takings.

alter table orders add column if not exists delivery_zone text;
alter table orders alter column delivery_cents drop not null;
