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
  'https://images.squarespace-cdn.com/content/v1/6509de1678b4160657354615/c17b0e57-23b7-45b9-a70c-4f95ea148b56/Punch+Fitness+Boxing+Studio-06634.jpg'
  where topic = 'Boxing for Fitness' and image_url is null;

update public.blog_posts set image_url =
  'https://images.squarespace-cdn.com/content/v1/6509de1678b4160657354615/1740771490055-X3M8P8QQ7T4L9H2IQLC9/DSC08935.jpeg'
  where topic = 'Nutrition' and image_url is null;

update public.blog_posts set image_url =
  'https://images.squarespace-cdn.com/content/6509de1678b4160657354615/550764b2-7031-4138-aa9c-1add5ac8c130/punch+parkinsons+and+senior+fit+classes.png?content-type=image%2Fpng'
  where topic like 'Parkinson%' and image_url is null;
