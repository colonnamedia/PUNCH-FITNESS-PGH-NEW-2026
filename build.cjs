/* Builds ./dist for deployment with fully clean URLs (no .html anywhere).
   - copies every file as-is (SOURCE files are never modified)
   - strips ".html" from internal links in the dist copies
   - writes <page>/index.html for every page so /schedule serves cleanly
   - bakes the admin-set Default Share Image (og:image) into every page
   - PRE-RENDERS each published blog post to /blog/<slug>/index.html (static HTML)
   Publish Directory = dist, Build Command = npm run build. */
const fs = require("fs"), path = require("path"), https = require("https");
const SKIP = new Set(["dist","node_modules",".git",".github","build.cjs","package.json","package-lock.json","render.yaml","README.md","SUPABASE-SETUP.md","ANALYTICS-SEO.md",".DS_Store","scripts","api","supabase"]);
const CLEAN_SKIP = new Set(["index.html","404.html","post.html"]); // keep these flat

/* Public anon key — read-only via RLS (same values as config.js). Used ONLY to
   read the default share image + published blog posts at build time. No secrets. */
const SB_URL = "https://uyzvmrbjlzafpwpamjwa.supabase.co";
const SB_KEY = "sb_publishable_HPXuZiYMaOHhuXiZ6SONBg_hy6X3_ce";
const OG_FALLBACK = "https://punchpgh.com/assets/punch-pittsburgh-41.jpg";

/* Generic defensive GET against Supabase REST. NEVER throws — resolves null on
   any failure so a Supabase hiccup can never take down the deploy. */
function sbGet(pathAndQuery){
  return new Promise(resolve => {
    let done = false;
    const finish = v => { if(!done){ done = true; resolve(v); } };
    try{
      const req = https.get(SB_URL + pathAndQuery, { headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY } }, res => {
        let body = "";
        res.on("data", c => body += c);
        res.on("end", () => { try{ finish(JSON.parse(body)); }catch{ finish(null); } });
      });
      req.on("error", () => finish(null));
      req.setTimeout(10000, () => { req.destroy(); finish(null); });
    }catch{ finish(null); }
  });
}
async function getDefaultOgImage(){
  const j = await sbGet("/rest/v1/site_settings?key=eq.og_image_url&select=value");
  const u = j && j[0] && j[0].value && j[0].value.url;
  return (typeof u === "string" && /^https?:\/\//.test(u)) ? u : null;
}
async function getPublishedPosts(){
  const j = await sbGet("/rest/v1/blog_posts?published=eq.true&select=slug,title,topic,excerpt,body,image_url,created_at&order=created_at.desc&limit=200");
  return Array.isArray(j) ? j.filter(p => p && p.slug) : [];
}
async function getPageContent(page){
  const sections = await sbGet("/rest/v1/page_sections?page=eq." + page + "&select=section_key,sort_order");
  const text = await sbGet("/rest/v1/page_text?page=eq." + page + "&select=section_key,field_key,value");
  return {
    sections: Array.isArray(sections) ? sections : [],
    text: Array.isArray(text) ? text : []
  };
}

/* ---- render helpers (ported to match post.html exactly) ---- */
const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const when = d => { try{ return new Date(d).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); }catch{ return ""; } };
function md(src){
  let t = esc(src);
  t = t.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>");
  t = t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<em>$2</em>");
  const lines = t.split(/\n/); let out=[], inList=false, para=[];
  const flush=()=>{ if(para.length){ out.push("<p>"+para.join(" ")+"</p>"); para=[]; } };
  for (const ln of lines){
    const s = ln.trim();
    if (/^<h[23]>/.test(s)){ flush(); if(inList){out.push("</ul>");inList=false;} out.push(s); }
    else if (/^[-*] /.test(s)){ flush(); if(!inList){out.push("<ul>");inList=true;} out.push("<li>"+s.slice(2)+"</li>"); }
    else if (!s){ flush(); if(inList){out.push("</ul>");inList=false;} }
    else para.push(s);
  }
  flush(); if(inList) out.push("</ul>");
  return out.join("");
}
function bakeOg(html, url){
  if(!url) return html;
  const v = url.replace(/"/g, "&quot;");
  return html
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/g, "$1" + v + "$2")
    .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/g, "$1" + v + "$2");
}

/* ---- Page content: text overrides + section reorder (homepage, page='home') ----
   Both are OFF by default — no rows in the DB means the page renders exactly
   as coded, untouched. Every step below bails out (returns the original html
   unchanged) the moment anything looks unexpected, rather than risk a broken
   page. */
function escapeHtml(str){
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function applyTextOverrides(html, textRows){
  if (!textRows || !textRows.length) return html;
  const map = {};
  textRows.forEach(r => { if (r && r.section_key && r.field_key && r.value != null) map[r.section_key + "." + r.field_key] = r.value; });
  if (!Object.keys(map).length) return html;
  // Matches <TAG ...data-text="key"...>INNER</TAG> using a backreference so
  // open/close tag names must match. Safe for the current field set because
  // none of the tagged elements contain a nested element of the SAME tag
  // name (a leaf-level span/p/div holding only text) — if a future field is
  // tagged on an element that DOES nest the same tag inside itself, this
  // naive non-greedy match would stop at the inner closing tag instead of
  // the outer one, so keep tagged elements to simple text leaves only.
  return html.replace(/<([a-z][a-z0-9]*)([^>]*\sdata-text="([a-z0-9_.\-]+)"[^>]*)>([\s\S]*?)<\/\1>/gi,
    function (full, tag, attrs, key, inner){
      if (!(key in map)) return full;
      return "<" + tag + attrs + ">" + escapeHtml(map[key]) + "</" + tag + ">";
    });
}

function applyEmbedOverrides(html, textRows){
  if (!textRows || !textRows.length) return html;
  const map = {};
  textRows.forEach(r => { if (r && r.section_key && r.field_key && r.value != null) map[r.section_key + "." + r.field_key] = r.value; });
  if (!Object.keys(map).length) return html;
  // Matches <TAG ...data-embed="key"...src="OLD"...> and replaces just the
  // src value — everything else about the tag (styles, title, etc.) stays
  // exactly as coded. Only touches elements explicitly marked data-embed.
  return html.replace(/<([a-z][a-z0-9]*)\b([^>]*\sdata-embed="([a-z0-9_.\-]+)"[^>]*)>/gi,
    function (full, tag, attrs, key){
      if (!(key in map) || !map[key]) return full;
      const newSrc = map[key].replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      const newAttrs = /\ssrc="[^"]*"/i.test(attrs)
        ? attrs.replace(/\ssrc="[^"]*"/i, ' src="' + newSrc + '"')
        : attrs + ' src="' + newSrc + '"';
      return "<" + tag + newAttrs + ">";
    });
}

function extractSectionBlock(html, tag, startIdx){
  const openTok = "<" + tag, closeTok = "</" + tag + ">";
  const gt = html.indexOf(">", startIdx);
  if (gt === -1) return null;
  let pos = gt + 1, depth = 1;
  while (depth > 0){
    const no = html.indexOf(openTok, pos);
    const nc = html.indexOf(closeTok, pos);
    if (nc === -1) return null; // malformed — bail
    if (no !== -1 && no < nc){
      const after = html[no + openTok.length];
      if (after === ">" || after === " " || after === "\n" || after === "\t" || after === "/"){
        depth++;
      }
      pos = no + openTok.length;
      continue;
    }
    depth--;
    pos = nc + closeTok.length;
  }
  return { start: startIdx, end: pos, html: html.slice(startIdx, pos) };
}

function applySectionOrder(html, sectionRows, orderedKeys){
  if (!sectionRows || !sectionRows.length) return html; // nothing configured — leave as-is

  const savedOrder = {};
  const archived = {};
  orderedKeys.forEach((key, i) => { savedOrder[key] = i * 100; });
  sectionRows.forEach(r => {
    if (!r || !r.section_key || !(r.section_key in savedOrder)) return;
    if (typeof r.sort_order === "number") savedOrder[r.section_key] = r.sort_order;
    if (r.active === false) archived[r.section_key] = true;
  });

  // Locate every block fresh from the ORIGINAL string (no mutation mid-scan,
  // so there's no index-shifting risk).
  const blocks = [];
  for (const key of orderedKeys){
    const re = new RegExp('<(div|section)\\b[^>]*\\bdata-section="' + key + '"[^>]*>');
    const m = re.exec(html);
    if (!m) return html; // a section is missing entirely — abort, don't risk a partial reorder
    const block = extractSectionBlock(html, m[1], m.index);
    if (!block) return html;
    blocks.push({ key, start: block.start, end: block.end, html: block.html });
  }

  // Must be strictly sequential, non-overlapping siblings — if not, something
  // about the page's structure isn't what we expect; abort safely.
  for (let i = 1; i < blocks.length; i++){
    if (blocks[i].start < blocks[i-1].end) return html;
  }

  const before = html.slice(0, blocks[0].start);
  const after = html.slice(blocks[blocks.length - 1].end);
  const gap = blocks.length > 1 ? html.slice(blocks[0].end, blocks[1].start) : "\n\n";

  const newOrderKeys = orderedKeys.slice()
    .filter(k => !archived[k])
    .sort((a, b) => savedOrder[a] - savedOrder[b]);
  const byKey = {}; blocks.forEach(b => { byKey[b.key] = b; });
  const reassembled = newOrderKeys.map(k => byKey[k].html).join(gap);

  return before + reassembled + after;
}

/* full static page for a single blog post */
function blogPageHtml(p, ogFallback){
  const title = esc(p.title) + " | Punch Boxing &amp; Fitness";
  const desc = esc(p.excerpt || (p.title + " — Punch Boxing & Fitness, South Hills Pittsburgh."));
  const url = "https://punchpgh.com/blog/" + encodeURIComponent(p.slug);
  const img = (p.image_url && /^https?:\/\//.test(p.image_url)) ? p.image_url : (ogFallback || OG_FALLBACK);
  const imgEsc = esc(img);
  const ld = {"@context":"https://schema.org","@type":"BlogPosting","headline":p.title,
    "datePublished":p.created_at,"description":p.excerpt||"","image":img,"url":url,
    "mainEntityOfPage":url,"author":{"@type":"Organization","name":"Punch Boxing & Fitness"},
    "publisher":{"@type":"Organization","name":"Punch Boxing & Fitness","logo":{"@type":"ImageObject","url":"https://punchpgh.com/assets/punch-logo-1.png"}}};
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
<link rel="apple-touch-icon" href="/assets/favicon.svg" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${imgEsc}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="Punch Boxing &amp; Fitness" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${imgEsc}" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K4PVZXT');</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DPFH9GHL6N"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DPFH9GHL6N');</script>
<link rel="stylesheet" href="/punch.css" />
<script src="/nav.js" defer></script>
<script src="/config.js"></script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K4PVZXT" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div id="plp">
  <div class="s" style="padding-top:60px">
    <div class="si">
      <div id="post-root" style="max-width:760px;margin:0 auto">
        <div class="bpost-topic" style="margin-bottom:12px">${esc(p.topic)}</div>
        <h1 class="h2" style="font-size:clamp(34px,5vw,54px);margin-bottom:10px">${esc(p.title)}</h1>
        <div class="bpost-date" style="margin-bottom:26px">${when(p.created_at)}</div>
        ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.title)}" style="width:100%;border-radius:14px;margin-bottom:28px">` : ""}
        <div class="article">${md(p.body)}</div>
      </div>
      <div style="max-width:760px;margin:44px auto 0;text-align:center">
        <a href="/blog-events" class="btn-dark">&larr; All Posts</a>
      </div>
    </div>
  </div>
  <div class="final">
    <span class="lbl" style="color:rgba(255,255,255,.6)">Ready to Train?</span>
    <div class="final-title">Your First Class Is Free.</div>
    <div class="final-sub">Come try it in person — no experience needed, all levels welcome.</div>
    <div class="final-btns">
      <a href="https://punchpgh.pushpress.com/landing/plans/plan_c63218daed254b" class="btn-wht" target="_blank" rel="noopener">Claim My Free Class</a>
      <a href="/membership-options" class="btn-ghost-w">See Memberships</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

(async function main(){
  const ogUrl = await getDefaultOgImage();
  const posts = await getPublishedPosts();

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
  if (fs.existsSync("dist/nav.js")){
    fs.writeFileSync("dist/nav.js", clean(fs.readFileSync("dist/nav.js","utf8")));
  }

  // 2.5) apply per-page text overrides + section reorder, BEFORE the
  //      directory-URL copy step below — so dist/<page>/index.html (what the
  //      live site actually serves) inherits these changes automatically,
  //      instead of getting silently skipped because it was already copied.
  //      Each entry is one page: its Supabase page key, its flat dist file,
  //      and (if that page has data-section wrappers tagged) the section
  //      order for reordering. A page with no data-section tags yet still
  //      gets full text/embed overrides — reordering has nothing to do until
  //      that page is tagged too. No config at all for a page -> untouched.
  const PAGE_CONTENT_CONFIGS = [
    { page: "home", file: "dist/index.html", sectionOrder: ["cta","stats","reels","schedule",
      "punch-experience","combined-header","programs","hero-stmt","big-quote","exp-reverse",
      "journey","different","fight-train-sweat","combo","reviews","lead-form","final"] },
    { page: "classes", file: "dist/classes.html", sectionOrder: [] },
    { page: "punch-ad-trials", file: "dist/punch-ad-trials.html", sectionOrder: ["schedule","consistency",
      "programs","lead-form","trialcta","reels","journey","stats","threeclasses","faq","reviews","refer","final"] },
  ];
  for (const cfg of PAGE_CONTENT_CONFIGS) {
    try {
      const content = await getPageContent(cfg.page);
      if (!fs.existsSync(cfg.file)) continue;
      let html = fs.readFileSync(cfg.file, "utf8");
      const before = html;
      html = applyTextOverrides(html, content.text);
      html = applyEmbedOverrides(html, content.text);
      const beforeOrder = html;
      if (cfg.sectionOrder.length) html = applySectionOrder(html, content.sections, cfg.sectionOrder);
      const orderActuallyChanged = html !== beforeOrder;

      if (html !== before){
        fs.writeFileSync(cfg.file, html);
        console.log(`Page content [${cfg.page}]: found`, content.text.length, "text/embed override row(s),", content.sections.length, "section-order row(s)");
        if (cfg.sectionOrder.length){
          const finalOrder = [...html.matchAll(/data-section="([a-z-]+)"/g)].map(m => m[1]);
          console.log(`Page content [${cfg.page}]: final section order ->`, finalOrder.join(", "));
          if (content.sections.length && !orderActuallyChanged){
            console.log(`Page content [${cfg.page}]: WARNING — section-order rows exist but the page order did NOT change. applySectionOrder likely aborted safely (a section key didn't match, or wasn't found in strict sequence). Nothing broke, but the reorder did not apply.`);
          }
        }
      } else {
        console.log(`Page content [${cfg.page}]: no overrides configured — page unchanged`);
      }
    } catch (e) {
      console.log(`Page content [${cfg.page}] step skipped —`, e && e.message ? e.message : "Supabase unavailable", "— page unchanged");
    }
  }

  // 3) write <page>/index.html for every page -> clean directory URLs
  for (const f of fs.readdirSync("dist")){
    if (f.endsWith(".html") && !CLEAN_SKIP.has(f)){
      const slug = f.replace(/\.html$/,"");
      fs.mkdirSync(path.join("dist", slug), { recursive: true });
      fs.copyFileSync(path.join("dist", f), path.join("dist", slug, "index.html"));
    }
  }

  // 4) bake the admin-set default share image into EVERY existing page (skipped if unset)
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

  // 5) PRE-RENDER each published blog post -> /blog/<slug>/index.html (after step 4 so
  //    posts keep their own image as og:image, not the global default)
  const blogSlugs = [];
  for (const p of posts){
    try{
      const dir = path.join("dist", "blog", String(p.slug));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), blogPageHtml(p, ogUrl));
      blogSlugs.push(p.slug);
    }catch(e){ /* skip a bad post, never fail the build */ }
  }
  console.log("Pre-rendered blog posts:", blogSlugs.length);

  // 6) add blog posts to sitemap.xml (if present)
  const smPath = "dist/sitemap.xml";
  if (blogSlugs.length && fs.existsSync(smPath)){
    let sm = fs.readFileSync(smPath, "utf8");
    const today = new Date().toISOString().slice(0,10);
    const entries = posts.filter(p => blogSlugs.includes(p.slug)).map(p => {
      const lm = (p.created_at ? new Date(p.created_at).toISOString().slice(0,10) : today);
      return `  <url><loc>https://punchpgh.com/blog/${encodeURIComponent(p.slug)}</loc><lastmod>${lm}</lastmod></url>`;
    }).join("\n");
    if (sm.includes("</urlset>")){
      sm = sm.replace("</urlset>", entries + "\n</urlset>");
      fs.writeFileSync(smPath, sm);
      console.log("Added", blogSlugs.length, "blog URLs to sitemap.xml");
    }
  }

  console.log("Built ./dist — all internal links clean, directory URLs generated");
})();
