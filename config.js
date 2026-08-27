// ============================================================================
// Supabase project config for Punch PGH.
// The publishable/anon key is public by design — it can only do what the Row
// Level Security policies allow (public reads products/posts; only signed-in
// admins can change them). Never put the service_role/secret key here.
// ============================================================================
window.PUNCH_CONFIG = {
  SUPABASE_URL: "https://uyzvmrbjlzafpwpamjwa.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_HPXuZiYMaOHhuXiZ6SONBg_hy6X3_ce",
  IMAGE_BUCKET: "product-images"
};

// ============================================================================
// Punch Training System presentation
// Keeps the three core programs consistent in message while intentionally
// varying the visual treatment by page: top / middle / bottom / detail.
// ============================================================================
(function () {
  var allowed = {
    "/": true,
    "/index.html": true,
    "/free-trial": true,
    "/free-trial.html": true,
    "/schedule": true,
    "/schedule.html": true,
    "/punch-ad-trials": true,
    "/punch-ad-trials.html": true,
    "/classes": true,
    "/classes.html": true
  };

  var path = window.location.pathname.replace(/\/$/, "") || "/";
  if (!allowed[path]) return;

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function setHTML(el, value) {
    if (el) el.innerHTML = value;
  }

  function addBenefits(section) {
    if (!section || section.querySelector(".training-benefits")) return;
    var intro = section.querySelector(".si");
    if (!intro) return;
    var benefits = document.createElement("div");
    benefits.className = "training-benefits";
    benefits.innerHTML = [
      '<div><span class="training-benefit-icon">01</span><b>Burn Calories</b><small>Build Endurance</small></div>',
      '<div><span class="training-benefit-icon">02</span><b>Build Strength</b><small>Increase Power</small></div>',
      '<div><span class="training-benefit-icon">03</span><b>Get Stronger</b><small>Feel Better</small></div>'
    ].join("");
    intro.appendChild(benefits);
  }

  function rewriteWorkoutSection(section, variant, scheduleCopy) {
    if (!section) return;
    section.classList.remove("dark");
    section.classList.add("workout-photo-section", "training-" + variant);

    var label = section.querySelector(".lbl");
    var headline = section.querySelector(".h2");
    var sub = section.querySelector(".sub");

    setText(label, "The Punch Training System");
    setHTML(headline, 'BOXING IS THE CARDIO.<br>STRENGTH COMPLETES IT.<br><span>THREE CLASS FORMATS.<br>ALL INCLUDED.</span>');
    setText(sub, scheduleCopy || "Your membership includes all three Punch class formats. Train your way, every day — no restrictions.");

    if (variant === "top") addBenefits(section);
  }

  function applyWorkoutCards() {
    var isSchedule = path === "/schedule" || path === "/schedule.html";
    var grids = document.querySelectorAll("#plp .workout-grid");
    if (!grids.length) return;

    grids.forEach(function (grid) {
      var section = grid.closest(".s");
      var variant = "middle";

      if (path === "/" || path === "/index.html") variant = "top";
      if (isSchedule) variant = "bottom";

      rewriteWorkoutSection(
        section,
        variant,
        isSchedule ? "Choose the class format that fits your day. Cardio Boxing, Boxing + Strength, and Circuit Training are all part of the same Punch system." : null
      );

      grid.querySelectorAll(".workout-card").forEach(function (card) {
        card.classList.remove("dark", "workout-photo-card", "workout-bottom-card");
        card.classList.add(isSchedule ? "workout-bottom-card" : "workout-photo-card");
      });
    });
  }

  function applyClassesPage() {
    if (path !== "/classes" && path !== "/classes.html") return;

    var heroEyebrow = document.querySelector('[data-text="hero.eyebrow"]');
    var heroTitle = document.querySelector('[data-text="hero.title"]');
    var heroSub = document.querySelector('[data-text="hero.sub"]');
    setText(heroEyebrow, "The Punch Training System");
    setHTML(heroTitle, 'BOXING IS THE CARDIO.<br><span class="ph-red">STRENGTH COMPLETES IT.</span><br><span class="ph-out">ALL INCLUDED.</span>');
    setText(heroSub, "Cardio Boxing · Boxing + Strength · Circuit Training · 45–55 minutes · All levels welcome");

    var intro = document.getElementById("punch-body");
    if (intro) {
      intro.classList.add("classes-training-system");
      setText(intro.querySelector('[data-text="intro.eyebrow"]'), "The Punch Training System");
      setHTML(intro.querySelector('[data-text="intro.headline"]'), 'BOXING IS THE CARDIO.<br>STRENGTH COMPLETES IT.<br><span>THREE CLASS FORMATS. ALL INCLUDED.</span>');
      setText(intro.querySelector('[data-text="intro.subtext"]'), "Your membership includes all three Punch class formats. Mix Cardio Boxing, Boxing + Strength, and Circuit Training throughout the week — no restrictions.");
      addBenefits(intro);
    }

    setText(document.querySelector('[data-text="fight.tag"]'), "Cardio / Conditioning · 45–55 min");
    setHTML(document.querySelector('[data-text="fight.name"]'), 'Cardio Boxing<span>.</span>');
    setText(document.querySelector('[data-text="fight.sub"]'), "Boxing Cardio · Technique + Conditioning");
    setText(document.querySelector('[data-text="fight.button1"]'), "Try Cardio Boxing Free →");

    setText(document.querySelector('[data-text="train.tag"]'), "Strength / Resistance · 45–55 min");
    setHTML(document.querySelector('[data-text="train.name"]'), 'Boxing + Strength<span>.</span>');
    setText(document.querySelector('[data-text="train.sub"]'), "Functional Strength · Power + Resistance");
    setText(document.querySelector('[data-text="train.button1"]'), "Try Boxing + Strength Free →");

    setText(document.querySelector('[data-text="sweat.tag"]'), "HIIT / Full Body · 45–55 min");
    setHTML(document.querySelector('[data-text="sweat.name"]'), 'Circuit Training<span>.</span>');
    setText(document.querySelector('[data-text="sweat.sub"]'), "HIIT · Full-Body Conditioning");
    setText(document.querySelector('[data-text="sweat.button1"]'), "Try Circuit Training Free →");
  }

  function installStyles() {
    if (document.getElementById("punch-training-system-styles")) return;
    var style = document.createElement("style");
    style.id = "punch-training-system-styles";
    style.textContent = `
      /* shared system header */
      #plp .workout-photo-section{background:#fff !important}
      #plp .workout-photo-section .h2{color:#111 !important;max-width:900px}
      #plp .workout-photo-section .sub{color:#666 !important;max-width:680px}
      #plp .workout-photo-section .lbl{color:#D92B2B !important}
      #plp .workout-photo-section .lbl::before{background:#D92B2B !important}

      .training-benefits{display:flex;gap:30px;flex-wrap:wrap;margin-top:30px}
      .training-benefits>div{display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:10px;align-items:center}
      .training-benefit-icon{grid-row:1/3;width:34px;height:34px;border:1.5px solid #D92B2B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#D92B2B;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:12px}
      .training-benefits b{font-family:'Barlow Condensed',sans-serif;font-size:16px;text-transform:uppercase;color:#111;line-height:1}
      .training-benefits small{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.04em;margin-top:3px}

      /* TOP treatment — homepage: strong left-led system statement + full-photo cards */
      #plp .training-top>.si{max-width:1180px;margin-left:auto;margin-right:auto;text-align:left !important}
      #plp .training-top .h2{font-size:clamp(42px,5.5vw,76px);line-height:.92}
      #plp .training-top .sub{font-size:17px}

      /* MIDDLE treatment — trial pages: centered intro + image-overlay program cards */
      #plp .training-middle>.si{text-align:center;max-width:860px}
      #plp .training-middle .sub{margin-left:auto;margin-right:auto}
      #plp .training-middle .workout-grid,#plp .training-top .workout-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;max-width:100%;margin-top:48px}
      #plp .workout-photo-card{position:relative;min-height:clamp(390px,31vw,520px);background:#111 !important;border:0 !important;border-radius:16px !important;overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,.12) !important}
      #plp .workout-photo-card::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.94) 0%,rgba(0,0,0,.74) 28%,rgba(0,0,0,.24) 58%,rgba(0,0,0,.04) 78%,transparent 100%)}
      #plp .workout-photo-card .workout-img{position:absolute;inset:0;width:100%;height:100% !important;overflow:hidden}
      #plp .workout-photo-card .workout-img img{width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transform:none;transition:transform .55s ease}
      #plp .workout-photo-card:hover .workout-img img{transform:scale(1.025)}
      #plp .workout-photo-card .workout-num{z-index:3;top:16px;left:16px}
      #plp .workout-photo-card .workout-body{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:30px 28px 26px;background:transparent !important}
      #plp .workout-photo-card .workout-tag{color:#ff4b46 !important;margin-bottom:8px}
      #plp .workout-photo-card .workout-name{color:#fff !important;font-size:clamp(28px,2.4vw,38px);text-shadow:0 2px 14px rgba(0,0,0,.45)}
      #plp .workout-photo-card .workout-desc{color:rgba(255,255,255,.82) !important;max-width:95%;text-shadow:0 1px 8px rgba(0,0,0,.5)}
      #plp .workout-photo-card .workout-stat{color:#fff !important;border-top:1px solid rgba(255,255,255,.18) !important}
      #plp .workout-photo-card .workout-stat span{color:#ff4b46 !important;font-weight:800}
      #plp .workout-photo-card .workout-stat b{color:rgba(255,255,255,.58) !important}

      /* BOTTOM treatment — schedule: lighter, editorial cards for quick scanning */
      #plp .training-bottom>.si{text-align:left;max-width:1180px}
      #plp .training-bottom .workout-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;max-width:1180px;margin-top:40px}
      #plp .workout-bottom-card{background:#fff !important;border:1px solid #ece7df !important;border-radius:14px !important;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.06) !important}
      #plp .workout-bottom-card .workout-img{height:280px !important}
      #plp .workout-bottom-card .workout-img img{width:100%;height:100%;object-fit:cover;object-position:center center}
      #plp .workout-bottom-card .workout-body{padding:22px 22px 24px;background:#fff !important}
      #plp .workout-bottom-card .workout-name{color:#111 !important}
      #plp .workout-bottom-card .workout-desc{color:#555 !important}
      #plp .workout-bottom-card .workout-stat{color:#111 !important;border-top-color:#ece7df !important}
      #plp .workout-bottom-card .workout-stat b{color:#777 !important}

      /* CLASSES page — the detailed version of the same system */
      #plp .classes-training-system{background:#fff;padding-top:84px;padding-bottom:72px}
      #plp .classes-training-system>.si{text-align:left !important;max-width:1180px !important}
      #plp .classes-training-system .h2{font-size:clamp(44px,5.8vw,78px);line-height:.92;max-width:930px}
      #plp .classes-training-system .sub{margin:0 !important;max-width:700px}
      #plp .cls-n{font-size:clamp(48px,6vw,82px)}

      @media(max-width:960px){
        #plp .training-middle .workout-grid,#plp .training-top .workout-grid,#plp .training-bottom .workout-grid{grid-template-columns:1fr;max-width:680px;gap:18px}
        #plp .workout-photo-card{min-height:440px}
        #plp .workout-bottom-card .workout-img{height:300px !important}
      }
      @media(max-width:600px){
        .training-benefits{gap:18px;display:grid;grid-template-columns:1fr}
        #plp .workout-photo-card{min-height:390px;border-radius:14px !important}
        #plp .workout-photo-card .workout-body{padding:24px 20px 22px}
        #plp .workout-photo-card .workout-desc{font-size:13px;line-height:1.5}
        #plp .workout-bottom-card .workout-img{height:240px !important}
      }
    `;
    document.head.appendChild(style);
  }

  function applyAll() {
    installStyles();
    applyWorkoutCards();
    applyClassesPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll, { once:true });
  } else {
    applyAll();
  }
})();
