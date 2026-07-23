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
    '<a class="pn-logo" href="/"><b>PUNCH</b><span>Boxing &amp; Fitness</span></a>' +
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

  function init() {
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);
    var b = document.getElementById("pnBurger"), d = document.getElementById("pnDrawer");
    if (b && d) b.addEventListener("click", function () { d.classList.toggle("open"); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
