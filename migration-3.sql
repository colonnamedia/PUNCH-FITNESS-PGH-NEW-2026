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
