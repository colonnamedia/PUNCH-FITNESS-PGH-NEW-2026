-- ============================================================================
-- PUNCH — migration 10 : homepage hero slides (1-to-many). Run after previous
-- migrations. Safe to re-run.
--
-- Separate from page_media (migration-6) on purpose: page_media.slot is a
-- PRIMARY KEY (exactly one row per slot), so it can't hold multiple slides
-- for the same spot. This table supersedes the "home.hero_video" page_media
-- slot for the homepage hero specifically — with 0 rows here the homepage
-- falls back to its existing static hero untouched, with 1 row it behaves
-- like a single hero (no carousel chrome), with 2+ it becomes a slider.
-- Reuses the existing "site-media" storage bucket (already public-read +
-- authenticated-upload from migration-6) — no new bucket needed.
-- ============================================================================
create table if not exists public.hero_slides (
  id          uuid primary key default gen_random_uuid(),
  sort_order  int not null default 0,
  media_type  text not null check (media_type in ('video','image')),
  url         text not null,
  alt_text    text,
  created_at  timestamptz not null default now()
);

alter table public.hero_slides enable row level security;
drop policy if exists "hero_slides public read" on public.hero_slides;
drop policy if exists "hero_slides auth write"  on public.hero_slides;
drop policy if exists "hero_slides auth update" on public.hero_slides;
drop policy if exists "hero_slides auth delete" on public.hero_slides;
create policy "hero_slides public read"  on public.hero_slides for select to anon, authenticated using (true);
create policy "hero_slides auth write"   on public.hero_slides for insert to authenticated with check (true);
create policy "hero_slides auth update"  on public.hero_slides for update to authenticated using (true) with check (true);
create policy "hero_slides auth delete"  on public.hero_slides for delete to authenticated using (true);
