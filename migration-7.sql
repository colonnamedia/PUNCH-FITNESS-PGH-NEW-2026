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

-- seed roster (first names only, no titles) — runs once, only if table is empty
insert into public.trainers (name, image_url, sort)
select v.name, v.img, v.s from (values
  ('Anthony','/assets/trainers/anthony.jpg',1),
  ('Jocelyn','/assets/trainers/jocelyn.jpg',2),
  ('Emily','/assets/trainers/emily.jpg',3),
  ('Luc','/assets/trainers/luc.jpg',4),
  ('Chelsea','/assets/trainers/chelsea.jpg',5),
  ('Jess','/assets/trainers/jess.jpg',6)
) as v(name,img,s)
where not exists (select 1 from public.trainers);

-- image fit + position controls for trainer photos
alter table public.trainers add column if not exists image_fit text default 'cover';
alter table public.trainers add column if not exists image_position text default 'center';
