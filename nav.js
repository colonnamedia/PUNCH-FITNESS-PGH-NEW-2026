/* ============================================================================
   Punch — shared header + footer.
   Include ONE line on any page:  <script src="/nav.js" defer></script>
   Styles live in punch.css. All booking links are PushPress (no MindBody).
   ========================================================================== */
(function () {
  var TRIAL = "https://punchpgh.pushpress.com/landing/plans?category=plcat_2j49r5iagc21ll";
  var LOGIN = "https://members.pushpress.com/";

  var header =
  '<header class="pn"><div class="pn-bar">' +
    '<a class="pn-logo" href="/" aria-label="Punch Boxing and Fitness home">' +
      '<img src="/assets/logo/punch-logo.png" alt="Punch Boxing &amp; Fitness" '+
      'onerror="this.onerror=null;this.src=\'https://images.squarespace-cdn.com/content/v1/6509de1678b4160657354615/d0e600c1-b98a-4d8e-becb-3d99ab28b51e/PUNCH+LOGO+1+NEW+2026+WEBSITE.png?format=300w\'">' +
      '<b>PUNCH</b><span>Boxing &amp; Fitness</span></a>' +
    '<nav class="pn-nav">' +
      '<div class="pn-item"><button class="pn-link">Workouts<span class="pn-caret">&#9660;</span></button>' +
        '<div class="pn-menu">' +
          '<a href="/classes">Group Fitness</a>' +
          '<a href="/senior-fitness-and-boxing-pittsburgh">Parkinson\'s &amp; Senior Fit</a>' +
          '<a href="/youth-boxing-camp">Youth Boxing</a>' +
          '<a href="/personal-training">Personal Training</a>' +
          '<a href="/schedule">Schedule</a></div></div>' +
      '<div class="pn-item"><button class="pn-link">Pricing &amp; Plans<span class="pn-caret">&#9660;</span></button>' +
        '<div class="pn-menu">' +
          '<a href="/membership-options">Membership Options</a>' +
          '<a href="/free-trial">Free Trial Class</a>' +
          '<a href="/boxing-gloves-for-fitness-classes">Boxing Gloves</a>' +
          '<a href="/punch-apparel">Apparel</a></div></div>' +
      '<a class="pn-link" href="/blog-events">Blog</a>' +
      '<a class="pn-link" href="/contact">Contact</a>' +
    '</nav>' +
    '<a class="pn-phone" href="tel:+14125123261">412-512-3261</a>' +
    '<a class="pn-cta" href="' + TRIAL + '" target="_blank" rel="noopener">Start Trial</a>' +
    '<button class="pn-burger" id="pnBurger" aria-label="Menu"><span></span><span></span><span></span></button>' +
  '</div>' +
  '<div class="pn-drawer" id="pnDrawer">' +
    '<details><summary>Workouts</summary>' +
      '<a href="/classes">Group Fitness</a>' +
      '<a href="/senior-fitness-and-boxing-pittsburgh">Parkinson\'s &amp; Senior Fit</a>' +
      '<a href="/youth-boxing-camp">Youth Boxing</a>' +
      '<a href="/personal-training">Personal Training</a>' +
      '<a href="/schedule">Schedule</a></details>' +
    '<details><summary>Pricing &amp; Plans</summary>' +
      '<a href="/membership-options">Membership Options</a>' +
      '<a href="/free-trial">Free Trial Class</a>' +
      '<a href="/boxing-gloves-for-fitness-classes">Boxing Gloves</a>' +
      '<a href="/punch-apparel">Apparel</a></details>' +
    '<a href="/blog-events">Blog</a><a href="/contact">Contact Us</a>' +
    '<a href="tel:+14125123261">412-512-3261</a>' +
    '<a class="pn-dcta" href="' + TRIAL + '" target="_blank" rel="noopener">Start Trial</a>' +
  '</div></header>';

  var year = new Date().getFullYear();
  var footer =
  '<footer class="pf"><div class="pf-grid">' +
    '<div><div class="pf-mark">PUNCH</div>' +
      '<div class="pf-tag">Boxing &amp; Fitness &middot; South Hills Pittsburgh</div>' +
      '<p class="pf-addr">2101 Greentree Rd, Suite 119<br>Pittsburgh, PA 15220</p>' +
      '<a class="pf-tel" href="tel:+14125123261">412-512-3261</a>' +
      '<a class="pf-mail" href="mailto:punchpgh@gmail.com">punchpgh@gmail.com</a></div>' +
    '<div class="pf-col"><div class="pf-h">Workouts</div>' +
      '<a href="/classes">Group Fitness</a>' +
      '<a href="/senior-fitness-and-boxing-pittsburgh">Senior &amp; Parkinson\'s</a>' +
      '<a href="/youth-boxing-camp">Youth Boxing</a>' +
      '<a href="/personal-training">Personal Training</a>' +
      '<a href="/schedule">Schedule</a></div>' +
    '<div class="pf-col"><div class="pf-h">Get Started</div>' +
      '<a href="/free-trial">Free Trial Class</a>' +
      '<a href="/membership-options">Memberships</a>' +
      '<a href="/punch-apparel">Apparel</a>' +
      '<a href="/blog-events">Blog</a>' +
      '<a href="/about">About Us</a>' +
      '<a href="/contact">Contact Us</a></div>' +
    '<div class="pf-col"><div class="pf-h">Hours</div>' +
      '<p class="pf-hours">Mon &ndash; Fri<b>6:00 AM &ndash; 8:00 PM</b></p>' +
      '<p class="pf-hours">Sat &ndash; Sun<b>8:00 AM &ndash; 1:00 PM</b></p>' +
      '<a class="pf-mail" href="' + LOGIN + '" target="_blank" rel="noopener">Member Login &rarr;</a>' +
      '<div class="pf-soc"><a href="https://instagram.com/punchpgh" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="https://facebook.com/punchpgh" target="_blank" rel="noopener">Facebook</a></div></div>' +
  '</div>' +
  '<div class="pf-legal"><span>&copy; ' + year + ' Pittsburgh Punch LLC. All rights reserved.</span>' +
  '<span><a href="/terms-conditions">Terms &amp; Conditions</a></span></div></footer>';


  // ---- SMS / free-intro popup (PushPress form) ---------------------------
  var LEAD_FORM = "ImN6zXT4qKiHOZHPOvXz";   // PushPress Free Intro form
  var POP_KEY = "punch_popup_seen_v1";
  var POP_DELAY = 12000;                     // ms before it appears

  function buildPopup() {
    try { if (localStorage.getItem(POP_KEY)) return; } catch (e) {}
    if (/\/admin/.test(location.pathname)) return;

    var ov = document.createElement("div");
    ov.className = "ps-ov";
    ov.innerHTML =
      '<div class="ps-box" role="dialog" aria-modal="true" aria-label="Claim your free class">' +
        '<button class="ps-x" id="psX" aria-label="Close">&times;</button>' +
        '<div class="ps-top">' +
          '<div class="ps-eyebrow">South Hills Pittsburgh</div>' +
          '<div class="ps-h">Your First Class<br>Is On Us.</div>' +
          '<p class="ps-p">Drop your info and we\'ll text you the details &mdash; class times, what to bring, and how to claim your free workout. No experience needed.</p>' +
        '</div>' +
        '<div class="ps-body">' +
          '<div class="pushpress-form" data-form-id="' + LEAD_FORM + '"></div>' +
          '<p class="ps-note">By submitting you agree to receive texts from Punch Boxing &amp; Fitness. Message and data rates may apply. Reply STOP to opt out.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    if (!document.querySelector('script[src*="form_embed.js"]')) {
      var fs = document.createElement("script");
      fs.src = "https://api.grow.pushpress.com/js/form_embed.js";
      fs.defer = true;
      document.head.appendChild(fs);
    }

    function close() {
      ov.classList.remove("on");
      try { localStorage.setItem(POP_KEY, "1"); } catch (e) {}
      setTimeout(function () { ov.remove(); }, 300);
    }
    document.getElementById("psX").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    setTimeout(function () { ov.classList.add("on"); }, POP_DELAY);
  }

  function init() {
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);
    var b = document.getElementById("pnBurger"), d = document.getElementById("pnDrawer");
    if (b && d) b.addEventListener("click", function () { d.classList.toggle("open"); });
    buildPopup();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
