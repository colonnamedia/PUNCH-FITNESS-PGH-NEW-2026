/* Punch shared nav loader + final launch cleanup layer. */
(function () {
  if (window.__PUNCH_NAV_WRAPPER_LOADED__) return;
  window.__PUNCH_NAV_WRAPPER_LOADED__ = true;

  var TRIAL_CHOOSER = "https://punchpgh.pushpress.com/landing/plans?category=plcat_2j49r5iagc21ll";

  function launchCleanup() {
    // Generic trial CTAs should show BOTH current trial options. Offer-specific
    // buttons (Free Class / $19.99 / Unlimited) keep their direct plan links.
    document.querySelectorAll("a").forEach(function (a) {
      var label = (a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      var genericTrial = /^(start your trial|start your trial now|start trial|start trial now|start now)(\s*[→›»]|\s*)?$/.test(label);
      if (!genericTrial) return;
      a.href = TRIAL_CHOOSER;
      a.target = "_blank";
      a.rel = "noopener";
      a.removeAttribute("onclick");
    });

    // Homepage launch-copy cleanup.
    var note = document.querySelector('[data-text="hero.note"]');
    if (note && /no contact fitness/i.test(note.textContent || "")) {
      note.textContent = (note.textContent || "").replace(/no contact fitness/i, "No-contact boxing fitness");
    }

    // Keep the approved second testimonial reel caption locked to Jocelyn,
    // even if an older admin text value is still cached in site_text.
    var reel2 = document.querySelector('[data-text="reels.cap2"]');
    if (reel2) {
      reel2.textContent = "Jocelyn";
      reel2.removeAttribute("data-text");
    }
  }

  function applyResponsiveNavFix() {
    if (document.getElementById("punch-responsive-nav-fix")) return;
    var style = document.createElement("style");
    style.id = "punch-responsive-nav-fix";
    style.textContent = `
      /* Large desktop: balanced logo + full nav without oversized spacing. */
      @media (min-width:1500px){
        .pn-bar{max-width:1500px!important;height:90px!important;padding:0 30px!important;gap:22px!important}
        .pn-logo{min-width:205px!important;max-width:310px!important;flex:0 0 auto!important}
        .pn-logo img{height:40px!important;width:auto!important;max-width:310px!important;object-fit:contain!important}
        .pn-nav{gap:5px!important;min-width:0!important}
        .pn-link{font-size:19px!important;padding:12px 13px!important;white-space:nowrap!important}
        .pn-caret{font-size:10px!important;margin-left:5px!important}
        .pn-cta{font-size:14px!important;height:46px!important;min-height:46px!important;padding:0 20px!important;flex:0 0 auto!important}
      }

      /* iPad landscape / smaller desktops: actively compress the header so
         Contact + Start Now stay inside the viewport instead of getting cut off. */
      @media (min-width:1200px) and (max-width:1499px){
        .pn-bar{max-width:100%!important;height:82px!important;padding:0 18px!important;gap:12px!important}
        .pn-logo{min-width:0!important;max-width:270px!important;flex:0 1 270px!important}
        .pn-logo img{height:32px!important;width:auto!important;max-width:270px!important;object-fit:contain!important}
        .pn-nav{gap:0!important;min-width:0!important;flex:1 1 auto!important;justify-content:flex-end!important}
        .pn-link{font-size:16px!important;padding:10px 9px!important;letter-spacing:.035em!important;white-space:nowrap!important}
        .pn-caret{font-size:9px!important;margin-left:4px!important}
        .pn-cta{font-size:13px!important;height:44px!important;min-height:44px!important;padding:0 16px!important;flex:0 0 auto!important}
        .pn-menu{min-width:270px!important}
        .pn-menu a{font-size:16px!important;padding:12px 15px!important}
        .pn-menu .pn-sub-desc{font-size:12px!important}
      }

      /* If the viewport is too narrow to fit the full desktop menu cleanly,
         switch to the burger rather than clipping navigation off-screen. */
      @media (min-width:1001px) and (max-width:1199px){
        .pn-bar{height:76px!important;padding:0 22px!important}
        .pn-logo img{height:32px!important;max-width:260px!important}
        .pn-nav,.pn-phone,.pn-cta{display:none!important}
        .pn-burger{display:flex!important}
      }
    `;
    document.head.appendChild(style);
  }

  function stabilizeLaunchCleanup() {
    applyResponsiveNavFix();
    launchCleanup();
    var passes = 0;
    var timer = setInterval(function () {
      launchCleanup();
      passes += 1;
      if (passes >= 10) clearInterval(timer);
    }, 500);
  }

  var s = document.createElement("script");
  s.src = "/nav-core.js";
  s.async = false;
  s.onload = stabilizeLaunchCleanup;
  document.head.appendChild(s);
})();
