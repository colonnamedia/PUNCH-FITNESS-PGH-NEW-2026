#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || "dist");
const pages = (process.argv.slice(3).length ? process.argv.slice(3) : [
  "index.html",
  "classes/index.html",
  "membership-options/index.html",
  "nutrition-coaching/index.html",
  "personal-training/index.html",
  "senior-fitness-and-boxing-pittsburgh/index.html",
  "youth-boxing-camp/index.html",
  "boxing-gloves-for-fitness-classes/index.html"
]);

function localPath(url, fromFile) {
  if (!url || /^(?:https?:|data:|mailto:|tel:|#)/i.test(url)) return null;
  const clean = url.split(/[?#]/)[0];
  if (!clean) return null;
  return clean.startsWith("/")
    ? path.join(root, clean.slice(1))
    : path.resolve(path.dirname(fromFile), clean);
}

function bytes(files) {
  return [...files].reduce((sum, file) => {
    try { return sum + fs.statSync(file).size; } catch { return sum; }
  }, 0);
}

function kb(value) { return Math.round(value / 1024); }

const rows = [];
for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const shell = new Set([file]);
  const eagerDesktop = new Set();
  const eagerMobile = new Set();
  const desktopImages = new Set();
  const mobileImages = new Set();

  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
    const filePath = localPath(match[1], file);
    if (filePath && fs.existsSync(filePath)) shell.add(filePath);
  }
  if ([...shell].some(item => path.basename(item) === "nav.js")) {
    const navCore = path.join(root, "nav-core.js");
    if (fs.existsSync(navCore)) shell.add(navCore);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = tag.match(/\bsrc=["']([^"']+)["']/i);
    const srcset = tag.match(/\bsrcset=["']([^"']+)["']/i);
    const srcsetCandidates = srcset
      ? srcset[1].split(",").map(candidate => candidate.trim().split(/\s+/)[0])
      : [];
    const desktop = src ? localPath(src[1], file) : null;
    const mobile = localPath(srcsetCandidates[0] || (src && src[1]), file);
    if (desktop && fs.existsSync(desktop)) desktopImages.add(desktop);
    if (mobile && fs.existsSync(mobile)) mobileImages.add(mobile);
    if (!/\bloading=["']lazy["']/i.test(tag)) {
      if (desktop && fs.existsSync(desktop)) eagerDesktop.add(desktop);
      if (mobile && fs.existsSync(mobile)) eagerMobile.add(mobile);
    }
  }

  rows.push({
    page: page.replace(/\/index\.html$/, "/").replace(/^index\.html$/, "/"),
    shellKB: kb(bytes(shell)),
    initialDesktopKB: kb(bytes(shell) + bytes(eagerDesktop)),
    initialMobileKB: kb(bytes(shell) + bytes(eagerMobile)),
    fullDesktopKB: kb(bytes(shell) + bytes(desktopImages)),
    fullMobileKB: kb(bytes(shell) + bytes(mobileImages)),
    eagerImages: eagerDesktop.size,
    contentImages: desktopImages.size
  });
}

console.log(JSON.stringify(rows, null, 2));
