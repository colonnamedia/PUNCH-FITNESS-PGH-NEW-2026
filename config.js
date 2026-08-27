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
// Primary desktop treatment = message/description on the left + three image
// slots on the right, then the three core class cards below. On mobile the
// whole system stacks. Schedule uses the secondary light-card treatment.
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

  function buildTopSlots(section, imageEls) {
    if (!section || section.querySelector(".training-top-lead")) return;
    var intro = section.querySelector(":scope > .si");
    if (!intro || !imageEls || imageEls.length < 3) return;

    var lead = document.createElement("div");
    lead.className = "training-top-lead";

    var slots = document.createElement("div");
    slots.className = "training-top-slots";

    Array.prototype.slice.call(imageEls, 0, 3).forEach(function (img, i) {
      var slot = document.createElement("div");
      slot.className = "training-top-slot slot-" + (i + 1);
      var clone = img.cloneNode(true);
      clone.removeAttribute("loading");
      clone.removeAttribute("data-slot");
      slot.appendChild(clone);
      slots.appendChild(slot);
    });

    section.insertBefore(lead, intro);
    lead.appendChild(intro);
    lead.appendChild(slots);
  }

  function rewriteWorkoutSection(section, variant, scheduleCopy) {
    if (!section) return;
    section.classList.remove("dark", "training-top", "training-middle", "training-bottom");
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
      var variant = isSchedule ? "bottom" : "top";

      rewriteWorkoutSection(
        section,
        variant,
        isSchedule ? "Choose the class format that fits your day. Cardio Boxing, Boxing + Strength, and Circuit Training are all part of the same Punch system." : null
      );

      var cards = grid.querySelectorAll(".workout-card");
      cards.forEach(function (card) {
        card.classList.remove("dark", "workout-photo-card", "workout-bottom-card");
        card.classList.add(isSchedule ? "workout-bottom-card" : "workout-photo-card");
      });

      if (!isSchedule) {
        var imgs = grid.querySelectorAll(".workout-img img");
        buildTopSlots(section, imgs);
      }
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

      var classImgs = document.querySelectorAll(".cls-style .cls-img img");
      buildTopSlots(intro, classImgs);
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

      .training-benefits{display:flex;gap:26px;flex-wrap:wrap;margin-top:28px}
      .training-benefits>div{display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:10px;align-items:center}
      .training-benefit-icon{grid-row:1/3;width:34px;height:34px;border:1.5px solid #D92B2B;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#D92B2B;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:12px}
      .training-benefits b{font-family:'Barlow Condensed',sans-serif;font-size:16px;text-transform:uppercase;color:#111;line-height:1}
      .training-benefits small{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.04em;margin-top:3px}

      /* PRIMARY TOP treatment — text left, three image slots right */
      #plp .training-top{padding-top:72px !important;padding-bottom:72px !important}
      #plp .training-top-lead{display:grid;grid-template-columns:minmax(420px,.95fr) minmax(560px,1.15fr);gap:42px;align-items:stretch;max-width:1380px;margin:0 auto 34px}
      #plp .training-top-lead>.si{max-width:none !important;margin:0 !important;text-align:left !important;display:flex;flex-direction:column;justify-content:center;padding:8px 0}
      #plp .training-top .h2,#plp .classes-training-system .h2{font-size:clamp(42px,4.8vw,70px);line-height:.92;margin-bottom:18px}
      #plp .training-top .sub,#plp .classes-training-system .sub{font-size:17px;line-height:1.6}
      #plp .training-top-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-height:360px;overflow:hidden}
      #plp .training-top-slot{position:relative;overflow:hidden;background:#111;min-width:0}
      #plp .training-top-slot:first-child{border-radius:16px 0 0 16px}
      #plp .training-top-slot:last-child{border-radius:0 16px 16px 0}
      #plp .training-top-slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transition:transform .5s ease}
      #plp .training-top-slot:hover img{transform:scale(1.03)}

      /* full-image cards below primary lead */
      #plp .training-top .workout-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;max-width:1380px;margin:0 auto}
      #plp .workout-photo-card{position:relative;min-height:clamp(360px,26vw,470px);background:#111 !important;border:0 !important;border-radius:14px !important;overflow:hidden;box-shadow:0 8px 22px rgba(0,0,0,.10) !important}
      #plp .workout-photo-card::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.94) 0%,rgba(0,0,0,.70) 30%,rgba(0,0,0,.18) 62%,transparent 84%)}
      #plp .workout-photo-card .workout-img{position:absolute;inset:0;width:100%;height:100% !important;overflow:hidden}
      #plp .workout-photo-card .workout-img img{width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transform:none;transition:transform .55s ease}
      #plp .workout-photo-card:hover .workout-img img{transform:scale(1.025)}
      #plp .workout-photo-card .workout-num{z-index:3;top:16px;left:16px}
      #plp .workout-photo-card .workout-body{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:26px 24px 22px;background:transparent !important}
      #plp .workout-photo-card .workout-tag{color:#ff4b46 !important;margin-bottom:7px}
      #plp .workout-photo-card .workout-name{color:#fff !important;font-size:clamp(27px,2.2vw,36px);text-shadow:0 2px 14px rgba(0,0,0,.45)}
      #plp .workout-photo-card .workout-desc{color:rgba(255,255,255,.84) !important;max-width:96%;text-shadow:0 1px 8px rgba(0,0,0,.5)}
      #plp .workout-photo-card .workout-stat{color:#fff !important;border-top:1px solid rgba(255,255,255,.18) !important}
      #plp .workout-photo-card .workout-stat span{color:#ff4b46 !important;font-weight:800}
      #plp .workout-photo-card .workout-stat b{color:rgba(255,255,255,.6) !important}

      /* SECONDARY BOTTOM treatment — schedule: light editorial cards */
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

      /* CLASSES page — primary top treatment, then detailed class breakdowns */
      #plp .classes-training-system{background:#fff;padding-top:72px;padding-bottom:72px}
      #plp .classes-training-system .training-top-lead{margin-bottom:0}
      #plp .classes-training-system .training-top-lead>.si{max-width:none !important;text-align:left !important}
      #plp .classes-training-system .sub{margin:0 !important;max-width:700px}
      #plp .cls-n{font-size:clamp(48px,6vw,82px)}

      @media(max-width:1100px){
        #plp .training-top-lead{grid-template-columns:1fr;gap:28px;max-width:760px}
        #plp .training-top-slots{min-height:300px}
        #plp .training-top .workout-grid,#plp .training-bottom .workout-grid{grid-template-columns:1fr;max-width:680px;gap:18px}
        #plp .workout-photo-card{min-height:440px}
        #plp .workout-bottom-card .workout-img{height:300px !important}
      }

      @media(max-width:700px){
        #plp .training-top{padding-top:56px !important;padding-bottom:56px !important}
        #plp .training-top-lead{gap:24px;margin-bottom:26px}
        #plp .training-top-slots{grid-template-columns:1fr;gap:12px;min-height:0;overflow:visible}
        #plp .training-top-slot{height:230px;border-radius:14px !important}
        .training-benefits{gap:16px;display:grid;grid-template-columns:1fr}
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
