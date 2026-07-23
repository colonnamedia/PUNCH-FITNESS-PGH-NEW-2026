# Analytics — GTM + GA4 (read this)

## What's on the site now
Every page loads your **Google Tag Manager** container `GTM-K4PVZXT` (in `<head>`
and the `<noscript>` fallback). That part is correct and consistent across pages.

## The thing to check: GA4 (`G-DPFH9GHL6N`)
Your GA4 Measurement ID does **not** appear anywhere in the page code — and that's
actually normal *if* GA4 is configured as a tag inside your GTM container. But if
it isn't, GA4 is collecting nothing. Please confirm which case you're in:

**30-second check:** open your site with the Google **Tag Assistant** (tagassistant.google.com)
or GTM **Preview** mode. If you see a "GA4 Configuration / Google Tag" firing with
`G-DPFH9GHL6N`, you're all set — do nothing. If you don't, pick one option below.

### Option A (recommended) — add GA4 inside GTM
1. GTM → Tags → New → **Google Tag** (or "GA4 Configuration").
2. Tag ID: `G-DPFH9GHL6N`. Trigger: **All Pages / Initialization**.
3. Submit → Publish the container.

This keeps GTM as the single source of truth and avoids double-counting. Nothing
changes in the site files.

### Option B — hardcode GA4 directly (only if it's NOT in GTM)
Paste this into the `<head>` of each page, right below the GTM script. **Do not do
this if GA4 is already firing through GTM — it would double-count every visit.**

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DPFH9GHL6N"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DPFH9GHL6N');
</script>
```

Tell me which case you're in and I'll wire it the right way across every page so it
stays consistent as we build the rest of the site.

## Also live for SEO
- `sitemap.xml` (submit it in Google Search Console → Sitemaps)
- `robots.txt` (allows crawling, blocks `/admin`, points to the sitemap)
- `vercel.json` → `cleanUrls` so `/senior-fitness-and-boxing-pittsburgh` serves the
  page and matches its canonical (no `.html` mismatch)
- Schema: LocalBusiness + FAQ + Service on the senior page; CollectionPage + live
  Product data on the shop. Test any URL at **search.google.com/test/rich-results**.
