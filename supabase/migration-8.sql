-- ============================================================================
-- PUNCH — migration 8 : site popups (admin-managed). Run after previous
-- migrations. Safe to re-run.
--
-- Adds a "popups" table that drives:
--   1) The built-in Trial/Special popup (previously hardcoded desktop-only in
--      nav.js) — now toggleable from the admin, with its own desktop/mobile
--      and page-targeting switches.
--   2) Any number of custom promotional popups (image + link) the owner adds
--      from the new Popups tab in /admin.
-- ============================================================================
create table if not exists public.popups (
  id            uuid primary key default gen_random_uuid(),
  type          text not null default 'custom',   -- 'trial' | 'custom'
  title         text,                              -- internal label / alt text
  image_url     text,                               -- custom popups only
  link_url      text,                               -- custom popups only (optional)
  active        boolean not null default true,
  show_desktop  boolean not null default true,
  show_mobile   boolean not null default true,
  pages         text not null default 'all',        -- 'all' | 'landing'
  sort          int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.popups enable row level security;
drop policy if exists "popups public read" on public.popups;
drop policy if exists "popups auth all"    on public.popups;
create policy "popups public read" on public.popups for select using (true);
create policy "popups auth all"    on public.popups for all to authenticated using (true) with check (true);

-- Seed the built-in trial popup row once. Mobile is OFF by default to match
-- the site's current live behavior (it was hardcoded desktop-only) — flip
-- "show_mobile" on from the admin whenever it's ready to test on phones.
insert into public.popups (type, title, active, show_desktop, show_mobile, pages, sort)
select 'trial', 'Trial Offer Popup', true, true, false, 'all', 0
where not exists (select 1 from public.popups where type = 'trial');
