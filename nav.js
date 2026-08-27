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

  function stabilizeLaunchCleanup() {
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
