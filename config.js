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
// thin three-image strip is hidden and the class cards stack.
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
      if (i === 0) {
        clone.src = "/assets/punch-fitness-personal-training-4-vanessa-anthony-3.jpg";
        clone.removeAttribute("srcset");
        clone.style.objectPosition = "center center";
      }
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
        #plp .training-top-lead{display:block;max-width:680px;margin-bottom:26px}
        #plp .training-top-slots{display:none !important}
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

// Homepage-only approved top strip images and funnel section order.
(function () {
  var path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path !== "/" && path !== "/index.html") return;

  function topLevelByText(plp, phrase) {
    phrase = phrase.toLowerCase();
    return Array.prototype.find.call(plp.children, function (el) {
      return (el.textContent || "").toLowerCase().indexOf(phrase) !== -1;
    }) || null;
  }

  function moveAfter(node, afterNode) {
    if (!node || !afterNode || node === afterNode) return afterNode;
    afterNode.parentNode.insertBefore(node, afterNode.nextSibling);
    return node;
  }

  function makeTrialSteps() {
    var section = document.createElement("section");
    section.id = "home-trial-steps";
    section.className = "s home-trial-steps";
    section.innerHTML = '<div class="si home-trial-steps-inner">' +
      '<span class="lbl">Your First Punch Visit</span>' +
      '<h2 class="h2">THREE SIMPLE STEPS.<br><span>THEN JUST SHOW UP.</span></h2>' +
      '<div class="home-step-grid">' +
        '<div class="home-step-card"><span class="home-step-num">01</span><h3>Choose Your Trial</h3><p>Pick one free class or One Week Unlimited for $19.99. Fill out the form below and we’ll help you choose the right class to start.</p></div>' +
        '<div class="home-step-card"><span class="home-step-num">02</span><h3>Arrive 10 Minutes Early</h3><p>Your coach gives you a quick private intro before class — stance, basic punches, and how to use the heavy bag.</p></div>' +
        '<div class="home-step-card"><span class="home-step-num">03</span><h3>Learn. Punch. Feel Amazing.</h3><p>No boxing experience needed. Learn the punches, get a full-body workout, and walk out feeling like you actually did something.</p></div>' +
      '</div>' +
    '</div>';
    return section;
  }

  function makeLeadForm() {
    var section = document.createElement("section");
    section.id = "home-lead-form";
    section.className = "s off home-lead-form";
    section.innerHTML = '<div class="si" style="text-align:center;max-width:640px">' +
      '<span class="lbl">Get Started</span>' +
      '<h2 class="h2">READY TO TRY BOXING <span>FOR FITNESS?</span></h2>' +
      '<p class="sub" style="margin:0 auto 6px">Drop your info and a coach will reach out to get you booked for your first class.</p>' +
      '</div>' +
      '<div class="si" style="max-width:600px">' +
      '<iframe src="https://api.grow.pushpress.com/widget/form/ImN6zXT4qKiHOZHPOvXz" style="width:100%;min-height:640px;border:none;border-radius:8px;display:block" id="inline-home-ImN6zXT4qKiHOZHPOvXz" data-layout="{\'id\':\'INLINE\'}" data-trigger-type="alwaysShow" data-activation-type="alwaysActivated" data-deactivation-type="neverDeactivate" data-form-name="WEBSITE - AD LEAD FORM - Connect to Prospect and Trial Workflow - High-Touch Lead Capture v1.0" data-form-id="ImN6zXT4qKiHOZHPOvXz" title="Punch Boxing & Fitness Trial Lead Form"></iframe>' +
      '</div>';
    return section;
  }

  function installHomepageFunnelStyles() {
    if (document.getElementById("home-funnel-styles")) return;
    var style = document.createElement("style");
    style.id = "home-funnel-styles";
    style.textContent = `
      #plp .home-trial-steps{background:#17171a !important;padding-top:78px !important;padding-bottom:78px !important;color:#fff}
      #plp .home-trial-steps .lbl{color:#ff5b55 !important}
      #plp .home-trial-steps .lbl::before{background:#ff5b55 !important}
      #plp .home-trial-steps .h2{color:#fff !important;max-width:900px;margin-bottom:32px}
      #plp .home-trial-steps .h2 span{color:#D92B2B}
      #plp .home-trial-steps-inner{max-width:1240px}
      #plp .home-step-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
      #plp .home-step-card{position:relative;background:#232327;border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:30px 28px 28px;min-height:250px;overflow:hidden}
      #plp .home-step-num{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:58px;line-height:.85;color:#D92B2B;margin-bottom:28px}
      #plp .home-step-card h3{font-family:'Barlow Condensed',sans-serif;font-size:30px;line-height:1;text-transform:uppercase;margin:0 0 12px;color:#fff}
      #plp .home-step-card p{font-size:15px;line-height:1.65;color:#c9c7c2;margin:0}
      #plp .home-lead-form{background:#f4f0e8 !important;padding-top:78px !important;padding-bottom:62px !important}
      #plp .home-lead-form .h2{color:#111 !important}
      #plp .home-lead-form .sub{color:#666 !important}
      @media(max-width:800px){#plp .home-step-grid{grid-template-columns:1fr}#plp .home-step-card{min-height:0}#plp .home-trial-steps,#plp .home-lead-form{padding-top:58px !important;padding-bottom:58px !important}}
    `;
    document.head.appendChild(style);
  }

  function arrangeHomepage() {
    var plp = document.getElementById("plp");
    if (!plp) return;

    installHomepageFunnelStyles();

    var trainingSection = plp.querySelector('[data-section="fight-train-sweat"]');
    var heroStmt = plp.querySelector('[data-section="hero-stmt"]');

    if (trainingSection && heroStmt) {
      moveAfter(trainingSection, heroStmt);
    }

    var slots = plp.querySelector(".training-top-slots");
    if (slots) {
      var imgs = slots.querySelectorAll("img");
      if (imgs.length >= 3) {
        imgs[0].src = "/assets/punch-pittsburgh-22.jpg";
        imgs[0].alt = "Cardio Boxing";
        imgs[0].removeAttribute("srcset");
        imgs[0].style.objectPosition = "center center";

        imgs[1].src = "/assets/punch-pittsburgh-2.jpg";
        imgs[1].alt = "Strength Training";
        imgs[1].removeAttribute("srcset");
        imgs[1].style.objectPosition = "center center";

        imgs[2].src = "/assets/punch-pittsburgh-53.jpg";
        imgs[2].alt = "Circuit and Conditioning Training";
        imgs[2].removeAttribute("srcset");
        imgs[2].style.objectPosition = "center center";
      }
    }

    var oldSteps = document.getElementById("home-trial-steps");
    if (oldSteps) oldSteps.remove();
    var oldLead = document.getElementById("home-lead-form");
    if (oldLead) oldLead.remove();

    var anchor = trainingSection || heroStmt;
    if (!anchor) return;

    var steps = makeTrialSteps();
    var lead = makeLeadForm();
    anchor.parentNode.insertBefore(steps, anchor.nextSibling);
    steps.parentNode.insertBefore(lead, steps.nextSibling);

    var formScript = document.querySelector('script[src="https://api.grow.pushpress.com/js/form_embed.js"]');
    if (!formScript) {
      formScript = document.createElement("script");
      formScript.src = "https://api.grow.pushpress.com/js/form_embed.js";
      formScript.async = true;
      document.body.appendChild(formScript);
    }

    var cursor = lead;
    [
      "hear it from them",
      "what people are saying after their first week",
      "a workout you'll actually look forward to",
      "what makes us different",
      "more ways to train"
    ].forEach(function (phrase) {
      var section = topLevelByText(plp, phrase);
      if (section && section !== cursor) cursor = moveAfter(section, cursor);
    });

    var schedule = topLevelByText(plp, "schedule");
    var finalStep = topLevelByText(plp, "your first step");
    if (schedule) cursor = moveAfter(schedule, cursor);
    if (finalStep) moveAfter(finalStep, cursor);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrangeHomepage, { once:true });
  } else {
    arrangeHomepage();
  }
})();