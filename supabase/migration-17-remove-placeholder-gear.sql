-- ============================================================================
-- PUNCH — migration 17: remove leftover placeholder gear rows.
-- "Punch Boxing Gloves" and "Hand Wraps" (category "Gloves & Wraps") have no
-- amazon_url/partner_url/stripe_url and reference the retired 7-Day Starter
-- Pack. They're being replaced by the real, linked products already in the
-- Gloves and Wraps categories. Safe to re-run.
-- ============================================================================

delete from public.products
where kind = 'equipment'
  and name in ('Punch Boxing Gloves', 'Hand Wraps')
  and category = 'Gloves & Wraps'
  and amazon_url is null
  and partner_url is null
  and stripe_url is null;

-- Sanity check — should return 0 rows after running the delete above.
select id, name, category from public.products
where kind = 'equipment' and name in ('Punch Boxing Gloves', 'Hand Wraps');
