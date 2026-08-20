-- ============================================================================
-- PUNCH — migration 11 : multi-page hero slides. Run after migration-10.sql.
-- Safe to re-run.
--
-- Generalizes hero_slides (originally homepage-only) to work on any page.
-- Existing homepage rows are untouched — they default to page='home', which
-- is exactly what they already represented.
-- ============================================================================
alter table public.hero_slides add column if not exists page text not null default 'home';

-- Existing rows created before this migration had no page value at all;
-- make sure they're explicitly tagged 'home' (they already were via the
-- column default above, this just covers any that slipped through with a
-- blank string instead of true NULL).
update public.hero_slides set page = 'home' where page is null or page = '';
