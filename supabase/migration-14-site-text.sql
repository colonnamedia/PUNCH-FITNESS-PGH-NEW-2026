-- ============================================================================
-- PUNCH — migration 14 : site-wide text overrides (footer now, header nav
-- next). Safe to re-run.
--
-- Unlike page_text (scoped to a single page, applied at build time),
-- site_text is global and applied at RUNTIME by nav.js, since the header
-- and footer are built by that script on every page rather than baked into
-- each page's HTML individually. No row for a key -> that element shows
-- its coded default text exactly as-is (safe default, same guarantee as
-- everywhere else on the site).
-- ============================================================================
create table if not exists public.site_text (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

alter table public.site_text enable row level security;
drop policy if exists "site_text public read" on public.site_text;
drop policy if exists "site_text auth write"  on public.site_text;
drop policy if exists "site_text auth update" on public.site_text;
drop policy if exists "site_text auth delete" on public.site_text;
create policy "site_text public read"  on public.site_text for select to anon, authenticated using (true);
create policy "site_text auth write"   on public.site_text for insert to authenticated with check (true);
create policy "site_text auth update"  on public.site_text for update to authenticated using (true) with check (true);
create policy "site_text auth delete"  on public.site_text for delete to authenticated using (true);
