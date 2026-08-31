/* Punch shared nav loader + final launch cleanup layer. */
(function () {
  if (window.__PUNCH_NAV_WRAPPER_LOADED__) return;
  window.__PUNCH_NAV_WRAPPER_LOADED__ = true;

  var TRIAL_CHOOSER = "https://punchpgh.pushpress.com/landing/plans?category=plcat_2j49r5iagc21ll";

  /* Meta Pixel — sitewide PageView tracking. */
  function installMetaPixel(){
    if (window.__PUNCH_META_PIXEL_LOADED__) return;
    window.__PUNCH_META_PIXEL_LOADED__ = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','1820239708169299');
    fbq('track','PageView');
  }
  installMetaPixel();

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

  function applyMobileTrialPopupFix(){
    if (document.getElementById("punch-mobile-trial-popup-fix")) return;
    var style = document.createElement("style");
    style.id = "punch-mobile-trial-popup-fix";
    style.textContent = `
      /* Mobile trial chooser: show BOTH offers without requiring an inner scroll. */
      @media (max-width:640px){
        .ps-ov{align-items:center!important;padding:10px!important;overflow:hidden!important}
        .ps-box{width:100%!important;max-width:430px!important;max-height:calc(100dvh - 20px)!important;border-radius:16px!important;display:block!important;overflow:hidden!important;transform:translateY(18px)!important}
        .ps-ov.on .ps-box{transform:translateY(0)!important}
        .ps-box::before{display:none!important}
        .ps-x{top:8px!important;right:9px!important;width:32px!important;height:32px!important;background:rgba(0,0,0,.38)!important}
        .ps-top{padding:15px 46px 12px 16px!important}
        .ps-eyebrow{font-size:8px!important;letter-spacing:2.5px!important;margin-bottom:4px!important}
        .ps-h{font-size:22px!important;line-height:.98!important;margin:0!important}
        .ps-top .ps-p{display:none!important}
        .ps-body{padding:10px 12px 12px!important;max-height:none!important;overflow:visible!important}
        .ps-cards{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}
        .ps-card{padding:10px 12px 11px!important;border-radius:11px!important;min-height:0!important}
        .ps-card.feat{padding-top:28px!important}
        .ps-flag{font-size:8px!important;letter-spacing:1.8px!important;padding:5px 0!important;border-radius:10px 10px 0 0!important}
        .ps-card.feat .ps-lbl{margin-top:0!important}
        .ps-lbl{font-size:8px!important;letter-spacing:1.8px!important;margin-bottom:2px!important}
        .ps-h2{font-size:20px!important;line-height:1!important;margin:0 0 5px!important}
        .ps-price{font-size:31px!important;line-height:1!important;margin:0 0 4px!important}
        .ps-perks{margin:0 0 7px!important;padding:0!important}
        .ps-perks li{display:none!important}
        .ps-perks li:first-child{display:flex!important;font-size:11px!important;line-height:1.25!important;padding:2px 0!important;border:0!important;gap:6px!important}
        .ps-tick{width:16px!important;height:16px!important;font-size:8px!important;margin-top:0!important}
        .ps-btn{padding:10px 8px!important;border-radius:8px!important;font-size:10px!important;letter-spacing:1.2px!important;line-height:1.05!important}
        .ps-fine{display:none!important}
      }

      /* Extra-short phones get an even tighter header/card treatment. */
      @media (max-width:640px) and (max-height:680px){
        .ps-top{padding-top:11px!important;padding-bottom:9px!important}
        .ps-h{font-size:19px!important}
        .ps-body{padding-top:7px!important;padding-bottom:8px!important}
        .ps-card{padding-top:8px!important;padding-bottom:8px!important}
        .ps-card.feat{padding-top:25px!important}
        .ps-h2{font-size:18px!important}
        .ps-price{font-size:27px!important}
        .ps-perks{margin-bottom:5px!important}
        .ps-btn{padding:8px 7px!important;font-size:9px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function loadPageEnhancements(){
    if (/^\/classes\/?$/.test(location.pathname) && !document.querySelector('script[data-punch-classes-experiences]')) {
      var extra = document.createElement('script');
      extra.src = '/classes-experiences.js';
      extra.defer = true;
      extra.setAttribute('data-punch-classes-experiences','1');
      document.head.appendChild(extra);
    }
  }

  function stabilizeLaunchCleanup() {
    applyResponsiveNavFix();
    applyMobileTrialPopupFix();
    loadPageEnhancements();
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
