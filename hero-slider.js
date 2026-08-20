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

      var wrap = document.createElement("div");
      wrap.className = "vhero-slides";
      var els = rows.map(function (r, i) {
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

      function swapIn() {
        if (!original.parentNode) return; // already swapped (safety fired after real load, or vice versa)
        original.replaceWith(wrap);
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

      // Reveal only once the first slide has real content ready — same
      // no-flash approach as media.js — with a safety timeout in case the
      // "ready" event never fires.
      var first = els[0];
      var safety = setTimeout(swapIn, 3000);
      if (first.tagName === "VIDEO") {
        first.addEventListener("loadeddata", function () { clearTimeout(safety); swapIn(); }, { once: true });
        try { first.load(); } catch (e) {}
      } else {
        first.addEventListener("load", function () { clearTimeout(safety); swapIn(); }, { once: true });
        first.addEventListener("error", function () { clearTimeout(safety); swapIn(); }, { once: true });
      }
    } catch (e) { /* leave the static default hero exactly as-is */ }
  })();
})();
