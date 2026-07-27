/* Builds ./dist for deployment.
   - copies every asset as-is
   - for each top-level <page>.html, ALSO writes <page>/index.html
     so the site serves CLEAN URLs (/schedule) with no .html and no server config.
   At domain cutover we switch internal links to clean paths; this build already
   supports them. Publish Directory = dist, Build Command = npm run build. */
const fs = require("fs"), path = require("path");
const SKIP = new Set(["dist","node_modules",".git",".github","build.cjs","package.json","package-lock.json","render.yaml","README.md","SUPABASE-SETUP.md","ANALYTICS-SEO.md",".DS_Store","scripts","api","supabase"]);
const CLEAN_SKIP = new Set(["index.html","404.html","post.html"]); // keep these flat only

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });

(function copy(src, dest){
  for (const e of fs.readdirSync(src, { withFileTypes: true })){
    if (src === "." && SKIP.has(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()){ fs.mkdirSync(d, { recursive: true }); copy(s, d); }
    else fs.copyFileSync(s, d);
  }
})(".", "dist");

// clean-URL directories
for (const f of fs.readdirSync("dist")){
  if (f.endsWith(".html") && !CLEAN_SKIP.has(f)){
    const slug = f.replace(/\.html$/,"");
    fs.mkdirSync(path.join("dist", slug), { recursive: true });
    fs.copyFileSync(path.join("dist", f), path.join("dist", slug, "index.html"));
  }
}
console.log("Built ./dist with clean-URL directories");
