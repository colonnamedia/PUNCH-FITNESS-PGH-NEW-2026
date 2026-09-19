# punchpgh.com — Punch Boxing & Fitness

Static HTML/CSS site deployed to Render. Every page shares `punch.css`, `nav.js`
(header + footer), and the self-hosted Barlow fonts.

## Deploy

Render runs `npm run build` and publishes `dist` using `render.yaml`.

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

Removed: 30 Day Program (redirects to memberships), Gift Cards (was MindBody).
Zero MindBody links remain anywhere.

## Store + blog data

Supabase remains the data source for public trainers and store inventory. Blog posts
are pulled at build time and prerendered as static indexable pages.

**Stripe is deferred.** Products show "Coming Soon" until you paste a Stripe Payment
Link into a product's Stripe field in the admin — then its Buy button turns on.

## Auto-blog (weekly, rotates 3 topics)

Render runs `scripts/run-blog.js` on the schedule in `render.yaml` and rotates:
Boxing for Fitness → Nutrition → Parkinson's Boxing Benefits.

Set these in the Render cron service:

- `ANTHROPIC_API_KEY` — your Anthropic key
- `SUPABASE_URL` — https://uyzvmrbjlzafpwpamjwa.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Settings → API → service_role (secret)

## Images

Local photography is served as responsive WebP assets. Desktop and mobile variants
are selected with `srcset`; below-the-fold images are lazy-loaded.

## Analytics & SEO

GTM `GTM-K4PVZXT` + GA4 `G-DPFH9GHL6N` on every public page. `sitemap.xml`,
`robots.txt`, canonical tags, OG/Twitter cards, and schema
(LocalBusiness sitewide; FAQPage on senior/classes/youth/PT/free-trial/gloves;
Service on senior; Product/ItemList on the shop; BlogPosting on posts).
After launch: submit the sitemap in Google Search Console.
