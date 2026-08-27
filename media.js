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
        if (!r || !r.url){ reveal(el); return; }
        if (r.fit && el.style) el.style.objectFit = r.fit;
        if (r.position && el.style) el.style.objectPosition = r.position;
        if (tag === "IMG"){
          if (el.getAttribute("src") === r.url && el.complete){ reveal(el); return; }
          el.onload = function(){ reveal(el); };
          el.onerror = function(){ reveal(el); };
          el.src = r.url;
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

// Punch Ad Trials — larger swipeable member reel showcase.
(function () {
  var path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path !== "/punch-ad-trials" && path !== "/punch-ad-trials.html") return;

  function enhanceAdReels(){
    var section = document.querySelector('#plp [data-section="reels"]');
    if (!section || section.dataset.reelsEnhanced === "true") return;
    section.dataset.reelsEnhanced = "true";
    section.classList.add("ad-reels-showcase");

    var children = Array.prototype.slice.call(section.children);
    var panel = document.createElement("div");
    panel.className = "ad-reels-panel";
    children.forEach(function(child){ panel.appendChild(child); });
    section.appendChild(panel);

    var intro = panel.querySelector(":scope > .si:first-child");
    if (intro) {
      var sub = intro.querySelector(".sub");
      var cta = document.createElement("a");
      cta.className = "ad-reels-cta";
      cta.href = "#lead-form";
      cta.textContent = "Try Your First Punch Class →";
      if (sub) sub.insertAdjacentElement("afterend", cta);
      else intro.appendChild(cta);
    }

    var captions = panel.querySelectorAll(".reel-cap");
    if (captions.length > 1) captions[1].textContent = "Jocelyn";

    var style = document.createElement("style");
    style.id = "ad-reels-showcase-styles";
    style.textContent = `
      #plp .ad-reels-showcase{background:#f5f2ec!important;padding:72px 0!important;overflow:hidden}
      #plp .ad-reels-panel{max-width:1640px;width:calc(100% - 64px);margin:0 auto;background:#fff;border:1px solid #ded8ce;border-radius:22px;padding:48px 0 34px;box-shadow:0 14px 42px rgba(0,0,0,.06);overflow:hidden}
      #plp .ad-reels-panel>.si:first-child{max-width:760px!important;text-align:center!important;margin:0 auto 30px!important;padding:0 28px!important}
      #plp .ad-reels-panel>.si:first-child .sub{margin:0 auto!important}
      #plp .ad-reels-cta{display:inline-block;margin-top:18px;background:#D92B2B;color:#fff;text-decoration:none;border-radius:8px;padding:13px 22px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;transition:transform .2s,background .2s}
      #plp .ad-reels-cta:hover{background:#ef3535;transform:translateY(-1px)}
      #plp .ad-reels-panel>.si:nth-child(2){max-width:none!important;width:100%!important;padding:0!important;margin:0!important}
      #plp .ad-reels-showcase .reels-strip{display:flex!important;grid-template-columns:none!important;gap:18px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;padding:4px 32px 18px!important;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none}
      #plp .ad-reels-showcase .reels-strip::-webkit-scrollbar{display:none}
      #plp .ad-reels-showcase .reels-strip>div{flex:0 0 clamp(310px,21vw,350px)!important;width:clamp(310px,21vw,350px)!important;scroll-snap-align:center;background:#111;border-radius:18px;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.14)}
      #plp .ad-reels-showcase .reel-v{display:block!important;width:100%!important;height:auto!important;aspect-ratio:9/16!important;object-fit:cover!important;background:#111!important;border-radius:0!important}
      #plp .ad-reels-showcase .reel-cap{background:#111!important;color:#fff!important;text-align:left!important;padding:13px 16px 15px!important;font-family:'Barlow Condensed',sans-serif!important;font-size:18px!important;font-weight:800!important;letter-spacing:.06em!important;text-transform:uppercase!important}
      @media(min-width:1200px){
        #plp .ad-reels-showcase .reels-strip{justify-content:center!important;scroll-snap-type:none!important}
      }
      @media(max-width:760px){
        #plp .ad-reels-showcase{padding:52px 0!important}
        #plp .ad-reels-panel{width:100%;border-radius:0;border-left:0;border-right:0;padding:38px 0 24px}
        #plp .ad-reels-panel>.si:first-child{padding:0 20px!important;margin-bottom:24px!important}
        #plp .ad-reels-showcase .reels-strip{justify-content:flex-start!important;gap:14px!important;padding:4px 20px 16px!important;scroll-padding-left:20px!important;scroll-snap-type:x mandatory!important}
        #plp .ad-reels-showcase .reels-strip>div{flex-basis:min(82vw,370px)!important;width:min(82vw,370px)!important;scroll-snap-align:start!important}
        #plp .ad-reels-cta{width:100%;max-width:320px;text-align:center}
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceAdReels, { once:true });
  } else {
    enhanceAdReels();
  }
})();