# punchpgh.com — new site (GitHub → Vercel)

Plain static HTML/CSS in the Punch design system. No build step. Every page shares
`punch.css`, `nav.js` (header + footer), and the self-hosted Barlow fonts.

## Deploy

1. Push this folder to a GitHub repo (org: colonnamedia).
2. Vercel → Add New → Project → import the repo.
3. Framework preset **Other**. No build command. Output directory: leave default.
4. Deploy. `vercel.json` turns on clean URLs, so `/free-trial` serves `free-trial.html`.

Nothing touches the live punchpgh.com until you point DNS (final step).

## Pages

| Route | File | Hero |
|---|---|---|
| `/` | index.html | R2 video — Greentree 15220 |
| `/free-trial` | free-trial.html | R2 video — TRIAL-PAGE-SLIDE-VIDEO |
| `/membership-options` | membership-options.html | R2 video — Pittsburgh |
| `/senior-fitness-and-boxing-pittsburgh` | senior-…html | R2 video — PARKINSONS VIDEO HERO |
| `/classes` | classes.html | image |
| `/personal-training` | personal-training.html | image + PushPress consult form |
| `/youth-boxing-camp` | youth-boxing-camp.html | image |
| `/schedule` | schedule.html | image + PushPress calendar embed |
| `/boxing-gloves-for-fitness-classes` | boxing-gloves-…html | image |
| `/punch-apparel` | punch-apparel.html | image — dynamic store (Supabase) |
| `/blog-events` + `/post?slug=…` | blog-events.html, post.html | dynamic blog (Supabase) |
| `/contact` | contact.html | image + PushPress form + map |
| `/about` | about.html | image |
| `/terms-conditions` | terms-conditions.html | noindex |
| `/admin` | admin.html | login-gated dashboard (noindex) |

Removed: 30 Day Program (redirects to memberships), Gift Cards (was MindBody).
Zero MindBody links remain anywhere.

## Store + blog (Supabase — already connected)

`config.js` holds the live project URL + publishable key. Schema already run.
Log in at `/admin` to add products (image upload, price, category) and write posts.
Products appear on `/punch-apparel` immediately.

**Stripe is deferred.** Products show "Coming Soon" until you paste a Stripe Payment
Link into a product's Stripe field in the admin — then its Buy button turns on.

## Auto-blog (weekly, rotates 3 topics)

`api/generate-blog.js` runs Mondays 14:00 UTC (`vercel.json` → crons) and rotates:
Boxing for Fitness → Nutrition → Parkinson's Boxing Benefits.

Add these in Vercel → Settings → Environment Variables, then redeploy:

- `ANTHROPIC_API_KEY` — your Anthropic key
- `SUPABASE_URL` — https://uyzvmrbjlzafpwpamjwa.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Settings → API → service_role (secret)
- `CRON_SECRET` — any long random string

Test manually: `https://your-site.com/api/generate-blog?secret=YOUR_CRON_SECRET`
Until then the three seeded starter posts show, and you can write posts by hand.

## Images

Pages currently use the live Squarespace CDN URLs so they render immediately.
Upload your PUNCH-ASSETS-JUNE photos into `/assets` (see `assets/README.md`), then
tell Claude and every page gets repointed to `/assets/...` in one pass.

## Analytics & SEO

GTM `GTM-K4PVZXT` + GA4 `G-DPFH9GHL6N` on every public page. `sitemap.xml`,
`robots.txt` (blocks /admin), canonical tags, OG/Twitter cards, and schema
(LocalBusiness sitewide; FAQPage on senior/classes/youth/PT/free-trial/gloves;
Service on senior; Product/ItemList on the shop; BlogPosting on posts).
After launch: submit the sitemap in Google Search Console.

## Go live (DNS cutover — final step)

At your domain registrar, point punchpgh.com to Vercel (Vercel shows the exact
records when you add the domain). Squarespace stays untouched until then.
