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
