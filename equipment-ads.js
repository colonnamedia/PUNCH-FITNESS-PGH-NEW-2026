/* AdSense placements for the Punch equipment page only. */
(function(){
  if (!/^\/boxing-gloves-for-fitness-classes\/?$/.test(location.pathname)) return;

  function makeAd(position){
    var wrap = document.createElement('div');
    wrap.className = 'punch-equipment-ad punch-equipment-ad--' + position;
    wrap.setAttribute('aria-label', 'Advertisement');
    wrap.innerHTML = '<div class="punch-equipment-ad__inner"><span class="punch-equipment-ad__label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7896086232880622" data-ad-slot="8750687120" data-ad-format="auto" data-full-width-responsive="true"></ins></div>';
    return wrap;
  }

  function pushAd(ad){
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch(e) {}
  }

  function install(){
    if (document.getElementById('punch-equipment-ad-styles')) return;
    var plp = document.getElementById('plp');
    if (!plp) return;

    var style = document.createElement('style');
    style.id = 'punch-equipment-ad-styles';
    style.textContent = '.punch-equipment-ad{background:#f7f7f7;padding:22px 20px;border-top:1px solid #eee;border-bottom:1px solid #eee}.punch-equipment-ad__inner{max-width:1100px;margin:0 auto;min-height:90px}.punch-equipment-ad__label{display:block;text-align:center;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#999;margin-bottom:8px}@media(max-width:640px){.punch-equipment-ad{padding:14px 10px}.punch-equipment-ad__inner{min-height:70px}}';
    document.head.appendChild(style);

    var top = makeAd('top');
    plp.insertBefore(top, plp.firstChild);
    pushAd(top);

    var final = plp.querySelector('.final');
    var bottom = makeAd('bottom');
    if (final) plp.insertBefore(bottom, final);
    else plp.appendChild(bottom);
    pushAd(bottom);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
