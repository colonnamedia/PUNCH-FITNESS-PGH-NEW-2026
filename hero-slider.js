/* hero-slider.js — runs on EVERY page. Reads /admin > Hero Slides
   (hero_slides table, filtered by the current page's key, ordered by
   sort_order):
     - 0 rows  -> does nothing; that page's existing static hero plays
                  exactly as coded, untouched (safest possible fallback).
     - 1 row   -> swaps in that single slide as a BARE element matching the
                  page's own proven hero structure exactly (same tag, same
                  class) — no new wrapper, no new CSS surface, so it inherits
                  whatever styling already correctly works on that page.
     - 2+ rows -> stacks multiple elements sharing the SAME class the page's
                  hero already uses (ph-video / pth-video / plain video on
                  home) PLUS a shared .hero-cf-slide crossfade class, so
                  sizing/position/mobile-behavior is identical to the proven
                  single-hero case, with only opacity crossfading added.
   Any failure (no config for this page, fetch error, timeout, load error)
   leaves that page's original static hero exactly as-is. */
(function () {
  var PAGE_MAP = {
    "/": "home", "/index": "home", "/index.html": "home",
    "/free-trial": "free-trial",
    "/punch-ad-trials": "punch-ad-trials",
    "/schedule": "schedule",
    "/classes": "classes",
    "/senior-fitness-and-boxing-pittsburgh": "senior",
    "/youth-boxing-camp": "youth",
    "/personal-training": "personal-training",
    "/about": "about",
    "/contact": "contact",
    "/trainers": "trainers"
  };
  var path = location.pathname.replace(/\/$/, "") || "/";
  var pageKey = PAGE_MAP[path];
  if (!pageKey) return; // no hero-slider support configured for this page

  // Locate this page's existing hero element + the class it needs to keep
  // (so it inherits that page's own proven sizing/position/mobile rules).
  var original, reuseClass;
  if (pageKey === "home") {
    var vhero = document.querySelector(".vhero");
    original = vhero && vhero.querySelector(":scope > video");
    reuseClass = null; // home's base video has no special class to preserve
  } else if (pageKey === "punch-ad-trials") {
    original = document.querySelector(".pth-wrap video.pth-video, .pth-wrap img.pth-video");
    reuseClass = "pth-video";
  } else {
    original = document.querySelector(".ph-wrap video.ph-video, .ph-wrap img.ph-video");
    reuseClass = "ph-video";
  }
  if (!original || !original.parentNode) return;
  var container = original.parentNode;

  var CFG = window.PUNCH_CONFIG || {};
  if (!CFG.SUPABASE_URL || String(CFG.SUPABASE_URL).indexOf("YOUR-PROJECT") !== -1) return;

  function makeEl(row, extraClass) {
    var el;
    if (row.media_type === "video") {
      el = document.createElement("video");
      el.autoplay = true; el.muted = true; el.loop = true; el.playsInline = true;
      el.preload = "auto";
      var src = document.createElement("source");
      src.src = row.url; src.type = "video/mp4";
      el.appendChild(src);
    } else {
      el = document.createElement("img");
      el.src = row.url;
      el.alt = row.alt_text || "";
    }
    if (reuseClass) el.classList.add(reuseClass);
    if (extraClass) el.className = (el.className ? el.className + " " : "") + extraClass;
    return el;
  }

  (async function () {
    try {
      var mod = await import("https://esm.sh/@supabase/supabase-js@2");
      var sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      var res = await sb.from("hero_slides").select("*").eq("page", pageKey).order("sort_order", { ascending: true });
      var rows = (!res.error && res.data) ? res.data.filter(function (r) { return r && r.url; }) : [];
      if (!rows.length) return; // nothing configured for this page — leave default alone

      var els;
      if (rows.length === 1) {
        // Bare element, no wrapper, no crossfade class — identical in shape
        // to the page's original hero, so it inherits that page's already-
        // proven CSS untouched. This is deliberately the SAME safe strategy
        // already verified working on the homepage.
        var only = makeEl(rows[0], null);
        if (pageKey === "home") only.style.background = "#141416";
        els = [only];
      } else {
        els = rows.map(function (r, i) {
          var el = makeEl(r, "hero-cf-slide" + (i === 0 ? " active" : ""));
          container.appendChild(el);
          return el;
        });
      }

      function swapIn() {
        if (!original.parentNode) return;
        if (rows.length === 1) {
          original.replaceWith(els[0]);
        } else {
          original.remove(); // multi-slide elements are already appended to container above
        }
        if (els.length > 1) {
          var dots = document.createElement("div");
          dots.className = "hero-cf-dots";
          var dotEls = els.map(function (_, i) {
            var b = document.createElement("button");
            b.className = "hero-cf-dot" + (i === 0 ? " active" : "");
            b.setAttribute("aria-label", "Show slide " + (i + 1));
            dots.appendChild(b);
            return b;
          });
          container.appendChild(dots);

          var idx = 0;
          function goTo(next) {
            els[idx].classList.remove("active"); dotEls[idx].classList.remove("active");
            if (els[idx].tagName === "VIDEO") els[idx].pause();
            idx = next;
            els[idx].classList.add("active"); dotEls[idx].classList.add("active");
            if (els[idx].tagName === "VIDEO") { try { els[idx].currentTime = 0; els[idx].play(); } catch (e) {} }
          }
          var timer = setInterval(function () { goTo((idx + 1) % els.length); }, 6000);
          dotEls.forEach(function (b, i) {
            b.addEventListener("click", function () {
              clearInterval(timer);
              goTo(i);
              timer = setInterval(function () { goTo((idx + 1) % els.length); }, 6000);
            });
          });
        }
      }

      // Reveal only once the FIRST slide has actually finished loading —
      // never swap out (or leave visible over) the known-good default with
      // something that hasn't confirmed it works. If it errors, or simply
      // takes too long, we abandon and the original hero stays exactly as
      // it was — this can never leave a blank/broken hero on screen.
      var first = els[0];
      var settled = false;
      function succeed() { if (!settled) { settled = true; clearTimeout(giveUp); swapIn(); } }
      function abandon() {
        settled = true; clearTimeout(giveUp);
        if (rows.length > 1) els.forEach(function (e) { if (e.parentNode) e.remove(); });
      }
      var giveUp = setTimeout(abandon, 15000);
      if (first.tagName === "VIDEO") {
        first.addEventListener("loadeddata", succeed, { once: true });
        first.addEventListener("error", abandon, { once: true });
        try { first.load(); } catch (e) { abandon(); }
      } else {
        first.addEventListener("load", succeed, { once: true });
        first.addEventListener("error", abandon, { once: true });
      }
    } catch (e) { /* leave the page's original static hero exactly as-is */ }
  })();
})();
