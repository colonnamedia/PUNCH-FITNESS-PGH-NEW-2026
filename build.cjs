/* Copies the static site into ./dist so hosts expecting a "dist" publish
   directory work. Not required on Vercel or when publishing from root. */
const fs = require("fs"), path = require("path");
const SKIP = new Set(["dist","node_modules",".git",".github","build.js","package.json","package-lock.json","render.yaml","README.md","SUPABASE-SETUP.md","ANALYTICS-SEO.md",".DS_Store"]);
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });
(function copy(src, dest) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (src === "." && SKIP.has(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); copy(s, d); }
    else fs.copyFileSync(s, d);
  }
})(".", "dist");
console.log("Built ./dist");
