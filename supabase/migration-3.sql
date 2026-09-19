-- ============================================================================
-- PUNCH — migration 3 (run after migration-2.sql). Safe to re-run.
-- Gives the placeholder apparel branded "photo coming soon" tiles, and gives
-- the equipment items real gym photos from /assets.
-- Replace any of these by uploading a real photo in the admin panel.
-- ============================================================================

-- Apparel placeholders --------------------------------------------------------
update public.products set image_url='/assets/apparel/placeholder-tee.webp'
  where kind='apparel' and image_url is null and name ilike '%tee%';
update public.products set image_url='/assets/apparel/placeholder-tank.webp'
  where kind='apparel' and image_url is null and name ilike '%tank%';
update public.products set image_url='/assets/apparel/placeholder-hoodie.webp'
  where kind='apparel' and image_url is null and name ilike '%hoodie%';
update public.products set image_url='/assets/apparel/placeholder-leggings.webp'
  where kind='apparel' and image_url is null and name ilike '%legging%';
update public.products set image_url='/assets/apparel/placeholder-joggers.webp'
  where kind='apparel' and image_url is null and name ilike '%jogger%';
update public.products set image_url='/assets/apparel/placeholder-bra.webp'
  where kind='apparel' and image_url is null and name ilike '%bra%';
-- anything else still without a photo
update public.products set image_url='/assets/apparel/placeholder-tee.webp'
  where kind='apparel' and image_url is null;

-- Equipment photos ------------------------------------------------------------
update public.products set image_url='/assets/punch-pittsburgh-22.webp'
  where kind='equipment' and image_url is null and name ilike '%glove%';
update public.products set image_url='/assets/punch-pittsburgh-19.webp'
  where kind='equipment' and image_url is null and name ilike '%wrap%';
update public.products set image_url='/assets/punch-pittsburgh-29.webp'
  where kind='equipment' and image_url is null and name ilike '%bag%';
update public.products set image_url='/assets/punch-pittsburgh-42.webp'
  where kind='equipment' and image_url is null and (name ilike '%rower%' or name ilike '%bike%');
update public.products set image_url='/assets/punch-pittsburgh-44.webp'
  where kind='equipment' and image_url is null and (name ilike '%barbell%' or name ilike '%plate%');
update public.products set image_url='/assets/punch-pittsburgh-27.webp'
  where kind='equipment' and image_url is null and (name ilike '%dumbbell%' or name ilike '%kettlebell%');
update public.products set image_url='/assets/punch-pittsburgh-25.webp'
  where kind='equipment' and image_url is null;

-- Blog posts still missing a header image ------------------------------------
update public.blog_posts set image_url='/assets/punch-pittsburgh-6.webp'
  where image_url is null and topic='Boxing for Fitness';
update public.blog_posts set image_url='/assets/punch-pittsburgh-31.webp'
  where image_url is null and topic='Nutrition';
update public.blog_posts set image_url='/assets/punch-pittsburgh-40.webp'
  where image_url is null and topic like 'Parkinson%';
update public.blog_posts set image_url='/assets/punch-pittsburgh-41.webp'
  where image_url is null;
