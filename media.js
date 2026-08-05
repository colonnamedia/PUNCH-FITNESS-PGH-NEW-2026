/* media.js — swaps hero images/videos from Supabase page_media by [data-slot].
   Slotted media is hidden (opacity:0) until the CORRECT source is applied:
   - with an admin override: revealed only after the admin image finishes loading
     (so the GitHub default is never shown, no flash)
   - without an override: the default is revealed immediately. */
(function () {
  var els = document.querySelectorAll("[data-slot]");
  if (!els.length) return;
  function reveal(el){ el.classList.add("slot-ready"); }
  function revealAll(){ els.forEach(reveal); }
  var safety = setTimeout(revealAll, 2600);
  var CFG = window.PUNCH_CONFIG || {};
  if (!CFG.SUPABASE_URL || String(CFG.SUPABASE_URL).indexOf("YOUR-PROJECT") !== -1){
    clearTimeout(safety); revealAll(); return;
  }
  (async function(){
    try{
      var mod = await import("https://esm.sh/@supabase/supabase-js@2");
      var sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      var res = await sb.from("page_media").select("*");
      var map = {};
      if (!res.error && res.data) res.data.forEach(function(r){ map[r.slot]=r; });
      els.forEach(function(el){
        var r = map[el.getAttribute("data-slot")];
        var tag = el.tagName.toUpperCase();
        if (!r || !r.url){ reveal(el); return; }               // no override → show default now
        if (r.fit && el.style) el.style.objectFit = r.fit;
        if (r.position && el.style) el.style.objectPosition = r.position;
        if (tag === "IMG"){
          if (el.getAttribute("src") === r.url && el.complete){ reveal(el); return; }
          el.onload = function(){ reveal(el); };
          el.onerror = function(){ reveal(el); };
          el.src = r.url;                                       // reveal fires on load → no default flash
          if (el.complete) reveal(el);
        } else if (tag === "VIDEO"){
          var s = el.querySelector("source"); if (s){ s.src = r.url; } else { el.src = r.url; }
          el.addEventListener("loadeddata", function(){ reveal(el); }, { once:true });
          try { el.load(); } catch(e){}
          setTimeout(function(){ reveal(el); }, 1400);
        } else if (tag === "SOURCE"){
          el.src = r.url; try { el.parentElement.load(); } catch(e){} reveal(el);
        } else {
          el.style.backgroundImage = "url('" + r.url + "')"; reveal(el);
        }
      });
    } catch(e){ revealAll(); }
    finally{ clearTimeout(safety); }
  })();
})();
