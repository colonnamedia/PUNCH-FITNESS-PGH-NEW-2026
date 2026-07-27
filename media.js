/* media.js — swaps hero images/videos from Supabase page_media by [data-slot].
   Falls back silently to the hardcoded default already in the HTML. */
(async function () {
  var CFG = window.PUNCH_CONFIG || {};
  if (!CFG.SUPABASE_URL || String(CFG.SUPABASE_URL).indexOf("YOUR-PROJECT") !== -1) return;
  var els = document.querySelectorAll("[data-slot]");
  if (!els.length) return;
  try {
    var mod = await import("https://esm.sh/@supabase/supabase-js@2");
    var sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
    var res = await sb.from("page_media").select("*");
    if (res.error || !res.data) return;
    var map = {};
    res.data.forEach(function (r) { map[r.slot] = r; });
    els.forEach(function (el) {
      var r = map[el.getAttribute("data-slot")];
      if (!r || !r.url) return;
      var tag = el.tagName.toUpperCase();
      if (tag === "VIDEO") {
        var src = el.querySelector("source");
        if (src) { src.src = r.url; } else { el.src = r.url; }
        try { el.load(); } catch (e) {}
      } else if (tag === "SOURCE") {
        el.src = r.url;
        try { el.parentElement.load(); } catch (e) {}
      } else if (tag === "IMG") {
        el.src = r.url;
      } else {
        el.style.backgroundImage = "url('" + r.url + "')";
      }
      if (r.fit && el.style) el.style.objectFit = r.fit;
      if (r.position && el.style) el.style.objectPosition = r.position;
    });
  } catch (e) { /* keep defaults */ }
})();
