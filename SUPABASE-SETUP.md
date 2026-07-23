# Punch Store — setup (about 10 minutes, one time)

Your store uses **Supabase** for the product database + image storage, and your
admin dashboard talks to it directly. Free tier is plenty.

## 1. Create the project
1. Go to supabase.com → New project. Pick a name + a database password (save it).
2. Wait ~2 min for it to provision.

## 2. Create the database + image bucket
1. In Supabase: **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, paste the whole thing, click **Run**.
   This creates the `products` table, the `product-images` storage bucket, and the
   security rules (public can view products; only you can edit them).

## 3. Make your admin login
1. **Authentication → Users → Add user.** Enter your email + a password, and keep
   **Auto Confirm User** checked. That's the login for the dashboard.
2. (Recommended) **Authentication → Providers → Email** → turn **off** "Allow new
   users to sign up," so only accounts you create can log in.

## 4. Connect your site
1. **Project Settings → API.** Copy the **Project URL** and the **anon public** key.
2. Open `config.js` in this repo and paste them in:
   ```js
   window.PUNCH_CONFIG = {
     SUPABASE_URL: "https://xxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJ...your anon key...",
     IMAGE_BUCKET: "product-images"
   };
   ```
   The anon key is meant to be public — it can only do what the security rules
   allow (view products, and edit only when you're signed in). Never paste the
   `service_role` key here.

## 5. Deploy + use
1. Push the repo to GitHub → import to Vercel (framework preset **Other**, no build
   command). 
2. Go to `your-site.com/admin.html`, sign in, and start adding products — upload a
   photo, set a name/price/category, save. They appear instantly on
   `your-site.com/punch-apparel.html`.

## Wiring Stripe (when you're ready)
For each product, in Stripe create a **Payment Link** (Stripe Dashboard → Payment
Links → New). Copy its URL and paste it into that product's **Stripe Payment Link**
field in the admin. The store's **Buy** button turns on automatically; products
without a link show **Coming Soon**. No Stripe keys touch this site.

## Notes
- `admin.html` is `noindex` and login-gated, but treat the URL as private.
- Images are served from Supabase Storage (public bucket) — fast and free-tier friendly.
- Want the whole site off Squarespace images too? Upload to `/assets` (see
  `assets/README.md`) and I'll repoint the pages.
