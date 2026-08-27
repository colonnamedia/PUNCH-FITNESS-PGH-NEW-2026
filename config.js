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
// Workout photo-card treatment
// Homepage + punch-ad-trials + free-trial + schedule only.
// Makes the entire workout block the photo, with the copy overlaid at the
// bottom, matching the approved full-image Three Ways to Train design.
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
    "/punch-ad-trials.html": true
  };

  var path = window.location.pathname.replace(/\/$/, "") || "/";
  if (!allowed[path]) return;

  function applyWorkoutPhotoCards() {
    var grids = document.querySelectorAll("#plp .workout-grid");
    if (!grids.length) return;

    grids.forEach(function (grid) {
      var section = grid.closest(".s");
      if (section) {
        section.classList.remove("dark");
        section.classList.add("workout-photo-section");
      }

      grid.querySelectorAll(".workout-card").forEach(function (card) {
        card.classList.remove("dark");
        card.classList.add("workout-photo-card");
      });
    });

    if (document.getElementById("punch-workout-photo-cards")) return;

    var style = document.createElement("style");
    style.id = "punch-workout-photo-cards";
    style.textContent = `
      #plp .workout-photo-section{
        background:#fff !important;
      }
      #plp .workout-photo-section .h2{
        color:#111 !important;
      }
      #plp .workout-photo-section .sub{
        color:#666 !important;
      }
      #plp .workout-photo-section .lbl{
        color:#D92B2B !important;
      }
      #plp .workout-photo-section .lbl::before{
        background:#D92B2B !important;
      }
      #plp .workout-photo-section .workout-grid{
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:4px;
        max-width:100%;
        margin-top:48px;
      }
      #plp .workout-photo-card{
        position:relative;
        min-height:clamp(390px,31vw,520px);
        background:#111 !important;
        border:0 !important;
        border-radius:16px !important;
        overflow:hidden;
        box-shadow:0 10px 28px rgba(0,0,0,.12) !important;
      }
      #plp .workout-photo-card::after{
        content:"";
        position:absolute;
        inset:0;
        z-index:1;
        pointer-events:none;
        background:linear-gradient(to top,rgba(0,0,0,.94) 0%,rgba(0,0,0,.74) 28%,rgba(0,0,0,.24) 58%,rgba(0,0,0,.04) 78%,transparent 100%);
      }
      #plp .workout-photo-card .workout-img{
        position:absolute;
        inset:0;
        width:100%;
        height:100% !important;
        overflow:hidden;
      }
      #plp .workout-photo-card .workout-img img{
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center center;
        display:block;
        transform:none;
        transition:transform .55s ease;
      }
      #plp .workout-photo-card:hover .workout-img img{
        transform:scale(1.025);
      }
      #plp .workout-photo-card .workout-num{
        z-index:3;
        top:16px;
        left:16px;
      }
      #plp .workout-photo-card .workout-body{
        position:absolute;
        left:0;
        right:0;
        bottom:0;
        z-index:2;
        padding:30px 28px 26px;
        background:transparent !important;
      }
      #plp .workout-photo-card .workout-tag{
        color:#ff4b46 !important;
        margin-bottom:8px;
      }
      #plp .workout-photo-card .workout-name{
        color:#fff !important;
        font-size:clamp(28px,2.4vw,38px);
        text-shadow:0 2px 14px rgba(0,0,0,.45);
      }
      #plp .workout-photo-card .workout-desc{
        color:rgba(255,255,255,.82) !important;
        max-width:95%;
        text-shadow:0 1px 8px rgba(0,0,0,.5);
      }
      #plp .workout-photo-card .workout-stat{
        color:#fff !important;
        border-top:1px solid rgba(255,255,255,.18) !important;
      }
      #plp .workout-photo-card .workout-stat span{
        color:#ff4b46 !important;
        font-weight:800;
      }
      #plp .workout-photo-card .workout-stat b{
        color:rgba(255,255,255,.58) !important;
      }
      @media(max-width:960px){
        #plp .workout-photo-section .workout-grid{
          grid-template-columns:1fr;
          gap:18px;
          max-width:680px;
        }
        #plp .workout-photo-card{
          min-height:440px;
        }
      }
      @media(max-width:600px){
        #plp .workout-photo-card{
          min-height:390px;
          border-radius:14px !important;
        }
        #plp .workout-photo-card .workout-body{
          padding:24px 20px 22px;
        }
        #plp .workout-photo-card .workout-desc{
          font-size:13px;
          line-height:1.5;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyWorkoutPhotoCards, { once:true });
  } else {
    applyWorkoutPhotoCards();
  }
})();
