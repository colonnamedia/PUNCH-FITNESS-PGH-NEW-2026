-- ============================================================================
-- PUNCH BLOG — Supabase schema + starter posts
-- Run in Supabase → SQL Editor AFTER schema.sql. Idempotent / safe to re-run.
-- ============================================================================

create table if not exists public.blog_posts (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  slug       text unique not null,
  topic      text not null,                    -- Boxing for Fitness | Nutrition | Parkinson's Boxing Benefits
  excerpt    text,
  body       text not null,                    -- markdown
  image_url  text,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "posts public read"  on public.blog_posts;
drop policy if exists "posts auth insert"   on public.blog_posts;
drop policy if exists "posts auth update"   on public.blog_posts;
drop policy if exists "posts auth delete"   on public.blog_posts;

-- Public sees published posts; signed-in admin manages everything.
create policy "posts public read" on public.blog_posts
  for select using (published = true or auth.role() = 'authenticated');
create policy "posts auth insert" on public.blog_posts
  for insert to authenticated with check (true);
create policy "posts auth update" on public.blog_posts
  for update to authenticated using (true) with check (true);
create policy "posts auth delete" on public.blog_posts
  for delete to authenticated using (true);

-- ---- Starter posts (dollar-quoted so apostrophes are safe) -----------------
insert into public.blog_posts (title, slug, topic, excerpt, body) values
(
  'Why Boxing Is One of the Best Full-Body Workouts',
  'why-boxing-is-one-of-the-best-full-body-workouts',
  'Boxing for Fitness',
  $md$Boxing burns serious calories, builds real strength, and never gets boring — here is why it works so well for weight loss and confidence.$md$,
  $md$Boxing is having a moment as a fitness workout, and for good reason. It combines cardio, strength, and coordination into one 45-minute session that flies by.

## It burns more than you think
A single class can burn 600 to 800 calories. The mix of heavy-bag rounds and active recovery keeps your heart rate elevated the whole time, which means you keep burning even after you leave the floor.

## It builds real strength
Throwing combinations engages your core, shoulders, back, and legs. Add in the strength circuits we run between rounds and you are building functional strength that shows up everywhere in daily life.

## It is a skill, so you never get bored
Unlike a treadmill, boxing gives you something to learn every class — footwork, defense, new combinations. Progress keeps you coming back.

**New to it?** Your first class at Punch is free. No experience needed — just show up and swing.$md$
),
(
  'Eating to Fuel Your Training (Not Undo It)',
  'eating-to-fuel-your-training',
  'Nutrition',
  $md$You cannot out-train a poor diet. Here are simple, sustainable nutrition habits that support your workouts and your goals.$md$,
  $md$The best workout plan in the world still needs fuel behind it. You do not need a complicated diet — just a few habits that stick.

## Protein at every meal
Protein helps you recover and hold onto lean muscle as you lose fat. Aim for a palm-sized portion at each meal — eggs, chicken, fish, Greek yogurt, beans.

## Carbs are not the enemy
Whole-food carbs like oats, rice, potatoes, and fruit fuel high-energy classes. Time more of them around your workouts.

## Hydrate like it matters
A boxing class makes you sweat. Water before, during, and after keeps your energy and focus up.

## Keep it sustainable
The best diet is the one you can actually keep. Small, consistent choices beat a perfect plan you quit in two weeks.

*This is general wellness information, not medical or dietary advice. Talk to your doctor or a registered dietitian about your individual needs.*$md$
),
(
  'How Boxing Supports People Living With Parkinson''s',
  'how-boxing-supports-people-living-with-parkinsons',
  'Parkinson''s Boxing Benefits',
  $md$Controlled, low-impact boxing can support balance, coordination, and confidence. Here is what our Senior Slugger program focuses on.$md$,
  $md$Boxing-based fitness has become a popular form of movement for many people living with Parkinson's — and our Senior Slugger program is built around that idea.

## Movement with purpose
Our classes focus on controlled movement, rhythm, coordination, posture, and balance. Boxing has been shown to help many people with Parkinson's improve their balance, hand-eye coordination, mental focus, muscle strength, and body rhythm.

## Low-impact and welcoming
The program is designed for all ability levels — even complete beginners. We provide gloves and wraps for your first class. You just bring comfortable clothes, water, and a good attitude.

## Community matters
Staying social and motivated is a huge part of the benefit. Our members show up three days a week and cheer each other on.

**Important:** We are not a Rock Steady Boxing affiliate, and this program is fitness-based — not medical treatment or therapy. Always consult your physician or care provider before starting any exercise program.$md$
)
on conflict (slug) do nothing;
