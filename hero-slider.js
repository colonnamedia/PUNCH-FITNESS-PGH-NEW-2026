/* hero-slider.js — homepage-only. Supersedes the old single-slot
   "home.hero_video" media.js wiring for this element specifically.
   Reads /admin > Hero Slides (hero_slides table, ordered by sort_order):
     - 0 rows  -> does nothing; the existing static hero in index.html plays
                  exactly as coded, untouched (safest possible fallback).
     - 1 row   -> swaps in that single slide (no carousel chrome), same
                  "hidden until ready" technique as media.js so the default
                  is never visibly flashed before the real one loads.
     - 2+ rows -> builds an auto-advancing slider with dot indicators.
   Any failure (no config, fetch error, timeout) leaves the original static
   hero exactly as-is — this can never break the homepage hero. */
(function () {
  var section = document.querySelector(".vhero");
  var original = section && section.querySelector(":scope > video");
  if (!section || !original) return;

  var CFG = window.PUNCH_CONFIG || {};
  if (!CFG.SUPABASE_URL || String(CFG.SUPABASE_URL).indexOf("YOUR-PROJECT") !== -1) return;

  (async function () {
    try {
      var mod = await import("https://esm.sh/@supabase/supabase-js@2");
      var sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      var res = await sb.from("hero_slides").select("*").order("sort_order", { ascending: true });
      var rows = (!res.error && res.data) ? res.data.filter(function (r) { return r && r.url; }) : [];
      if (!rows.length) return; // nothing configured — leave the static default alone

      // For a SINGLE slide, don't introduce any new wrapper/CSS at all — just
      // build a bare element matching the ORIGINAL hero's exact structure
      // (same tag, same attributes) so it inherits the site's existing,
      // proven hero styling untouched. Only 2+ slides need the dedicated
      // .vhero-slides crossfade wrapper.
      var wrap = null, els;
      if (rows.length === 1) {
        var only;
        if (rows[0].media_type === "video") {
          only = document.createElement("video");
          only.autoplay = true; only.muted = true; only.loop = true; only.playsInline = true;
          only.preload = "auto";
          only.style.background = "#141416";
          var src0 = document.createElement("source");
          src0.src = rows[0].url; src0.type = "video/mp4";
          only.appendChild(src0);
        } else {
          only = document.createElement("img");
          only.src = rows[0].url;
          only.alt = rows[0].alt_text || "";
          only.style.width = "100%"; only.style.height = "58vh"; only.style.objectFit = "cover"; only.style.display = "block";
        }
        els = [only];
      } else {
        wrap = document.createElement("div");
        wrap.className = "vhero-slides";
        els = rows.map(function (r, i) {
          var el;
          if (r.media_type === "video") {
            el = document.createElement("video");
            el.muted = true; el.autoplay = true; el.loop = true; el.playsInline = true;
            el.preload = "auto";
            var src = document.createElement("source");
            src.src = r.url; src.type = "video/mp4";
            el.appendChild(src);
          } else {
            el = document.createElement("img");
            el.src = r.url;
            el.alt = r.alt_text || "";
          }
          el.className = "vhero-slide" + (i === 0 ? " active" : "");
          wrap.appendChild(el);
          return el;
        });
      }

      function swapIn() {
        if (!original.parentNode) return;
        original.replaceWith(wrap || els[0]);
        if (els.length > 1) {
          var dots = document.createElement("div");
          dots.className = "vhero-dots";
          var dotEls = els.map(function (_, i) {
            var b = document.createElement("button");
            b.className = "vhero-dot" + (i === 0 ? " active" : "");
            b.setAttribute("aria-label", "Show slide " + (i + 1));
            dots.appendChild(b);
            return b;
          });
          section.appendChild(dots);

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

      // Reveal only once the first slide has ACTUALLY finished loading — never
      // swap out the known-good default for something that hasn't confirmed
      // it works. If it errors, or simply takes too long (large video files
      // can take a while), we abandon and leave the original hero exactly as
      // it was — this can never leave a blank/broken hero on screen.
      var first = els[0];
      var settled = false;
      function succeed() { if (!settled) { settled = true; clearTimeout(giveUp); swapIn(); } }
      function abandon() { settled = true; clearTimeout(giveUp); }
      var giveUp = setTimeout(abandon, 15000);
      if (first.tagName === "VIDEO") {
        first.addEventListener("loadeddata", succeed, { once: true });
        first.addEventListener("error", abandon, { once: true });
        try { first.load(); } catch (e) { abandon(); }
      } else {
        first.addEventListener("load", succeed, { once: true });
        first.addEventListener("error", abandon, { once: true });
      }
    } catch (e) { /* leave the static default hero exactly as-is */ }
  })();
})();
