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
