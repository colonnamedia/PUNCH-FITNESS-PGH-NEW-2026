-- ============================================================================
-- PUNCH — migration 15 (run after migration-14). Safe to re-run.
-- Adds a `featured` flag so the original 3 coach-picks (already hardcoded as
-- static HTML on the page) don't also show up duplicated in the new dynamic
-- "More Gear" grid — then adds 7 new Amazon-affiliate equipment products.
-- ============================================================================

-- 1) Flag so the dynamic grid can exclude the 3 already-featured picks --------
alter table public.products add column if not exists featured boolean not null default false;

update public.products set featured = true
  where kind = 'equipment'
    and name in ('Pro Boxing Gloves — 14oz', 'Mid-Range Boxing Gloves — 14oz', 'Quick Wraps — Medium or Large');

-- 2) New equipment products (image_url left blank — add once you send the
--    SiteStripe image links; until then each card shows a placeholder) ------
insert into public.products (name, price, category, description, kind, sort, active, amazon_url)
values
  ('Ringside Apex Flash Sparring Gloves',
   0, 'Gloves', 'Premium protection with color options. This is the 14oz weight we recommend for class.',
   'equipment', 20, true,
   'https://www.amazon.com/Ringside-Boxing-Kickboxing-Punching-Sparring/dp/B00MX2BNS6?crid=2QG5BKPQAG58F&dib=eyJ2IjoiMSJ9.KTYsWO8jGYyW4WJ5Ijxi-BaJwgE-gjR1o9HUE2Sv17TYRwhPoRS6KvKrJw8rYvtETomebHCe95-TFPv8klfBaNmc7joOCz7BmdTjFx4u-t7uWh1T-By3bfLqPPSXq9aAPK-ws9NyX_8g1Oawa9pJZk0CpoASbMUY8mI8XlnfUtBhG-YWYcJaZlAeozjbuzl57bw-NGYfQwlZITe2GT0g8ht3vwN3c01becUjhmq5-idPovfAZwqhFC4zGpMXEgIQKCo941KiFa3N5hAJdmU8bqECxFNIApPoB7swbRBQqm8.RyuwQ7PnMEs91_06iAcpGqSx4JQD51YP3NUSl8yFnE8&dib_tag=se&keywords=ringside%2Bboxing%2Bgloves&qid=1788101692&sprefix=ringside%2Bboxing%2Bgloves%2Caps%2C105&sr=8-4-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=16f94a03b6fa0f321e4b983f07e67356&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl'),

  ('Youth Boxing Gloves',
   0, 'Gloves', 'Sized for young fighters — 10oz up to age 7, 12oz for ages 8–12. After that, move up to adult 12oz or 14oz.',
   'equipment', 21, true,
   'https://www.amazon.com/Boxing-Training-Kickboxing-Sparring-Workout/dp/B0CTW72C84?crid=24KZGYJC7512E&dib=eyJ2IjoiMSJ9.IbVyYhI_x2sSTZ_WScptdflLDf07aFr2CY8IATo3MzDWHaVkKiN0KO_fIO6gz1XSr2H2ZgLrntmupk4r-Bt7uAElrGd6lp0LQlYFwmwfinR__dH5zoQo5oXpsbqsuO2cA7zGZ6_hUT_scGp_xmIvxPUYLpOcx2GCUD-H06ZO2ttpugoW2cac0M2Ih7-ajd9ZwM_w3LSzYTedZXS3k8JWARMUuv3SEkciehpxJ7hyVcmhBVYT2lit7zyJl3GwluJaZ8dWBIp9Q-GzGMKeECuxwLGlQS2Oc2s1A-7F-SQcPsQ.ubuI4stPsJe0pegm1cV0tYl7DTOLkt8zBvqC_0zKgCI&dib_tag=se&keywords=youth%2Bboxing%2Bgloves&qid=1788101875&sprefix=youth%2Caps%2C278&sr=8-3-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=e459b91aea92cde2eac4bbdc1582a634&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl'),

  ('Buddha Fight Wear Boxing Gloves',
   0, 'Gloves', 'A stylish step up in 12oz or 14oz, with reinforced synthetic leather.',
   'equipment', 22, true,
   'https://www.amazon.com/BUDDHA-FIGHT-WEAR-Synthetic-Reinforced/dp/B0C2J68WYB?crid=1FFLN7WNU9OY7&dib=eyJ2IjoiMSJ9.CalJjY7FOJsciAHK_9S00JaszEh2QZj4uYSksmMG9cqrmUIYbszVrhlbWaSYacsSZlylQCNABIKtzCuhswWuSvn4IrRmiNja-VQr0OiLjBkYYc-kdT7rfHfK_4-eFW05e8-oOtUkuB-mz9gNPcK_8JnJ7Fwpb8Nesb16kTGCXAXnWSs5xlpUnWD4Cq1F5KIAc0aU9EQZymrvnnLr3Z38NXUOfyEHM64ILY3N4v2Wdb_J0dGcfGiUTfnkLyouqzfh2afKzucg2jGgk_ZAUip41SfW-bveHl_FI7eoAZZHakA.vyWS7_XHYdAfnavi5wzRhQuAyAlnVsjTwrefxSFmIOM&dib_tag=se&keywords=stylish%2Bboxing%2Bgloves&qid=1788102337&sprefix=stylish%2Bboxing%2Bgloves%2Caps%2C135&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=a2f4cbae954d191afa481a5d3dfca4d9&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl'),

  ('Ringside Apex Handwraps — 180"',
   0, 'Wraps', 'Extra-long 180-inch wraps in bold designs, for members who want full wrist support.',
   'equipment', 23, true,
   'https://www.amazon.com/Ringside-Apex-Handwraps-Fire-size/dp/B01CCL1YA4?crid=PD8A5N2QIQLV&dib=eyJ2IjoiMSJ9.pKur-ISdcfScwZaWwqZ3oWIwdJPHNtskcEzCvPId_jrbRhXUrAuERx7QWIxYQl3k9GIypy5X3IE15idXn8SyjbkMMohNjEB6PLzjmgxUgh0sjg9Y7F6wY_U6Mp7cFlik6cREetCXK_GlHK-dgYsdJelZvNrVLwauXvgcwXI-6RcJO921mCac0UOK8VMqbp9fEv7p_b3TqsDqKIcKtYvAakbroRBs4rm_HFbXYqwhgx6hi3tKclDMYmxtXYcnCYJYhIGZgMfVsO_TJR3yiNr4BbsAUyiOIXLW34im_VMLXvU.kvTUMvok1_NwhAGe3TzuAQAKXX_OicXecOMuFuz7le4&dib_tag=se&keywords=boxing%2Bhand%2Bwraps&qid=1788102032&sprefix=boxign%2B%2Caps%2C220&sr=8-12-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9tdGY&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=bffc8b50b7a5da1ab2c732e7b406d0e9&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl'),

  ('Ringside Gel Quick Wraps',
   0, 'Wraps', 'Soft gel padding that slips right on, no wrapping technique needed. Medium or large depending on hand size.',
   'equipment', 24, true,
   'https://www.amazon.com/Ringside-Gel-Boxing-Hand-Wraps/dp/B00WZSP8BQ?crid=PD8A5N2QIQLV&dib=eyJ2IjoiMSJ9.pKur-ISdcfScwZaWwqZ3oWIwdJPHNtskcEzCvPId_jrbRhXUrAuERx7QWIxYQl3k9GIypy5X3IE15idXn8SyjbkMMohNjEB6PLzjmgxUgh0sjg9Y7F6wY_U6Mp7cFlik6cREetCXK_GlHK-dgYsdJelZvNrVLwauXvgcwXI-6RcJO921mCac0UOK8VMqbp9fEv7p_b3TqsDqKIcKtYvAakbroRBs4rm_HFbXYqwhgx6hi3tKclDMYmxtXYcnCYJYhIGZgMfVsO_TJR3yiNr4BbsAUyiOIXLW34im_VMLXvU.kvTUMvok1_NwhAGe3TzuAQAKXX_OicXecOMuFuz7le4&dib_tag=se&keywords=boxing%2Bhand%2Bwraps&qid=1788102032&sprefix=boxign%2B%2Caps%2C220&sr=8-26&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=a6b946383eaa5220e801fe13c84bb7b9&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl'),

  ('Tactical Gym Bag — Camo',
   0, 'Bags', 'Multiple compartments and rugged material. A solid weekender-style bag for gear, shoes, and a change of clothes.',
   'equipment', 25, true,
   'https://www.amazon.com/Tactical-Compartment-Resistant-Weekender-Overnight/dp/B0D8HMVMF2?content-id=amzn1.sym.695d2f5c-57d3-40bd-ad9d-a30bba80ceeb%3Aamzn1.sym.695d2f5c-57d3-40bd-ad9d-a30bba80ceeb&crid=2MVWS1PVI8G64&cv_ct_cx=gym%2Bbag&keywords=gym%2Bbag&pd_rd_i=B0D8HMVMF2&pd_rd_r=615a58b0-de60-4430-81cf-3a80e75d1741&pd_rd_w=3oCn9&pd_rd_wg=YqZA5&pf_rd_p=695d2f5c-57d3-40bd-ad9d-a30bba80ceeb&pf_rd_r=CH16YKWQMAZEDAJ7Z4M1&qid=1788102166&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=gym%2Bbag%2Caps%2C159&sr=1-1-4a82bf2c-99de-49d4-8c6e-1b9c06d4b176-spons&aref=OtWAVlDP0a&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=f35be8e5f91c746dfe95c742f871b0b2&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl'),

  ('Ringside Boxing Club Gym Bag',
   0, 'Bags', 'A classic, old-school boxing gym bag look built for daily training use.',
   'equipment', 26, true,
   'https://www.amazon.com/Ringside-Boxing-Club-Gym-Bag/dp/B00YU1PCTE?crid=3F39HR0VRMSNW&dib=eyJ2IjoiMSJ9.Dm4_3tvWB6ygOCCUbb6LFs0VxAbtY5oXJE6tZ1stfQPb-PZG6IqJM2tMwBw7kfkHJO8u3v3BCQiG8GQPQExSQf8MsvM6j1tLPXqFrSOXdFptohWI-lmynNwqyCuD8Ba7f_TUI1q8y-6EC9zL0KtTjnnBhGs0-3zXkQ4vyt7QdwrHUgHoaJcnxBATKa5xTLXxPrTaTyAtoCpypvGzQNh4S7ycxWV8YBPQpX9wVhJrSgCv26qzB39StGg65L0Hq6sfb7fr6Db6J9iqQ9_fc7u63WYxotormq0iRb9rguHhUfI.yIDOYbxk7-Y5oXfz2aGdzpnbz8-uHMYVGKlMRAKGktI&dib_tag=se&keywords=boxing%2Bequipment%2Bbag&qid=1788102259&sprefix=boxing%2Bequipment%2Bbag%2Caps%2C145&sr=8-51&th=1&linkCode=ll2&tag=anthonycolonn-20&linkId=671d942eaf496a27d2673d0babb09992&language=en_US&gaOptInStatus=true&ref_=as_li_ss_tl')
on conflict do nothing;
