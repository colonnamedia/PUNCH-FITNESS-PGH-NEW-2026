/* ============================================================================
   Punch — shared header + footer.
   Include ONE line on any page:  <script src="/nav.js" defer></script>
   Styles live in punch.css. All booking links are PushPress (no MindBody).
   ========================================================================== */
(function () {
  var TRIAL = "https://punchpgh.pushpress.com/landing/plans?category=plcat_2j49r5iagc21ll";
  var LOGIN = "https://members.pushpress.com/";

  // Unified desktop navigation treatment used across the full site.
  // This mirrors the approved 24-hour-special header proportions.
  var navStyle = document.createElement("style");
  navStyle.id = "punch-global-nav-style";
  navStyle.textContent = `
    @media(min-width:1200px){
      .pn-bar{max-width:1720px!important;height:104px!important;padding:0 48px!important;gap:38px!important}
      .pn-logo{min-width:230px!important}
      .pn-logo img{height:52px!important;width:auto!important;max-width:none!important}
      .pn-logo b{font-size:28px!important;line-height:.9!important}
      .pn-logo span{font-size:8px!important;letter-spacing:.22em!important;margin-top:4px!important}
      .pn-nav{gap:14px!important}
      .pn-link{font-size:24px!important;padding:18px 20px!important;letter-spacing:.035em!important}
      .pn-caret{font-size:12px!important;margin-left:7px!important}
      .pn-cta{font-size:14px!important;padding:0 22px!important;height:48px!important;min-height:48px!important;border-radius:7px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
      .pn-menu{min-width:280px!important}
      .pn-menu a{font-size:17px!important;line-height:1.35!important;padding:14px 17px!important}
      .pn-menu .pn-sub-desc{font-size:13px!important;line-height:1.35!important;margin-top:4px!important}
    }
  `;
  document.head.appendChild(navStyle);

  var header =
  '<header class="pn" id="pnHeader"><div class="pn-bar">' +
    '<a class="pn-logo" href="/" aria-label="Punch Boxing and Fitness home">' +
      '<img id="pnLogoImg" src="/assets/punch-logo-1.png" alt="Punch Boxing &amp; Fitness" '+
      'onerror="this.onerror=null;this.style.display=\'none\';var t=this.parentNode;t.querySelector(\'b\').style.display=\'block\';t.querySelector(\'span\').style.display=\'block\'">' +
      '<b>PUNCH</b><span>Boxing &amp; Fitness</span></a>' +
    '<nav class="pn-nav">' +
      '<div class="pn-item"><button class="pn-link">Classes<span class="pn-caret">&#9660;</span></button>' +
        '<div class="pn-menu">' +
          '<a class="pn-sub-feat" href="/classes">Core Program<span class="pn-sub-desc">Cardio Boxing &middot; Boxing + Strength &middot; Circuit Training</span></a>' +
          '<a href="/youth-boxing-camp">Youth Boxing</a>' +
          '<a href="/senior-fitness-and-boxing-pittsburgh">Senior &amp; Parkinson\'s</a>' +
          '<div class="pn-menu-div"></div>' +
          '<a href="/trainers">Meet the Trainers</a></div></div>' +
      '<a class="pn-link" href="/personal-training">Personal Training</a>' +
      '<a class="pn-link" href="/schedule">Schedule</a>' +
      '<div class="pn-item"><button class="pn-link">Pricing &amp; Plans<span class="pn-caret">&#9660;</span></button>' +
        '<div class="pn-menu">' +
          '<a href="/membership-options">Membership Options</a>' +
          '<a href="/free-trial">Free Trial Class</a>' +
          '<a href="/boxing-gloves-for-fitness-classes">Boxing Gloves</a>' +
          '<a href="/punch-apparel">Apparel</a></div></div>' +
      '<a class="pn-link" href="/contact">Contact</a>' +
    '</nav>' +
    '<a class="pn-cta" href="' + TRIAL + '" target="_blank" rel="noopener">Start Now</a>' +
    '<button class="pn-burger" id="pnBurger" aria-label="Menu"><span></span><span></span><span></span></button>' +
  '</div>' +
  '<div class="pn-drawer" id="pnDrawer">' +
    '<details><summary>Classes</summary>' +
      '<a href="/classes">Core Program</a>' +
      '<a href="/youth-boxing-camp">Youth Boxing</a>' +
      '<a href="/senior-fitness-and-boxing-pittsburgh">Senior &amp; Parkinson\'s</a>' +
      '<div class="pn-menu-div"></div>' +
      '<a href="/trainers">Meet the Trainers</a></details>' +
    '<a href="/personal-training">Personal Training</a>' +
    '<a href="/schedule">Schedule</a>' +
    '<details><summary>Pricing &amp; Plans</summary>' +
      '<a href="/membership-options">Membership Options</a>' +
      '<a href="/free-trial">Free Trial Class</a>' +
      '<a href="/boxing-gloves-for-fitness-classes">Boxing Gloves</a>' +
      '<a href="/punch-apparel">Apparel</a></details>' +
    '<a href="/contact">Contact Us</a>' +
    '<a class="pn-dcta" href="' + TRIAL + '" target="_blank" rel="noopener">Start Now</a>' +
  '</div></header>';

  var year = new Date().getFullYear();
  var footer =
  '<footer class="pf"><div class="pf-grid">' +
    '<div><div class="pf-mark">PUNCH</div>' +
      '<div class="pf-tag" data-text="footer.tagline">Boxing &amp; Fitness &middot; South Hills Pittsburgh</div>' +
      '<p class="pf-addr"><span data-text="footer.address_line1">2101 Greentree Rd, Unit 119</span><br><span data-text="footer.address_line2">Pittsburgh, PA 15220</span></p>' +
      '<a class="pf-tel" data-text="footer.phone" href="tel:+14125123261">412-512-3261</a>' +
      '<a class="pf-mail" data-text="footer.email" href="mailto:punchpgh@gmail.com">punchpgh@gmail.com</a></div>' +
    '<div class="pf-col"><div class="pf-h">Workouts</div>' +
      '<a href="/classes">Group Fitness</a>' +
      '<a href="/senior-fitness-and-boxing-pittsburgh">Senior &amp; Parkinson\'s</a>' +
      '<a href="/youth-boxing-camp">Youth Boxing</a>' +
      '<a href="/personal-training">Personal Training</a>' +
      '<a href="/schedule">Schedule</a></div>' +
    '<div class="pf-col"><div class="pf-h">Get Started</div>' +
      '<a href="/free-trial">Free Trial Class</a>' +
      '<a href="/membership-options">Memberships</a>' +
      '<a href="/blog-events">Blog</a>' +
      '<a href="/about">About Us</a>' +
      '<a href="/contact">Contact Us</a>' +
      '<a href="/trainers">Trainers</a>' +
      '<a href="https://punchpgh.pushpress.com/refer" target="_blank" rel="noopener" onclick="return PunchRefer(event)">Refer a Friend</a>' +
      '<a href="/careers">Careers</a>' +
      '<a href="/terms-conditions">Terms &amp; Conditions</a></div>' +
    '<div class="pf-col"><div class="pf-h">Hours</div>' +
      '<p class="pf-hours"><span data-text="footer.hours1_days">Mon &ndash; Fri</span><b data-text="footer.hours1_time">6:00 AM &ndash; 8:00 PM</b></p>' +
      '<p class="pf-hours"><span data-text="footer.hours2_days">Sat &ndash; Sun</span><b data-text="footer.hours2_time">8:00 AM &ndash; 1:00 PM</b></p>' +
      '<a class="pf-mail" href="' + LOGIN + '" target="_blank" rel="noopener">Member Login &rarr;</a>' +
      '<div class="pf-soc"><a href="https://instagram.com/punchpgh" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="https://facebook.com/punchpgh" target="_blank" rel="noopener">Facebook</a>' +
      '<a href="https://www.youtube.com/@punchpgh" target="_blank" rel="noopener">YouTube</a>' +
      '<a href="https://www.tiktok.com/@punchpgh" target="_blank" rel="noopener">TikTok</a></div>' +
      '<div class="pf-h" style="margin-top:22px">Shop</div>' +
      '<a href="/punch-apparel">Apparel</a>' +
      '<a href="/boxing-gloves-for-fitness-classes">Equipment</a>' +
      '<a href="/superare">Superare</a></div>' +
  '</div>' +
  '<div class="pf-legal"><span>&copy; ' + year + ' <span data-text="footer.copyright_text">Pittsburgh Punch LLC. All rights reserved.</span></span>' +
  '<span><a href="/terms-conditions">Terms &amp; Conditions</a></span></div></footer>';


  // ---- Trial-offer popup -------------------------------------------------
  var FREE = "https://punchpgh.pushpress.com/landing/plans/plan_c63218daed254b";
  var PACK = "https://punchpgh.pushpress.com/landing/plans/plan_514ed15d56fc40";
  var POP_KEY = "punch_popup_seen_v2";
  var POP_DELAY = 4000;

  function renderPopup() {
    var ov = document.createElement("div");
    ov.className = "ps-ov";
    ov.innerHTML =
      '<div class="ps-box" role="dialog" aria-modal="true" aria-label="Choose how you want to start">' +
        '<button class="ps-x" id="psX" aria-label="Close">&times;</button>' +
        '<div class="ps-top">' +
          '<div class="ps-eyebrow">Ready to Try Punch?</div>' +
          '<div class="ps-h">Choose How You<br>Want to Start.</div>' +
          '<p class="ps-p">Two simple ways to experience Punch. Pick what works for you.</p>' +
        '</div>' +
        '<div class="ps-body"><div class="ps-cards">' +

          '<div class="ps-card">' +
            '<div class="ps-lbl">Quick First Experience</div>' +
            '<div class="ps-h2">One Free Class</div>' +
            '<ul class="ps-perks">' +
              '<li><span class="ps-tick">&#10003;</span> 1 free workout of your choice</li>' +
              '<li><span class="ps-tick">&#10003;</span> Cardio Boxing, Strength, or Circuit</li>' +
              '<li><span class="ps-tick">&#10003;</span> Meet your coaches &amp; the gym</li>' +
              '<li><span class="ps-tick">&#10003;</span> No credit card required</li>' +
            '</ul>' +
            '<a class="ps-btn" href="' + FREE + '" target="_blank" rel="noopener">Choose Free Class &rarr;</a>' +
            '<p class="ps-fine">No experience needed.</p>' +
          '</div>' +

          '<div class="ps-card feat">' +
            '<div class="ps-flag">&#9889; Best Value</div>' +
            '<div class="ps-lbl">Full Punch Experience</div>' +
            '<div class="ps-h2">One Week Unlimited</div>' +
            '<div class="ps-price"><sup>$</sup>19.99</div>' +
            '<ul class="ps-perks">' +
              '<li><span class="ps-tick">&#10003;</span> 1 week unlimited classes</li>' +
              '<li><span class="ps-tick">&#10003;</span> Try every class format</li>' +
              '<li><span class="ps-tick">&#10003;</span> No long-term commitment</li>' +
              '<li><span class="ps-tick">&#10003;</span> One-time payment, no auto-renew</li>' +
            '</ul>' +
            '<a class="ps-btn" href="' + PACK + '" target="_blank" rel="noopener">Start 7 Days &mdash; $19.99 &rarr;</a>' +
            '<p class="ps-fine">Unlimited classes for 7 days.</p>' +
          '</div>' +

        '</div></div>' +
      '</div>';
    document.body.appendChild(ov);

    function close() {
      ov.classList.remove("on");
      try { localStorage.setItem(POP_KEY, "1"); } catch (e) {}
      setTimeout(function () { ov.remove(); }, 300);
    }
    document.getElementById("psX").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    ov.querySelectorAll(".ps-btn").forEach(function (b) {
      b.addEventListener("click", function () { try { localStorage.setItem(POP_KEY, "1"); } catch (e) {} });
    });

    return ov;
  }

  // Auto-show once per session, after a delay, on general browsing pages.
  // Skipped on admin and on pages with an active form/checkout in progress
  // (see the "protect an active conversion" rule — never interrupt someone
  // who has already chosen and is entering information).
  function buildPopup() {
    try { if (localStorage.getItem(POP_KEY)) return false; } catch (e) {}
    // Skip auto-fire on admin, the unrelated 24-hour-special page, and the
    // three dedicated trial pages — someone already on their chosen page's
    // registration flow shouldn't be immediately asked to reselect. The
    // popup itself stays available on all of these via window.PunchOpenTrialPopup.
    if (/\/admin|\/24-hour-special|\/trial\b|\/free-trial\b|\/punch-ad-trials\b/.test(location.pathname)) return false;
    var ov = renderPopup();
    setTimeout(function () { ov.classList.add("on"); }, POP_DELAY);
    return true;
  }

  // Manual re-open, for every "START YOUR TRIAL" CTA. Always works, even if
  // the visitor already dismissed the auto-popup this session — closing it
  // once shouldn't block them from deliberately asking to see it again.
  window.PunchOpenTrialPopup = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    var existing = document.querySelector(".ps-ov");
    if (existing) { existing.classList.add("on"); return false; }
    var ov = renderPopup();
    requestAnimationFrame(function () { ov.classList.add("on"); });
    return false;
  };

  // ---- Custom image popup (admin-managed, /admin > Popups) -----------------
  function buildCustomPopup(p) {
    var key = "punch_popup_seen_" + p.id;
    try { if (localStorage.getItem(key)) return false; } catch (e) {}
    if (/\/admin/.test(location.pathname)) return false;
    if (!p.image_url) return false;

    var ov = document.createElement("div");
    ov.className = "ps-ov";
    var safeTitle = (p.title || "Special offer").replace(/"/g, "&quot;");
    ov.innerHTML =
      '<div class="ps-imgbox" role="dialog" aria-modal="true" aria-label="' + safeTitle + '">' +
        '<button class="ps-x" id="psxImg" aria-label="Close">&times;</button>' +
        (p.link_url ? ('<a href="' + p.link_url + '" target="_blank" rel="noopener">') : '') +
          '<img src="' + p.image_url + '" alt="' + safeTitle + '">' +
        (p.link_url ? '</a>' : '') +
      '</div>';
    document.body.appendChild(ov);

    function close() {
      ov.classList.remove("on");
      try { localStorage.setItem(key, "1"); } catch (e) {}
      setTimeout(function () { ov.remove(); }, 300);
    }
    document.getElementById("psxImg").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    var link = ov.querySelector("a");
    if (link) link.addEventListener("click", function () { try { localStorage.setItem(key, "1"); } catch (e) {} });

    setTimeout(function () { ov.classList.add("on"); }, POP_DELAY);
    return true;
  }

  // ---- Form / embed popup (admin-managed, /admin > Popups > Form/Embed) ----
  var FORM_POP_DELAY = 3000;

  function runScripts(root) {
    root.querySelectorAll("script").forEach(function (old) {
      var s = document.createElement("script");
      for (var i = 0; i < old.attributes.length; i++) {
        s.setAttribute(old.attributes[i].name, old.attributes[i].value);
      }
      s.text = old.textContent || "";
      old.parentNode.replaceChild(s, old);
    });
  }

  function buildFormPopup(p) {
    var key = "punch_popup_seen_" + p.id;
    try { if (localStorage.getItem(key)) return false; } catch (e) {}
    if (/\/admin/.test(location.pathname)) return false;
    if (!p.embed_html) return false;

    var isSelfManaged = /data-layout[^>]*POPUP/i.test(p.embed_html);

    if (isSelfManaged) {
      try { localStorage.setItem(key, "1"); } catch (e) {}

      var wrap = document.createElement("div");
      wrap.id = "psFormWrap-" + p.id;
      wrap.style.cssText =
        "position:fixed;inset:0;z-index:2000;display:flex;align-items:center;" +
        "justify-content:center;padding:20px;background:rgba(0,0,0,.72);" +
        "backdrop-filter:blur(3px)";

      var frame = document.createElement("div");
      frame.style.cssText = "position:relative;max-width:100%;max-height:100%";

      var host = document.createElement("div");
      host.id = "psFormHost-" + p.id;
      host.style.cssText =
        "width:min(94vw,640px);max-height:min(90vh,720px);" +
        "overflow:auto;border-radius:14px;background:#fff;" +
        "box-shadow:0 30px 90px rgba(0,0,0,.5)";

      var xbtn = document.createElement("button");
      xbtn.setAttribute("aria-label", "Close");
      xbtn.innerHTML = "&times;";
      xbtn.style.cssText =
        "position:absolute;top:-14px;right:-14px;width:34px;height:34px;" +
        "border-radius:50%;background:#111;color:#fff;border:2px solid #fff;" +
        "font-size:20px;line-height:30px;text-align:center;padding:0;" +
        "cursor:pointer;z-index:2001;box-shadow:0 4px 14px rgba(0,0,0,.35)";

      frame.appendChild(host);
      frame.appendChild(xbtn);
      wrap.appendChild(frame);
      document.body.appendChild(wrap);
      host.innerHTML = p.embed_html;
      runScripts(host);

      function removeWrap() { if (wrap.parentNode) wrap.remove(); }
      xbtn.addEventListener("click", removeWrap);
      wrap.addEventListener("click", function (e) { if (e.target === wrap) removeWrap(); });
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { removeWrap(); document.removeEventListener("keydown", esc); }
      });

      if (window.ResizeObserver) {
        var everSized = false;
        var ro = new ResizeObserver(function (entries) {
          var r = entries[0].contentRect;
          if (r.height > 40 && r.width > 40) { everSized = true; return; }
          if (everSized) { removeWrap(); ro.disconnect(); }
        });
        ro.observe(host);
      }

      return true;
    }

    setTimeout(function () {
      try { localStorage.setItem(key, "1"); } catch (e) {}

      var ov = document.createElement("div");
      ov.className = "ps-ov";
      var safeTitle = (p.title || "Get started").replace(/"/g, "&quot;");
      ov.innerHTML =
        '<div class="ps-box" role="dialog" aria-modal="true" aria-label="' + safeTitle + '">' +
          '<button class="ps-x" id="psxForm" aria-label="Close">&times;</button>' +
          '<div class="ps-body" id="psFormMount" style="padding:0;max-height:88vh"></div>' +
        '</div>';
      document.body.appendChild(ov);
      var mount = document.getElementById("psFormMount");
      mount.innerHTML = p.embed_html;
      runScripts(mount);

      function close() {
        ov.classList.remove("on");
        setTimeout(function () { ov.remove(); }, 300);
      }
      document.getElementById("psxForm").addEventListener("click", close);
      ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      setTimeout(function () { ov.classList.add("on"); }, 10);
    }, FORM_POP_DELAY);

    return true;
  }

  function initPopups() {
    var cfg = window.PUNCH_CONFIG || {};
    var isDesktop = window.matchMedia
      ? window.matchMedia("(min-width: 761px)").matches
      : (window.innerWidth || 0) >= 761;
    var onLanding = /^\/(index(\.html)?)?$/.test(location.pathname);

    if (buildPopup()) return;

    if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR-PROJECT") !== -1) return;

    fetch(cfg.SUPABASE_URL + "/rest/v1/popups?select=*&order=sort.asc",
      { headers: { apikey: cfg.SUPABASE_ANON_KEY, Authorization: "Bearer " + cfg.SUPABASE_ANON_KEY } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (rows) {
        if (!rows || !rows.length) return;
        function matches(p) {
          if (!p.active) return false;
          if (isDesktop && p.show_desktop === false) return false;
          if (!isDesktop && p.show_mobile === false) return false;
          if (p.pages === "landing" && !onLanding) return false;
          return true;
        }
        var forms = rows.filter(function (p) { return p.type === "form" && matches(p) && p.embed_html; });
        for (var i = 0; i < forms.length; i++) { if (buildFormPopup(forms[i])) return; }
        var customs = rows.filter(function (p) { return p.type === "custom" && matches(p) && p.image_url; });
        for (var j = 0; j < customs.length; j++) { if (buildCustomPopup(customs[j])) return; }
      })
      .catch(function () {});
  }

  function enhance() {
    if (!/\/admin|\/claim|\/trial\b|\/24-hour-special/.test(location.pathname)) {
      var bar = document.createElement("div");
      bar.className = "mcta";
      bar.innerHTML =
        '<a class="m-red" href="' + FREE + '" onclick="return PunchOpenTrialPopup(event)">Start Your Trial</a>';
      document.body.appendChild(bar);

      if (window.visualViewport) {
        var pinBar = function () {
          var vv = window.visualViewport;
          var hidden = window.innerHeight - vv.height - vv.offsetTop;
          bar.style.bottom = Math.max(0, Math.round(hidden)) + "px";
        };
        window.visualViewport.addEventListener("resize", pinBar);
        window.visualViewport.addEventListener("scroll", pinBar);
        pinBar();
      }
    }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    var scope = document.getElementById("plp");
    if (!scope) return;
    var sel = ".si > *, .prog-card, .trial-card, .diff-card, .review, .bpost, .freq-card, .journey-step, .class-photo-card, .stat, .shop-card";
    var els = Array.prototype.slice.call(scope.querySelectorAll(sel));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) return;
      el.classList.add("reveal");
      var sibIndex = 0, p = el.previousElementSibling;
      while (p) { if (p.classList && p.classList.contains("reveal")) sibIndex++; p = p.previousElementSibling; }
      el.style.transitionDelay = Math.min(sibIndex * 70, 280) + "ms";
      io.observe(el);
    });
  }

  function applySiteTextOverrides() {
    var CFG = window.PUNCH_CONFIG || {};
    if (!CFG.SUPABASE_URL || String(CFG.SUPABASE_URL).indexOf("YOUR-PROJECT") !== -1) return;
    import("https://esm.sh/@supabase/supabase-js@2").then(function (mod) {
      var sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      return sb.from("site_text").select("key,value");
    }).then(function (res) {
      var rows = (res && !res.error && res.data) ? res.data : [];
      if (!rows.length) return;
      rows.forEach(function (r) {
        if (!r || !r.key || r.value == null) return;
        var el = document.querySelector('[data-text="' + r.key + '"]');
        if (el) el.textContent = r.value;
      });
    }).catch(function () {});
  }

  function init() {
    if (document.getElementById("pnHeader")) return;
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);
    var b = document.getElementById("pnBurger"), d = document.getElementById("pnDrawer");
    if (b && d) b.addEventListener("click", function () { d.classList.toggle("open"); });
    initPopups();
    enhance();
    applySiteTextOverrides();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

  // PushPress / LeadConnector chat widget (loads once)
  if (!document.getElementById("lc-chat-widget")) {
    var cw = document.createElement("script");
    cw.id = "lc-chat-widget";
    cw.src = "https://widgets.leadconnectorhq.com/loader.js";
    cw.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    cw.setAttribute("data-widget-id", "6a69f17b1519ba6675839b9b");
    document.body.appendChild(cw);
  }

  // Refer-a-Friend popup (loads once). PunchRefer() opens it.
  if (!document.getElementById("punch-refer-wrap")) {
    var rw = document.createElement("div");
    rw.id = "punch-refer-wrap";
    rw.style.cssText = "position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);padding:20px";
    rw.innerHTML = '<div style="position:relative;width:100%;max-width:520px;background:#fff;border-radius:14px;overflow:hidden">' +
      '<button onclick="document.getElementById(\'punch-refer-wrap\').style.display=\'none\'" style="position:absolute;top:8px;right:10px;z-index:2;background:#111;color:#fff;border:0;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer">&times;</button>' +
      '<iframe src="https://api.grow.pushpress.com/widget/form/z1zyzYjLAj2Yt9nh2lyQ" style="width:100%;height:520px;border:none;display:block" title="WEBSITE - SECTION - Refer a Friend / Family Member v7.0"></iframe>' +
      '</div>';
    document.body.appendChild(rw);
    var rs = document.createElement("script");
    rs.src = "https://api.grow.pushpress.com/js/form_embed.js";
    document.body.appendChild(rs);
  }
  window.PunchRefer = function(e){ if(e) e.preventDefault(); document.getElementById("punch-refer-wrap").style.display="flex"; return false; };

  // Load custom logo + favicon set in the admin (Branding tab)
  (function loadBranding(){
    var cfg = window.PUNCH_CONFIG||{};
    if(!cfg.SUPABASE_URL || cfg.SUPABASE_URL.indexOf("YOUR-PROJECT")!==-1) return;
    fetch(cfg.SUPABASE_URL+"/rest/v1/site_settings?select=key,value&key=in.(logo_url,favicon_url)",
      { headers:{ apikey:cfg.SUPABASE_ANON_KEY, Authorization:"Bearer "+cfg.SUPABASE_ANON_KEY } })
      .then(function(r){ return r.json(); })
      .then(function(rows){
        (rows||[]).forEach(function(row){
          var v = row.value && row.value.url;
          if(!v) return;
          if(row.key==="logo_url"){ var img=document.getElementById("pnLogoImg"); if(img){ img.onerror=null; img.src=v; } }
          if(row.key==="favicon_url"){
            document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]').forEach(function(l){ l.href=v; });
          }
        });
      }).catch(function(){});
  })();
