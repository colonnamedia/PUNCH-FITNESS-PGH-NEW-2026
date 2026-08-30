-- ============================================================================
-- PUNCH — migration 18: attach the uploaded product photos to the 7 new
-- equipment products. Safe to re-run.
-- ============================================================================

update public.products set image_url = '/assets/equipment/ringside-boxing-gloves-2.png'
  where kind = 'equipment' and name = 'Ringside Apex Flash Sparring Gloves';

update public.products set image_url = '/assets/equipment/youth-boxing-gloves.png'
  where kind = 'equipment' and name = 'Youth Boxing Gloves';

update public.products set image_url = '/assets/equipment/budda-boxing-gloves.png'
  where kind = 'equipment' and name = 'Buddha Fight Wear Boxing Gloves';

update public.products set image_url = '/assets/equipment/amazing-hand-wraps.png'
  where kind = 'equipment' and name = 'Ringside Apex Handwraps — 180"';

update public.products set image_url = '/assets/equipment/ringside-quick-wraps.png'
  where kind = 'equipment' and name = 'Ringside Gel Quick Wraps';

update public.products set image_url = '/assets/equipment/camo-bag.png'
  where kind = 'equipment' and name = 'Tactical Gym Bag — Camo';

update public.products set image_url = '/assets/equipment/oldschool-bag.png'
  where kind = 'equipment' and name = 'Ringside Boxing Club Gym Bag';

-- Sanity check — should return exactly these 7 rows, each with a non-null
-- image_url pointing to the right file.
select name, image_url from public.products
where kind = 'equipment'
  and name in (
    'Ringside Apex Flash Sparring Gloves','Youth Boxing Gloves','Buddha Fight Wear Boxing Gloves',
    'Ringside Apex Handwraps — 180"','Ringside Gel Quick Wraps','Tactical Gym Bag — Camo','Ringside Boxing Club Gym Bag'
  )
order by name;
