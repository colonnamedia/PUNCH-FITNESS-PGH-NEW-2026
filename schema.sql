-- ============================================================================
-- PUNCH APPAREL — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / idempotent policies).
-- ============================================================================

-- ---- Products table --------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(10,2) not null default 0,
  price_from  boolean not null default false,          -- show "from $X"
  category    text not null default 'General',
  description text,
  image_url   text,
  stripe_url  text,                                     -- paste a Stripe Payment Link here to enable Buy
  active      boolean not null default true,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

-- Public (anon) can read products; only signed-in admins can change them.
drop policy if exists "products public read"  on public.products;
drop policy if exists "products auth insert"  on public.products;
drop policy if exists "products auth update"  on public.products;
drop policy if exists "products auth delete"  on public.products;

create policy "products public read" on public.products
  for select using (true);
create policy "products auth insert" on public.products
  for insert to authenticated with check (true);
create policy "products auth update" on public.products
  for update to authenticated using (true) with check (true);
create policy "products auth delete" on public.products
  for delete to authenticated using (true);

-- ---- Image storage bucket --------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images public read"   on storage.objects;
drop policy if exists "product images auth insert"   on storage.objects;
drop policy if exists "product images auth update"   on storage.objects;
drop policy if exists "product images auth delete"   on storage.objects;

create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product images auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');
create policy "product images auth update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');
create policy "product images auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- ============================================================================
-- After running this:
-- 1) Authentication → Users → "Add user" → your email + password (this is your
--    admin login). Leave "Auto confirm" on so you can sign in immediately.
-- 2) (Recommended) Authentication → Providers → Email → turn OFF public sign-ups
--    so only users you create can log in.
-- 3) Copy Project URL + anon public key (Settings → API) into config.js.
-- ============================================================================
