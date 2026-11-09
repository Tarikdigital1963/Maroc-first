/* Maroc First - traduction automatique des rubriques */
(function(){
  if (window.__marocFirstTranslator) return;
  window.__marocFirstTranslator = true;
  var bar=document.createElement('div');
  bar.id='mf-language-tools';
  bar.setAttribute('aria-label','Choisir la langue');
  bar.innerHTML='<label for="mf-language-select">🌐 Langue</label><select id="mf-language-select" aria-label="Langue de traduction"><option value="fr">Français</option><option value="en">English</option><option value="ar">العربية</option></select><div id="google_translate_element" aria-hidden="true"></div>';
  var style=document.createElement('style');
  style.textContent='#mf-language-tools{position:fixed;z-index:99999;right:12px;bottom:12px;display:flex;align-items:center;gap:8px;padding:10px 12px;background:#101923;border:2px solid #f0c65b;border-radius:14px;box-shadow:0 4px 18px #0009;color:#fff;font: bold 16px Arial,sans-serif}#mf-language-tools select{background:#26364a;color:#fff;border:1px solid #f0c65b;border-radius:8px;padding:9px 10px;font-size:16px;max-width:155px}#google_translate_element{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip-path:inset(50%)!important}body{padding-bottom:68px} .goog-te-banner-frame.skiptranslate{display:none!important}body{top:0!important}#goog-gt-tt,.goog-te-balloon-frame{display:none!important}';
  document.head.appendChild(style);
  document.body.appendChild(bar);
  function setLanguage(lang){
    try{
      document.cookie='googtrans=/fr/'+lang+';path=/;max-age=31536000;SameSite=Lax';
      document.cookie='googtrans=/fr/'+lang+';path=/Maroc-first/;max-age=31536000;SameSite=Lax';
      var select=document.querySelector('.goog-te-combo');
      if(select){select.value=lang;select.dispatchEvent(new Event('change'));}
      else if(lang==='fr'){location.reload();}
    }catch(e){}
  }
  var picker=document.getElementById('mf-language-select');
  var saved=(document.cookie.match(/(?:^|; )googtrans=\/fr\/(fr|en|ar)/)||[])[1]||'fr';
  picker.value=saved;
  picker.addEventListener('change',function(){setLanguage(this.value);});
  window.googleTranslateElementInit=function(){
    if(window.google&&google.translate){
      new google.translate.TranslateElement({pageLanguage:'fr',includedLanguages:'fr,en,ar',autoDisplay:false},'google_translate_element');
      setTimeout(function(){var s=document.querySelector('.goog-te-combo');if(s&&saved!=='fr'){s.value=saved;s.dispatchEvent(new Event('change'));}},900);
    }
  };
  var script=document.createElement('script');
  script.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async=true;
  document.head.appendChild(script);
})();