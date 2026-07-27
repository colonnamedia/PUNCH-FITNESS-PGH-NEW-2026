-- ============================================================================
-- PUNCH — migration 7 : trainers roster. Run after previous migrations. Re-runnable.
-- ============================================================================
create table if not exists public.trainers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  image_url  text,
  sort       int  default 0,
  active     boolean default true,
  created_at timestamptz not null default now()
);
alter table public.trainers enable row level security;
drop policy if exists "trainers public read" on public.trainers;
drop policy if exists "trainers auth all"    on public.trainers;
create policy "trainers public read" on public.trainers for select using (true);
create policy "trainers auth all"    on public.trainers for all to authenticated using (true) with check (true);
