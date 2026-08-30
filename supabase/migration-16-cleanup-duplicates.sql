-- ============================================================================
-- PUNCH — migration 16: cleanup duplicates from migration-15.
-- migration-15 used "on conflict do nothing" but there's no unique constraint
-- on name/kind for it to check against, so re-running it created duplicate
-- rows instead of being skipped. This removes the duplicates (keeping the
-- oldest copy of each) and makes sure kind + featured are set correctly
-- everywhere. Safe to re-run.
-- ============================================================================

-- 0) Make sure the featured column exists (in case migration-15 never
--    fully completed on this project).
alter table public.products add column if not exists featured boolean not null default false;

-- 1) Remove duplicate rows for the 7 new products, keeping only the oldest
--    copy of each (by created_at, with ctid as a tiebreaker for identical
--    timestamps).
delete from public.products a
using public.products b
where a.name = b.name
  and a.name in (
    'Ringside Apex Flash Sparring Gloves',
    'Youth Boxing Gloves',
    'Buddha Fight Wear Boxing Gloves',
    'Ringside Apex Handwraps — 180"',
    'Ringside Gel Quick Wraps',
    'Tactical Gym Bag — Camo',
    'Ringside Boxing Club Gym Bag'
  )
  and (a.created_at, a.ctid) > (b.created_at, b.ctid);

-- 2) Make sure the survivors are correctly tagged (kind + not featured, so
--    they show in the dynamic "Shop More Gear" grid).
update public.products
set kind = 'equipment', featured = false
where name in (
    'Ringside Apex Flash Sparring Gloves',
    'Youth Boxing Gloves',
    'Buddha Fight Wear Boxing Gloves',
    'Ringside Apex Handwraps — 180"',
    'Ringside Gel Quick Wraps',
    'Tactical Gym Bag — Camo',
    'Ringside Boxing Club Gym Bag'
);

-- 3) Re-confirm the original 3 coach-picks are equipment + featured (so
--    they're correctly excluded from the dynamic grid — they're already
--    shown as static cards higher up on the page).
update public.products
set kind = 'equipment', featured = true
where name in ('Pro Boxing Gloves — 14oz', 'Mid-Range Boxing Gloves — 14oz', 'Quick Wraps — Medium or Large');

-- 4) Sanity check — run this after the above to confirm exactly one row
--    per product name, all correctly tagged. Should return 10 rows total,
--    each with count = 1.
select name, kind, featured, count(*) as row_count
from public.products
where name in (
    'Pro Boxing Gloves — 14oz','Mid-Range Boxing Gloves — 14oz','Quick Wraps — Medium or Large',
    'Ringside Apex Flash Sparring Gloves','Youth Boxing Gloves','Buddha Fight Wear Boxing Gloves',
    'Ringside Apex Handwraps — 180"','Ringside Gel Quick Wraps','Tactical Gym Bag — Camo','Ringside Boxing Club Gym Bag'
)
group by name, kind, featured
order by name;
