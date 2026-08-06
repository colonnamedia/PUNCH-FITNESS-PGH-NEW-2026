# /assets — image library for punchpgh.com

Drop your images into these folders and commit them with the repo. Because the
site deploys to Vercel from this same repo, any file here is served at
`/assets/...` — reference it in HTML like `src="/assets/heroes/home-poster.jpg"`.
No separate CDN repo needed.

## Folders

- `heroes/`   — hero poster stills (one per page; the moving hero is the R2 video)
- `programs/` — program / class photos (adult, youth, senior, personal training)
- `trainers/` — coach headshots
- `gallery/`  — the Fight/Train/Sweat photo strip + studio shots
- `apparel/`  — product photos for the shop (square, ~1000×1000)
- `logo/`     — logo files (png + svg)

## Naming (lowercase, hyphens, no spaces)

Use short, descriptive names so they're easy to reference:
`senior-hero.jpg`, `trainer-anthony.jpg`, `program-youth.jpg`, `apparel-fight-club-tee.jpg`, `logo-white.png`.

Keep photos web-sized: heroes/programs ≤ 1600px wide, apparel 1000×1000,
trainers ~800×1000. JPG for photos, PNG/SVG for the logo.

## What the current pages need (download from the live Squarespace URLs, rename, upload)

Senior / Parkinson's page:
- `heroes/senior-hero.jpg`      ← FD39B942…122853866135.png (older adult boxing)
- `trainers/anthony.jpg`        ← DSC06229.jpg
- `trainers/codi-lee.jpg`       ← …Colonna Media (1 of 1)-7.jpg
- `trainers/eo.jpg`             ← DSC07150.jpeg
- `logo/punch-logo.png`         ← PUNCH LOGO 1 NEW 2026 WEBSITE.png

Homepage (when we rebuild it):
- `heroes/home-poster.jpg`      ← Colonna Media (16 of 21).jpg
- `programs/adult.jpg`, `programs/youth.jpg`, `programs/senior.png`, `programs/personal-training.jpg`
- `gallery/studio-1.jpg` … `gallery/studio-5.jpg`

Apparel:
- `apparel/…` one square photo per product (see punch-apparel.html for the list).

## Switching a page from Squarespace URLs to /assets

Right now the built pages point at the live Squarespace CDN so they render
immediately. Once you've uploaded the matching files here, tell me and I'll do a
find-and-replace so every page points at `/assets/...` instead — fully off
Squarespace.
