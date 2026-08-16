/* Builds ./dist for deployment with fully clean URLs (no .html anywhere).
   - copies every file as-is (SOURCE files are never modified)
   - strips ".html" from internal links in the dist copies
   - writes <page>/index.html for every page so /schedule serves cleanly
   - bakes the admin-set Default Share Image (og:image) into every page
   Publish Directory = dist, Build Command = npm run build. */
const fs = require("fs"), path = require("path"), https = require("https");
const SKIP = new Set(["dist","node_modules",".git",".github","build.cjs","package.json","package-lock.json","render.yaml","README.md","SUPABASE-SETUP.md","ANALYTICS-SEO.md",".DS_Store","scripts","api","supabase"]);
const CLEAN_SKIP = new Set(["index.html","404.html","post.html"]); // keep these flat

/* Public anon key — read-only via RLS (same values as config.js). Used ONLY to
   read the admin-set default share image at build time. Never put secrets here. */
const SB_URL = "https://uyzvmrbjlzafpwpamjwa.supabase.co";
const SB_KEY = "sb_publishable_HPXuZiYMaOHhuXiZ6SONBg_hy6X3_ce";

/* Fetch the admin-set default share image. NEVER throws — on any failure it
   resolves null and the build continues with the per-page og:image untouched,
   so a Supabase hiccup can never take down the deploy. */
function getDefaultOgImage(){
  return new Promise(resolve => {
    let done = false;
    const finish = v => { if(!done){ done = true; resolve(v); } };
    try{
      const url = SB_URL + "/rest/v1/site_settings?key=eq.og_image_url&select=value";
      const req = https.get(url, { headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY } }, res => {
        let body = "";
        res.on("data", c => body += c);
        res.on("end", () => {
          try{
            const j = JSON.parse(body);
            const u = j && j[0] && j[0].value && j[0].value.url;
            finish(typeof u === "string" && /^https?:\/\//.test(u) ? u : null);
          }catch{ finish(null); }
        });
      });
      req.on("error", () => finish(null));
      req.setTimeout(8000, () => { req.destroy(); finish(null); });
    }catch{ finish(null); }
  });
}

function bakeOg(html, url){
  if(!url) return html;
  const v = url.replace(/"/g, "&quot;");
  return html
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/g, "$1" + v + "$2")
    .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/g, "$1" + v + "$2");
}

(async function main(){
  const ogUrl = await getDefaultOgImage();

  fs.rmSync("dist", { recursive: true, force: true });
  fs.mkdirSync("dist", { recursive: true });

  // 1) copy everything into dist
  (function copy(src, dest){
    for (const e of fs.readdirSync(src, { withFileTypes: true })){
      if (src === "." && SKIP.has(e.name)) continue;
      const s = path.join(src, e.name), d = path.join(dest, e.name);
      if (e.isDirectory()){ fs.mkdirSync(d, { recursive: true }); copy(s, d); }
      else fs.copyFileSync(s, d);
    }
  })(".", "dist");

  // 2) strip ".html" from internal links in the dist copies (source files untouched)
  function clean(html){
    return html
      .replace(/href="\/([a-z0-9-]+)\.html(#[a-z0-9-]*)?"/g, 'href="/$1$2"')
      .replace(/href='\/([a-z0-9-]+)\.html(#[a-z0-9-]*)?'/g, "href='/$1$2'");
  }
  for (const f of fs.readdirSync("dist")){
    if (f.endsWith(".html")){
      const p = path.join("dist", f);
      fs.writeFileSync(p, clean(fs.readFileSync(p, "utf8")));
    }
  }
  // also clean nav.js in dist (belt & suspenders)
  if (fs.existsSync("dist/nav.js")){
    fs.writeFileSync("dist/nav.js", clean(fs.readFileSync("dist/nav.js","utf8")));
  }

  // 3) write <page>/index.html for every page -> clean directory URLs
  for (const f of fs.readdirSync("dist")){
    if (f.endsWith(".html") && !CLEAN_SKIP.has(f)){
      const slug = f.replace(/\.html$/,"");
      fs.mkdirSync(path.join("dist", slug), { recursive: true });
      fs.copyFileSync(path.join("dist", f), path.join("dist", slug, "index.html"));
    }
  }

  // 4) bake the admin-set default share image into EVERY page (non-destructive; skipped if unset)
  if (ogUrl){
    (function walk(dir){
      for (const e of fs.readdirSync(dir, { withFileTypes: true })){
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".html")) fs.writeFileSync(p, bakeOg(fs.readFileSync(p, "utf8"), ogUrl));
      }
    })("dist");
    console.log("Default share image applied to all pages:", ogUrl);
  } else {
    console.log("No default share image set — kept per-page og:image.");
  }

  console.log("Built ./dist — all internal links clean, directory URLs generated");
})();
