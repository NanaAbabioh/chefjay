-- Grand opening: the free-bottle discount, stored per order.
--
-- Kept as its own column rather than folded into total_cents, so takings can
-- be read two ways later: what was charged, and what the promotion cost. A
-- default of 0 means every order written before the offer existed stays valid.

alter table orders add column if not exists discount_cents int not null default 0;
