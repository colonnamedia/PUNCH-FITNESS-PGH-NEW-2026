/* Secondary Punch experiences shown beneath the three core class formats. */
(function(){
  function addExperiences(){
    if (!/^\/classes\/?$/.test(location.pathname) || document.getElementById('punch-extra-experiences')) return;
    var circuit = Array.from(document.querySelectorAll('.cls-style')).find(function(el){
      return /Circuit Training/i.test(el.textContent || '');
    });
    if (!circuit) return;

    var section = document.createElement('section');
    section.id = 'punch-extra-experiences';
    section.className = 's off punch-extra-experiences';
    section.innerHTML = `
      <div class="si" style="text-align:center;max-width:820px">
        <span class="lbl">More Ways to Train</span>
        <h2 class="h2">More Punch.<br><span>More Ways to Train.</span></h2>
        <p class="sub" style="margin:0 auto">Beyond our three core class formats, Punch offers special training experiences designed to give you even more ways to use the gym.</p>
      </div>
      <div class="si punch-extra-grid">
        <article class="punch-extra-card after-dark">
          <div class="punch-extra-media" role="img" aria-label="Punch After Dark image placeholder">
            <span class="punch-extra-placeholder">PHOTO COMING SOON</span>
          </div>
          <div class="punch-extra-body">
            <span class="lbl">Red Light Class</span>
            <h3>PUNCH <span>After Dark.</span></h3>
            <div class="punch-extra-kicker">Boxing After the Lights Go Down.</div>
            <p>A high-energy Punch class with the main lights off and the gym illuminated in red. The Punch training experience you know, with a completely different atmosphere.</p>
            <a class="btn-red punch-extra-cta" href="/schedule">View the Schedule &rarr;</a>
          </div>
        </article>
        <article class="punch-extra-card open-gym">
          <div class="punch-extra-media" role="img" aria-label="Open Gym image placeholder">
            <span class="punch-extra-placeholder">PHOTO COMING SOON</span>
          </div>
          <div class="punch-extra-body">
            <span class="lbl">Independent Training</span>
            <h3>OPEN <span>Gym.</span></h3>
            <div class="punch-extra-kicker">Your Workout. Your Time.</div>
            <p>Reserved Open Gym hours for independent training at Punch. Use the gym during designated Open Gym times and build your own workout around the equipment and space.</p>
            <span class="punch-coming-soon">COMING SOON</span>
          </div>
        </article>
      </div>`;

    circuit.insertAdjacentElement('afterend', section);

    var style = document.createElement('style');
    style.textContent = `
      .punch-extra-experiences{padding-top:82px!important;padding-bottom:88px!important}
      .punch-extra-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;margin-top:42px}
      .punch-extra-card{background:#111;border-radius:22px;overflow:hidden;box-shadow:0 18px 45px rgba(0,0,0,.12);display:flex;flex-direction:column;min-width:0}
      .punch-extra-media{height:330px;background:linear-gradient(135deg,#1b1b1b,#2a2a2a);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
      .punch-extra-card.after-dark .punch-extra-media{background:radial-gradient(circle at 50% 45%,#8b1518 0,#3a0c0e 38%,#100809 78%)}
      .punch-extra-card.open-gym .punch-extra-media{background:linear-gradient(135deg,#272727,#0d0d0d)}
      .punch-extra-placeholder{font-size:12px;letter-spacing:.22em;font-weight:900;color:rgba(255,255,255,.58);border:1px solid rgba(255,255,255,.25);padding:12px 16px;border-radius:999px}
      .punch-extra-body{padding:34px 38px 38px!important;color:#fff;display:flex;flex-direction:column;align-items:flex-start;flex:1;box-sizing:border-box;width:100%}
      .punch-extra-body .lbl{color:#e32b2f;margin:0 0 14px!important}
      .punch-extra-body h3{font-family:inherit;font-size:clamp(34px,3.4vw,52px);line-height:.98;letter-spacing:-.035em;text-transform:uppercase;margin:0 0 12px!important;color:#fff;max-width:100%}
      .punch-extra-body h3 span{color:#e32b2f}
      .punch-extra-kicker{text-transform:uppercase;font-weight:900;letter-spacing:.1em;font-size:13px;line-height:1.4;color:#fff;margin:0 0 14px!important}
      .punch-extra-body p{color:rgba(255,255,255,.72);font-size:16px;line-height:1.65;margin:0 0 28px!important;max-width:100%}
      .punch-extra-body .punch-extra-cta{margin-top:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-height:52px!important;padding:15px 25px!important;box-sizing:border-box!important;white-space:nowrap!important;line-height:1!important}
      .punch-coming-soon{margin-top:auto;display:inline-flex;align-items:center;min-height:42px;padding:11px 17px;border:1px solid rgba(255,255,255,.28);border-radius:7px;font-size:12px;letter-spacing:.18em;font-weight:900;color:#fff;box-sizing:border-box}
      @media(max-width:1000px){
        .punch-extra-body{padding:30px 30px 34px!important}
        .punch-extra-body h3{font-size:clamp(34px,4.2vw,46px)}
      }
      @media(max-width:760px){
        .punch-extra-experiences{padding-top:58px!important;padding-bottom:62px!important}
        .punch-extra-grid{grid-template-columns:1fr;gap:22px;margin-top:30px}
        .punch-extra-media{height:240px}
        .punch-extra-body{padding:28px 24px 30px!important}
        .punch-extra-body h3{font-size:clamp(36px,11vw,48px)}
        .punch-extra-body .punch-extra-cta{width:100%!important;min-height:52px!important}
      }
    `;
    document.head.appendChild(style);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addExperiences);
  else addExperiences();
  setTimeout(addExperiences, 800);
})();
