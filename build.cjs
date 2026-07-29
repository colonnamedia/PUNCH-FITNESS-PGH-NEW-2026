/* Builds ./dist for deployment with fully clean URLs (no .html anywhere).
   - copies every file as-is (SOURCE files are never modified)
   - strips ".html" from internal links in the dist copies
   - writes <page>/index.html for every page so /schedule serves cleanly
   Publish Directory = dist, Build Command = npm run build. */
const fs = require("fs"), path = require("path");
const SKIP = new Set(["dist","node_modules",".git",".github","build.cjs","package.json","package-lock.json","render.yaml","README.md","SUPABASE-SETUP.md","ANALYTICS-SEO.md",".DS_Store","scripts","api","supabase"]);
const CLEAN_SKIP = new Set(["index.html","404.html","post.html"]); // keep these flat

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

// 3) write <page>/index.html for every page -> clean directory URLs (/schedule, no .html, no visible index.html)
for (const f of fs.readdirSync("dist")){
  if (f.endsWith(".html") && !CLEAN_SKIP.has(f)){
    const slug = f.replace(/\.html$/,"");
    fs.mkdirSync(path.join("dist", slug), { recursive: true });
    fs.copyFileSync(path.join("dist", f), path.join("dist", slug, "index.html"));
  }
}
console.log("Built ./dist — all internal links clean, directory URLs generated");
