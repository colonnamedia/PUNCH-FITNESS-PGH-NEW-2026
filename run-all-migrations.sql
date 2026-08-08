-- ===== migration-2 =====
-- ============================================================================
-- PUNCH — migration 2 (run AFTER schema.sql and blog-schema.sql)
-- Adds: product "kind" (apparel vs equipment), placeholder items, blog images.
-- Safe to re-run.
-- ============================================================================

-- 1) One table, two catalogs -------------------------------------------------
alter table public.products
  add column if not exists kind text not null default 'apparel';

create index if not exists products_kind_idx on public.products (kind);

-- 2) Placeholder APPAREL (6 mock pieces so the store looks real) -------------
insert into public.products (name, price, price_from, category, description, kind, sort, active)
values
  ('Punch Logo Tee',            28.00, true,  'Tops',      'Soft cotton blend with the Punch mark on the chest.',           'apparel', 10, true),
  ('Fight Club Tee',            28.00, true,  'Tops',      'Heavyweight tee for the days you earn it.',                     'apparel', 20, true),
  ('Punch Tank',                26.00, false, 'Tops',      'Lightweight training tank that moves with you.',                'apparel', 30, true),
  ('Punch Hoodie',              54.00, false, 'Outerwear', 'Heavyweight fleece hoodie with embroidered logo.',              'apparel', 40, true),
  ('Training Leggings',         55.00, false, 'Bottoms',   'High-waist, squat-proof, built for the whole class.',           'apparel', 50, true),
  ('Punch Joggers',             52.00, false, 'Bottoms',   'Tapered fleece joggers for before and after training.',         'apparel', 60, true)
on conflict do nothing;

-- 3) Placeholder EQUIPMENT ---------------------------------------------------
insert into public.products (name, price, price_from, category, description, kind, sort, active)
values
  ('Punch Boxing Gloves',       0, false, 'Gloves & Wraps', '12oz–16oz training gloves. Included free with the 7-Day Starter Pack.', 'equipment', 10, true),
  ('Hand Wraps',                0, false, 'Gloves & Wraps', 'Protect your hands and wrists inside the glove. Coaches show you how to wrap on day one.', 'equipment', 20, true),
  ('Heavy Bags',                0, false, 'On the Floor',   'Heavy bags and free-standing bags across the training floor.', 'equipment', 30, true),
  ('WaterRower & Air Bikes',    0, false, 'Conditioning',   'Rowers and air bikes used throughout Sweat circuits.',         'equipment', 40, true),
  ('Olympic Barbells & Plates', 0, false, 'Strength',       'Olympic barbells and bumper plates for the Train format.',     'equipment', 50, true),
  ('Dumbbells & Kettlebells',   0, false, 'Strength',       'Full dumbbell, kettlebell, and cable setup for strength circuits.', 'equipment', 60, true)
on conflict do nothing;

-- 4) Give the three starter blog posts a header image ------------------------
update public.blog_posts set image_url =
  '/assets/punch-pittsburgh-6.jpg'
  where topic = 'Boxing for Fitness' and image_url is null;

update public.blog_posts set image_url =
  '/assets/punch-pittsburgh-31.jpg'
  where topic = 'Nutrition' and image_url is null;

update public.blog_posts set image_url =
  '/assets/punch-pittsburgh-40.jpg'
  where topic like 'Parkinson%' and image_url is null;

-- ===== migration-3 =====
-- ============================================================================
-- PUNCH — migration 3 (run after migration-2.sql). Safe to re-run.
-- Gives the placeholder apparel branded "photo coming soon" tiles, and gives
-- the equipment items real gym photos from /assets.
-- Replace any of these by uploading a real photo in the admin panel.
-- ============================================================================

-- Apparel placeholders --------------------------------------------------------
update public.products set image_url='/assets/apparel/placeholder-tee.jpg'
  where kind='apparel' and image_url is null and name ilike '%tee%';
update public.products set image_url='/assets/apparel/placeholder-tank.jpg'
  where kind='apparel' and image_url is null and name ilike '%tank%';
update public.products set image_url='/assets/apparel/placeholder-hoodie.jpg'
  where kind='apparel' and image_url is null and name ilike '%hoodie%';
update public.products set image_url='/assets/apparel/placeholder-leggings.jpg'
  where kind='apparel' and image_url is null and name ilike '%legging%';
update public.products set image_url='/assets/apparel/placeholder-joggers.jpg'
  where kind='apparel' and image_url is null and name ilike '%jogger%';
update public.products set image_url='/assets/apparel/placeholder-bra.jpg'
  where kind='apparel' and image_url is null and name ilike '%bra%';
-- anything else still without a photo
update public.products set image_url='/assets/apparel/placeholder-tee.jpg'
  where kind='apparel' and image_url is null;

-- Equipment photos ------------------------------------------------------------
update public.products set image_url='/assets/punch-pittsburgh-22.jpg'
  where kind='equipment' and image_url is null and name ilike '%glove%';
update public.products set image_url='/assets/punch-pittsburgh-19.jpg'
  where kind='equipment' and image_url is null and name ilike '%wrap%';
update public.products set image_url='/assets/punch-pittsburgh-29.jpg'
  where kind='equipment' and image_url is null and name ilike '%bag%';
update public.products set image_url='/assets/punch-pittsburgh-42.jpg'
  where kind='equipment' and image_url is null and (name ilike '%rower%' or name ilike '%bike%');
update public.products set image_url='/assets/punch-pittsburgh-44.jpg'
  where kind='equipment' and image_url is null and (name ilike '%barbell%' or name ilike '%plate%');
update public.products set image_url='/assets/punch-pittsburgh-27.jpg'
  where kind='equipment' and image_url is null and (name ilike '%dumbbell%' or name ilike '%kettlebell%');
update public.products set image_url='/assets/punch-pittsburgh-25.jpg'
  where kind='equipment' and image_url is null;

-- Blog posts still missing a header image ------------------------------------
update public.blog_posts set image_url='/assets/punch-pittsburgh-6.jpg'
  where image_url is null and topic='Boxing for Fitness';
update public.blog_posts set image_url='/assets/punch-pittsburgh-31.jpg'
  where image_url is null and topic='Nutrition';
update public.blog_posts set image_url='/assets/punch-pittsburgh-40.jpg'
  where image_url is null and topic like 'Parkinson%';
update public.blog_posts set image_url='/assets/punch-pittsburgh-41.jpg'
  where image_url is null;

-- ===== migration-4 =====
-- ============================================================================
-- PUNCH — migration 4 (run after migration-3.sql). Safe to re-run.
-- Adds: external buy links (Amazon / Superare) + a settings table for the blog.
-- ============================================================================

-- 1) External purchase links on products/equipment ---------------------------
alter table public.products add column if not exists amazon_url    text;
alter table public.products add column if not exists partner_url   text;
alter table public.products add column if not exists partner_label text;
alter table public.products add column if not exists partner_note  text;

-- 2) Site settings (blog frequency, etc.) ------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings public read" on public.site_settings;
drop policy if exists "settings auth write"  on public.site_settings;
drop policy if exists "settings auth update" on public.site_settings;

create policy "settings public read" on public.site_settings for select using (true);
create policy "settings auth write"  on public.site_settings for insert to authenticated with check (true);
create policy "settings auth update" on public.site_settings for update to authenticated using (true) with check (true);

insert into public.site_settings (key, value)
values ('blog', '{"posts_per_week": 1}'::jsonb)
on conflict (key) do nothing;

-- 3) Seed the recommended gear (Amazon affiliate links) ----------------------
-- Prices are left at 0 so the card shows "Buy on Amazon" instead of a price.
insert into public.products (name, price, category, description, kind, sort, active, amazon_url)
values
  ('Pro Boxing Gloves — 14oz',
   0, 'Gloves', 'Our top pick for members who train several times a week. 14oz is the sweet spot for bag work and pad work at Punch.',
   'equipment', 5, true,
   'https://www.amazon.com/dp/B0FDLG24JR/ref=cm_sw_r_as_gl_api_gl_i_ZK1N002399Q7SDW8Z1NR?linkCode=ml1&tag=anthonycolonn-20&linkId=956fc47ef653d1b18e8a2cd03fdcc75d'),

  ('Mid-Range Boxing Gloves — 14oz',
   0, 'Gloves', 'Great value glove if you are newer or training once or twice a week. Same 14oz weight we recommend for class.',
   'equipment', 6, true,
   'https://www.amazon.com/dp/B08MWSBKB6/ref=cm_sw_r_as_gl_api_gl_i_9FSKB2GX41K5PKNWJC1P?linkCode=ml1&tag=anthonycolonn-20&linkId=9f08373840d91f274a35f5731ddf2636'),

  ('Quick Wraps — Medium or Large',
   0, 'Wraps', 'Slip-on wraps that protect your hands and wrists without the learning curve. Grab medium or large depending on hand size.',
   'equipment', 7, true,
   'https://www.amazon.com/dp/B00PCIWX3W/ref=cm_sw_r_as_gl_api_gl_i_343T9Z30QPY533S5HXVH?linkCode=ml1&tag=anthonycolonn-20&linkId=b9e9bc33dd9655c536b2e2331cc7e1b4')
on conflict do nothing;

-- ===== migration-5 =====
-- ============================================================================
-- PUNCH — migration 5 (run after migration-4.sql). Safe to re-run.
-- Attaches the real product photos you uploaded, and adds the apparel pieces
-- that now have photography.
-- ============================================================================

-- ---------- EQUIPMENT: real product shots -----------------------------------
update public.products set image_url = '/assets/equipment/gloves-pro-mex.jpg'
  where kind = 'equipment' and name ilike '%pro boxing glove%';

update public.products set image_url = '/assets/equipment/gloves-rdx.jpg'
  where kind = 'equipment' and name ilike '%mid-range%';

update public.products set image_url = '/assets/equipment/quick-wraps-rdx.jpg'
  where kind = 'equipment' and name ilike '%quick wrap%';

-- ---------- APPAREL: pieces we now have photos for --------------------------
-- Update in place if the placeholder rows already exist...
update public.products
   set image_url = '/assets/apparel/tank-grey.jpg',
       name = 'Punch Muscle Tank — Grey',
       description = 'Soft, relaxed-fit muscle tank with the Punch Results System mark. Built for Fight, Train, and Sweat.',
       category = 'Tops', sort = 10
 where kind = 'apparel' and name ilike '%tank%';

update public.products
   set image_url = '/assets/apparel/hoodie-black.jpg',
       name = 'Punch Cropped Hoodie — Black',
       description = 'Lightweight cropped hoodie with drawstring hood and the vintage Punch badge across the chest.',
       category = 'Outerwear', sort = 20
 where kind = 'apparel' and name ilike '%hoodie%' and name not ilike '%grey%';

-- ...and add the grey sleeveless hoodie if it is not there yet.
insert into public.products (name, price, price_from, category, description, kind, sort, active, image_url)
select 'Punch Sleeveless Hoodie — Grey', 54.00, false, 'Outerwear',
       'Sleeveless pullover hoodie with front pocket and the Punch badge. Perfect layer before and after class.',
       'apparel', 30, true, '/assets/apparel/hoodie-grey.jpg'
where not exists (
  select 1 from public.products where kind='apparel' and name ilike '%sleeveless hoodie%'
);

-- Keep placeholders only where we genuinely have no photo yet.
update public.products set active = false
 where kind = 'apparel' and image_url like '%placeholder-%';

-- ===== migration-6 =====
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

-- ===== migration-7 =====
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


-- ============================================================================
-- migration 8 : site popups (admin-managed)
-- ============================================================================
create table if not exists public.popups (
  id            uuid primary key default gen_random_uuid(),
  type          text not null default 'custom',
  title         text,
  image_url     text,
  link_url      text,
  active        boolean not null default true,
  show_desktop  boolean not null default true,
  show_mobile   boolean not null default true,
  pages         text not null default 'all',
  sort          int not null default 0,
  created_at    timestamptz not null default now()
);
alter table public.popups enable row level security;
drop policy if exists "popups public read" on public.popups;
drop policy if exists "popups auth all"    on public.popups;
create policy "popups public read" on public.popups for select using (true);
create policy "popups auth all"    on public.popups for all to authenticated using (true) with check (true);
insert into public.popups (type, title, active, show_desktop, show_mobile, pages, sort)
select 'trial', 'Trial Offer Popup', true, true, false, 'all', 0
where not exists (select 1 from public.popups where type = 'trial');
