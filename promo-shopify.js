(() => {
  "use strict";
  if (document.getElementById("mf-shopify-promo")) return;

  const css = `
    #mf-shopify-promo{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(190px,.7fr);align-items:center;gap:18px;margin:18px auto 24px;padding:clamp(18px,3vw,30px);border:1px solid #e7b64b;border-radius:22px;background:radial-gradient(circle at 82% 15%,#ffe8a0 0,#f7b94c 18%,transparent 42%),linear-gradient(125deg,#0c6b69 0%,#087e91 45%,#163c64 100%);box-shadow:0 12px 30px #0005;color:#fff;text-align:left}
    #mf-shopify-promo:before,#mf-shopify-promo:after{content:"";position:absolute;z-index:-1;border-radius:50%;background:#ffffff18;animation:mf-promo-drift 9s ease-in-out infinite}
    #mf-shopify-promo:before{width:180px;height:180px;right:20%;top:-100px}
    #mf-shopify-promo:after{width:110px;height:110px;left:8%;bottom:-65px;animation-delay:-4s}
    #mf-shopify-promo .mf-promo-copy{position:relative;z-index:2}
    #mf-shopify-promo .mf-promo-kicker{display:inline-block;margin:0 0 8px;padding:5px 11px;border-radius:99px;background:#ffe08a;color:#172b45;font-size:.88rem;font-weight:900;letter-spacing:.04em;box-shadow:0 2px 8px #0005}
    #mf-shopify-promo h2{margin:0 0 8px;color:#ffe08a;font-size:clamp(1.55rem,4vw,2.45rem);line-height:1.12;text-shadow:0 3px 10px #002b3b}
    #mf-shopify-promo p{margin:0 0 15px;color:#f4fbff;font-weight:600}
    #mf-shopify-promo .mf-promo-cta{display:inline-flex;align-items:center;gap:9px;padding:11px 16px;border:2px solid #fff;border-radius:12px;background:#ffe08a;color:#182230;font-weight:900;text-decoration:none;box-shadow:0 5px 0 #9b6826;cursor:pointer}
    #mf-shopify-promo .mf-promo-cta[aria-disabled=true]{opacity:.96}
    #mf-shopify-promo .mf-promo-scene{position:relative;display:flex;align-items:center;justify-content:center;min-height:165px;gap:4px}
    #mf-shopify-promo .mf-promo-person{font-size:clamp(4.2rem,10vw,7rem);filter:drop-shadow(0 9px 5px #002b3b66);animation:mf-promo-bob 4.8s ease-in-out infinite;transform-origin:50% 80%}
    #mf-shopify-promo .mf-promo-person:nth-child(2){animation-delay:-2.4s}
    #mf-shopify-promo .mf-promo-float{position:absolute;font-size:clamp(1.5rem,3vw,2.3rem);filter:drop-shadow(0 5px 3px #002b3b55);animation:mf-promo-drift 6s ease-in-out infinite}
    #mf-shopify-promo .mf-promo-float.a{top:4%;left:14%}
    #mf-shopify-promo .mf-promo-float.b{top:7%;right:8%;animation-delay:-2s}
    #mf-shopify-promo .mf-promo-float.c{bottom:2%;left:42%;animation-delay:-3.5s}
    #mf-shopify-promo .mf-promo-note{display:block;margin-top:9px;color:#e4f7ff;font-size:.78rem}
    .mf-shopify-float{position:fixed;z-index:850;left:14px;bottom:16px;display:flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid #ffe08a;border-radius:999px;background:linear-gradient(135deg,#087e91,#163c64);color:#fff;font:700 14px/1.2 Arial,sans-serif;box-shadow:0 5px 18px #0008;cursor:pointer;text-decoration:none}
    .mf-shopify-float .mf-float-icons{font-size:1.3rem;letter-spacing:2px}
    .mf-shopify-float .mf-float-icons span{display:inline-block;animation:mf-promo-bob 4.5s ease-in-out infinite}
    .mf-shopify-float .mf-float-icons span:nth-child(2){animation-delay:-1.5s}
    .mf-shopify-float .mf-float-icons span:nth-child(3){animation-delay:-3s}
    @keyframes mf-promo-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(3deg)}}
    @keyframes mf-promo-drift{0%,100%{transform:translate3d(0,0,0) rotate(-5deg)}50%{transform:translate3d(7px,-12px,0) rotate(7deg)}}
    @media(max-width:650px){#mf-shopify-promo{grid-template-columns:1fr;gap:6px;text-align:center;padding:18px 15px}#mf-shopify-promo .mf-promo-scene{min-height:118px;grid-row:1}#mf-shopify-promo .mf-promo-person{font-size:5rem}#mf-shopify-promo .mf-promo-note{font-size:.74rem}.mf-shopify-float{left:8px;bottom:10px;padding:7px 10px;font-size:12px}}
    @media(prefers-reduced-motion:reduce){#mf-shopify-promo:before,#mf-shopify-promo:after,#mf-shopify-promo .mf-promo-person,#mf-shopify-promo .mf-promo-float,.mf-shopify-float .mf-float-icons span{animation:none!important}}
    body.reduce-motion #mf-shopify-promo *,body.reduce-motion .mf-shopify-float *{animation:none!important}
  `;
  const style = document.createElement("style");
  style.id = "mf-shopify-promo-style";
  style.textContent = css;
  document.head.appendChild(style);

  const home = /(?:^|\/)index\.html?$/.test(location.pathname) || location.pathname.endsWith("/");
  if (home) {
    const banner = document.createElement("section");
    banner.id = "mf-shopify-promo";
    banner.setAttribute("aria-label", "Publicité de la boutique Shopify");
    banner.innerHTML = `
      <div class="mf-promo-copy">
        <span class="mf-promo-kicker">🛍️ DÉCOUVREZ NOTRE BOUTIQUE EN LIGNE</span>
        <h2>Tout ce que vous cherchez, à découvrir dans notre boutique !</h2>
        <p>Accessoires, gadgets, décoration et idées pratiques : explorez notre sélection et trouvez les articles qui vous correspondent.</p>
        <a class="mf-promo-cta" href="https://jjacaa-ja.myshopify.com/" target="_blank" rel="noopener noreferrer">🛍️ VISITER LA BOUTIQUE SHOPIFY</a>
        <small class="mf-promo-note">Votre boutique en ligne vous attend !</small>
      </div>
      <div class="mf-promo-scene" aria-hidden="true">
        <span class="mf-promo-float a">✨</span><span class="mf-promo-float b">🎁</span><span class="mf-promo-float c">❄️</span>
        <span class="mf-promo-person">👧🏻</span><span class="mf-promo-person">🧑🏻</span>
      </div>`;
    const main = document.querySelector("main");
    if (main) main.insertBefore(banner, main.firstChild);
    else document.body.insertBefore(banner, document.body.firstChild);
  } else {
    const floater = document.createElement("a");
    floater.className = "mf-shopify-float";
    floater.setAttribute("aria-label", "Maroc First : publicité de la boutique Shopify");
    floater.href = "https://jjacaa-ja.myshopify.com/";
    floater.target = "_blank";
    floater.rel = "noopener noreferrer";
    floater.innerHTML = '<span class="mf-float-icons" aria-hidden="true"><span>🛍️</span><span>☀️</span><span>🎁</span></span><span>OUVRIR LA BOUTIQUE</span>';
    document.body.appendChild(floater);
  }
})();