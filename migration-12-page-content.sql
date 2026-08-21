-- ============================================================================
-- PUNCH — migration 12 : page section reorder + text overrides. Homepage
-- only for now (page='home'). Safe to re-run.
--
-- page_sections: controls the ORDER of a page's top-level content sections.
--   No row for a section -> it stays in its original document position
--   (safe default). A row exists -> its sort_order determines placement
--   relative to other ordered sections.
--
-- page_text: controls TEXT OVERRIDES for specific fields (tagged in the
--   HTML with data-text="section.field"). No row -> the original hardcoded
--   text shows exactly as coded (safe default).
-- ============================================================================
create table if not exists public.page_sections (
  id          uuid primary key default gen_random_uuid(),
  page        text not null,
  section_key text not null,
  sort_order  int not null default 0,
  unique(page, section_key)
);

create table if not exists public.page_text (
  id          uuid primary key default gen_random_uuid(),
  page        text not null,
  section_key text not null,
  field_key   text not null,
  value       text not null,
  unique(page, section_key, field_key)
);

alter table public.page_sections enable row level security;
alter table public.page_text enable row level security;

drop policy if exists "page_sections public read" on public.page_sections;
drop policy if exists "page_sections auth write"  on public.page_sections;
drop policy if exists "page_sections auth update" on public.page_sections;
drop policy if exists "page_sections auth delete" on public.page_sections;
create policy "page_sections public read"  on public.page_sections for select to anon, authenticated using (true);
create policy "page_sections auth write"   on public.page_sections for insert to authenticated with check (true);
create policy "page_sections auth update"  on public.page_sections for update to authenticated using (true) with check (true);
create policy "page_sections auth delete"  on public.page_sections for delete to authenticated using (true);

drop policy if exists "page_text public read" on public.page_text;
drop policy if exists "page_text auth write"  on public.page_text;
drop policy if exists "page_text auth update" on public.page_text;
drop policy if exists "page_text auth delete" on public.page_text;
create policy "page_text public read"  on public.page_text for select to anon, authenticated using (true);
create policy "page_text auth write"   on public.page_text for insert to authenticated with check (true);
create policy "page_text auth update"  on public.page_text for update to authenticated using (true) with check (true);
create policy "page_text auth delete"  on public.page_text for delete to authenticated using (true);
