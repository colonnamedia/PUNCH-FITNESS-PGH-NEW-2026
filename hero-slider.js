/* hero-slider.js — homepage-only. Reads /admin > Hero Slides
   (hero_slides table, ordered by sort_order):
     - 0 rows  -> does nothing; the existing static hero in index.html plays
                  exactly as coded, untouched (safest possible fallback).
     - 1 row   -> swaps in that single slide as a BARE <video>/<img> matching
                  the homepage hero's own structure — no wrapper, no new CSS
                  surface, so it inherits whatever already correctly works.
     - 2+ rows -> auto-advancing crossfade with dot indicators.
   Any failure (no config, fetch error, timeout, load error) leaves the
   original static hero exactly as-is — this can never break the hero. */
(function () {
  var section = document.querySelector(".vhero");
  var original = section && section.querySelector(":scope > video");
  if (!section || !original) return;

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
    if (extraClass) el.className = extraClass;
    return el;
  }

  (async function () {
    try {
      var mod = await import("https://esm.sh/@supabase/supabase-js@2");
      var sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      var res = await sb.from("hero_slides").select("*").order("sort_order", { ascending: true });
      var rows = (!res.error && res.data) ? res.data.filter(function (r) { return r && r.url; }) : [];
      if (!rows.length) return; // nothing configured — leave the static default alone

      var els;
      if (rows.length === 1) {
        var only = makeEl(rows[0], null);
        only.style.background = "#141416";
        els = [only];
      } else {
        els = rows.map(function (r, i) {
          var el = makeEl(r, "hero-cf-slide" + (i === 0 ? " active" : ""));
          section.appendChild(el);
          return el;
        });
      }

      function swapIn() {
        if (!original.parentNode) return;
        if (rows.length === 1) {
          original.replaceWith(els[0]);
        } else {
          original.remove();
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

      // Reveal only once the first slide has ACTUALLY finished loading —
      // never swap out the known-good default for something unconfirmed.
      // If it errors, or just takes too long, we abandon and leave the
      // original hero exactly as it was.
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
    } catch (e) { /* leave the static default hero exactly as-is */ }
  })();
})();
