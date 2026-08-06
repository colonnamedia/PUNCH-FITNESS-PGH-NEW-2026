-- ============================================================================
-- PUNCH — migration 6 : page media manager (hero images/videos per page)
-- Run after previous migrations. Safe to re-run.
-- ============================================================================
create table if not exists public.page_media (
  slot        text primary key,          -- e.g. 'home.hero_video'
  url         text,                       -- image/video URL (uploaded or pasted)
  fit         text default 'cover',       -- 'cover' | 'contain'
  position    text default 'center',      -- object-position (e.g. 'center top')
  updated_at  timestamptz not null default now()
);

alter table public.page_media enable row level security;
drop policy if exists "page_media public read" on public.page_media;
drop policy if exists "page_media auth write"  on public.page_media;
drop policy if exists "page_media auth update" on public.page_media;
create policy "page_media public read" on public.page_media for select using (true);
create policy "page_media auth write"  on public.page_media for insert to authenticated with check (true);
create policy "page_media auth update" on public.page_media for update to authenticated using (true) with check (true);

-- optional: a dedicated public bucket for site media (images/small video)
insert into storage.buckets (id, name, public)
values ('site-media','site-media', true)
on conflict (id) do nothing;

drop policy if exists "site-media public read" on storage.objects;
drop policy if exists "site-media auth upload" on storage.objects;
create policy "site-media public read" on storage.objects for select using (bucket_id = 'site-media');
create policy "site-media auth upload" on storage.objects for insert to authenticated with check (bucket_id = 'site-media');
