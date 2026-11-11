/* Shared PUNCH tour and newsletter block. Edit this file to maintain the section sitewide. */
(function(){
"use strict";
var ID="punch-tour-newsletter", CSS_ID="punch-tour-newsletter-css";
var GROW_EMAIL_FORM_URL=""; // Pending: verified PushPress Grow email-only form embed URL
var SUCCESS="You’re on the list. Watch your inbox for your PUNCH welcome email.";
var css = [
"#punch-tour-newsletter{background:#f4f0ec;color:#191919;font-family:Arial,Helvetica,sans-serif;position:relative;z-index:1}#punch-tour-newsletter *{box-sizing:border-box}",
"#punch-tour-newsletter .ptn-shell{max-width:1160px;margin:auto;padding:48px 24px 34px}",
"#punch-tour-newsletter .ptn-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(210px,.75fr);align-items:center;gap:clamp(24px,5vw,60px)}",
"#punch-tour-newsletter .ptn-eyebrow{color:#c82329;font-size:12px;font-weight:900;letter-spacing:.2em;margin:0 0 12px;text-transform:uppercase}",
"#punch-tour-newsletter h2{font-size:clamp(32px,4vw,54px);font-weight:900;line-height:1.03;letter-spacing:-.04em;margin:0 0 19px;color:#171717}",
"#punch-tour-newsletter .ptn-description{font-size:clamp(15px,1.7vw,18px);line-height:1.65;color:#514b49;margin:0 0 24px}",
"#punch-tour-newsletter .ptn-buttons{display:flex;flex-wrap:wrap;gap:10px}",
"#punch-tour-newsletter .ptn-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none!important;border-radius:12px;padding:13px 17px;min-height:48px;font-weight:900;font-size:12px;line-height:1.3;text-align:center}",
"#punch-tour-newsletter .ptn-red{background:#d92b2b;color:#fff!important;border:2px solid #d92b2b}",
"#punch-tour-newsletter .ptn-white{background:#fff;color:#191919!important;border:2px solid #d2ceca}",
"#punch-tour-newsletter .ptn-outline{background:transparent;color:#191919!important;border:2px solid #aaa19c}",
"#punch-tour-newsletter .ptn-frame{width:min(100%,260px);justify-self:center;padding:9px;background:#111;border:3px solid #d92b2b;border-radius:20px;box-shadow:0 15px 35px #0003}",
"#punch-tour-newsletter .ptn-frame-title{color:#fff;font-size:11px;font-weight:900;letter-spacing:.12em;text-align:center;padding:5px 1px 10px}",
"#punch-tour-newsletter .ptn-video{aspect-ratio:9/16;background:#050505;position:relative;overflow:hidden;border-radius:11px}",
"#punch-tour-newsletter .ptn-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}",
"#punch-tour-newsletter .ptn-news{background:#fff;border:1px solid #e0d9d3;border-radius:17px;padding:24px;margin-top:33px;box-shadow:0 5px 18px #0001}",
"#punch-tour-newsletter .ptn-news-grid{display:grid;grid-template-columns:.85fr 1.35fr;align-items:center;gap:25px}",
"#punch-tour-newsletter .ptn-news h3{font-size:clamp(22px,2.4vw,30px);font-weight:900;line-height:1.07;margin:0 0 10px;color:#171717}",
"#punch-tour-newsletter .ptn-news p{font-size:14px;line-height:1.5;color:#555;margin:0}",
"#punch-tour-newsletter .ptn-form-fields{display:grid;grid-template-columns:1fr 1fr auto;gap:9px;align-items:end}",
"#punch-tour-newsletter label{display:block;font-size:12px;font-weight:800;margin-bottom:5px;color:#262626}",
"#punch-tour-newsletter input{width:100%;min-width:0;min-height:46px;border:1px solid #cbc5c0;border-radius:9px;padding:10px 12px;background:#f7f6f5;font:inherit}",
"#punch-tour-newsletter .ptn-submit{min-height:46px;background:#aaa3a0;color:#fff;border:0;border-radius:9px;padding:10px 15px;font-weight:900;font-size:12px;cursor:not-allowed}",
"#punch-tour-newsletter .ptn-consent{font-size:11px!important;margin-top:10px!important}",
"#punch-tour-newsletter .ptn-pending{font-size:12px!important;font-weight:700;color:#a02a2a!important;margin-top:8px!important}",
"#punch-tour-newsletter .ptn-grow{width:100%;min-height:310px;border:0;border-radius:9px;background:#fff}",
"@media(max-width:850px){#punch-tour-newsletter .ptn-grid{grid-template-columns:1fr 210px;gap:20px}#punch-tour-newsletter .ptn-news-grid{grid-template-columns:1fr;gap:14px}}",
"@media(max-width:650px){#punch-tour-newsletter .ptn-shell{padding:39px 18px 27px}#punch-tour-newsletter .ptn-grid{grid-template-columns:1fr}#punch-tour-newsletter .ptn-frame{width:min(100%,235px)}#punch-tour-newsletter .ptn-buttons{display:grid;grid-template-columns:1fr}#punch-tour-newsletter .ptn-btn{width:100%}#punch-tour-newsletter .ptn-form-fields{grid-template-columns:1fr}#punch-tour-newsletter .ptn-news{padding:21px 18px;margin-top:24px}}"
].join("");
function newsletter(){
  if(!GROW_EMAIL_FORM_URL) return '<div aria-label="PushPress Grow newsletter integration placeholder" class="ptn-placeholder">'+
    '<div class="ptn-form-fields"><div><label for="ptn-fn">First Name</label><input id="ptn-fn" type="text" autocomplete="given-name" placeholder="First name" disabled></div>'+
    '<div><label for="ptn-em">Email Address</label><input id="ptn-em" type="email" autocomplete="email" placeholder="Email address" disabled></div>'+
    '<button class="ptn-submit" type="button" disabled>JOIN THE EMAIL LIST</button></div>'+
    '<p class="ptn-consent">By subscribing, you agree to receive email updates from PUNCH Boxing &amp; Fitness. Unsubscribe anytime.</p>'+
    '<p class="ptn-pending" role="status">Newsletter signup coming soon. PushPress Grow form integration pending.</p></div>';
  if(!/^https:\/\/api\.grow\.pushpress\.com\/widget\/form\/[A-Za-z0-9_-]+$/.test(GROW_EMAIL_FORM_URL))
    return '<p class="ptn-pending">Newsletter integration needs verification.</p>';
  // The Grow form owns consent, the newsletter tag/workflow and submission success.
  return '<div><iframe class="ptn-grow" loading="lazy" src="'+GROW_EMAIL_FORM_URL+'" title="PUNCH email-only newsletter signup"></iframe>'+
    '<p class="ptn-consent">By subscribing, you agree to receive email updates from PUNCH Boxing &amp; Fitness. Unsubscribe anytime.</p></div>';
}
function init(){
  if(document.getElementById(ID)) return;
  if(!document.getElementById(CSS_ID)){var st=document.createElement("style");st.id=CSS_ID;st.textContent=css;document.head.appendChild(st);}
  var sec=document.createElement("section");sec.id=ID;sec.setAttribute("aria-labelledby","ptn-title");
  sec.innerHTML='<div class="ptn-shell"><div class="ptn-grid"><div>'+
    '<p class="ptn-eyebrow">A look inside PUNCH</p><h2 id="ptn-title">SEE PUNCH BEFORE YOUR FIRST CLASS</h2>'+
    '<p class="ptn-description">Take a quick tour of PUNCH Boxing &amp; Fitness with Coach Anthony. See the gym, punching bags, strength-training areas, and the welcoming space where our non-contact boxing and strength workouts happen.</p>'+
    '<div class="ptn-buttons"><a class="ptn-btn ptn-red" href="https://punchpgh.com/free-trial">CLAIM A FREE CLASS</a>'+
    '<a class="ptn-btn ptn-white" href="https://punchpgh.com/punch-ad-trials">TRY ONE WEEK UNLIMITED — $19.99</a>'+
    '<a class="ptn-btn ptn-outline" href="#punch-email-list">JOIN THE PUNCH EMAIL LIST</a></div></div>'+
    '<div class="ptn-frame"><div class="ptn-frame-title">TAKE A TOUR OF PUNCH</div>'+
    '<div class="ptn-video"><iframe loading="lazy" title="Tour of PUNCH Boxing & Fitness with Coach Anthony" src="https://www.youtube-nocookie.com/embed/g7Gp73YFn7g" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div></div>'+
    '<div class="ptn-news" id="punch-email-list"><div class="ptn-news-grid"><div><h3>STAY IN THE PUNCH LOOP</h3>'+
    '<p>Get PUNCH news, fitness tips, special offers, upcoming events, and new ways to keep moving.</p></div>'+
    newsletter()+'</div></div></div>';
  var footer=document.querySelector("footer.pf");
  if(footer) footer.parentNode.insertBefore(sec,footer);else document.body.appendChild(sec);
  if(!footer){
    var observer=new MutationObserver(function(){
      var f=document.querySelector("footer.pf");
      if(f){if(sec.nextElementSibling!==f)f.parentNode.insertBefore(sec,f);observer.disconnect();}
    });
    observer.observe(document.body,{childList:true});
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
