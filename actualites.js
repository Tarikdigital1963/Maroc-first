(function(){
"use strict";
const script=document.currentScript;
const section=script&&script.dataset.section||"maroc";
const labels={maroc:"Actualités du Maroc",politique:"Politique",international:"International",economie:"Économie",societe:"Société",sport:"Sport",culture:"Culture",emploi:"Emploi",inclusion:"Inclusion et handicap",immobilier:"Immobilier",flash:"Flash News",flash_sport:"Flash Sport",budget:"Budget"};
const icons={maroc:"🇲🇦",politique:"🏛️",international:"🌍",economie:"💰",societe:"👥",sport:"⚽",culture:"🎭",emploi:"💼",inclusion:"♿",immobilier:"🏡",flash:"🚨",flash_sport:"⚽",budget:"📊"};
const style=document.createElement("style");
style.textContent=".mf-daily{margin:24px 0;padding:20px;background:#182230;color:#f4f7fb;border:1px solid #39485c;border-radius:16px}.mf-daily h2{color:#f0c65b}.mf-daily-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px}.mf-daily-card{background:#101923;border:1px solid #39485c;border-radius:12px;padding:14px;overflow-wrap:anywhere}.mf-daily-card img{width:100%;height:155px;object-fit:cover;border-radius:9px;margin-bottom:8px}.mf-daily-card a{color:#ffe08a;font-weight:bold}.mf-daily-meta{color:#c1ccda;font-size:.88em}.mf-daily-status{color:#c1ccda}.mf-daily-more{margin-top:16px;padding:12px 18px;border-radius:9px;border:1px solid #66758a;background:#26364a;color:#fff;font:inherit;font-weight:bold;cursor:pointer}";
document.head.append(style);
const main=document.querySelector("main")||document.body;
const box=document.createElement("section");box.className="mf-daily";
const heading=document.createElement("h2");heading.textContent=(icons[section]||"📰")+" "+(labels[section]||"Dernières actualités")+" · Articles récents";
const status=document.createElement("p");status.className="mf-daily-status";status.textContent="Chargement des actualités archivées…";
const grid=document.createElement("div");grid.className="mf-daily-grid";
const more=document.createElement("button");more.type="button";more.className="mf-daily-more";more.textContent="Afficher les articles précédents";more.hidden=true;
box.append(heading,status,grid,more);
const footer=document.querySelector("footer");if(footer&&footer.parentNode===main)main.insertBefore(box,footer);else main.append(box);
function dateText(v){try{return new Date(v).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"});}catch(e){return "";}}
fetch("./actualites.json?ts="+Date.now(),{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("archive indisponible");return r.json();}).then(data=>{
let items=(data.sections&&data.sections[section])||[];
if(section==="budget")items=(data.sections.economie||[]).filter(x=>/budget|impôt|fiscal|dépense|finance publique/i.test(x.title+" "+x.summary));
if(!items.length){status.textContent="Aucun article archivé pour cette rubrique pour le moment.";return;}
let shown=24;
function render(){
 grid.replaceChildren();
 items.slice(0,shown).forEach(item=>{
  const card=document.createElement("article");card.className="mf-daily-card";
  if(item.image){const img=document.createElement("img");img.loading="lazy";img.src=item.image;img.alt="Image associée à l’actualité";img.onerror=()=>img.remove();if(section==="sport"&&item.url){const imageLink=document.createElement("a");imageLink.href=item.url;imageLink.target="_blank";imageLink.rel="noopener noreferrer";imageLink.setAttribute("aria-label","Ouvrir l’article : "+(item.title||"Actualité sportive"));imageLink.style.display="block";imageLink.style.cursor="pointer";imageLink.append(img);card.append(imageLink);}else{card.append(img);}}
  const title=document.createElement("h3"),link=document.createElement("a");link.href=item.url;link.target="_blank";link.rel="noopener noreferrer";link.textContent=item.title;title.append(link);card.append(title);
  if(item.summary){const p=document.createElement("p");p.textContent=item.summary;card.append(p);}
  const meta=document.createElement("p");meta.className="mf-daily-meta";meta.textContent=[item.source,dateText(item.published)].filter(Boolean).join(" · ");card.append(meta);grid.append(card);
 });
 more.hidden=shown>=items.length;
}
more.addEventListener("click",()=>{shown+=24;render();});
render();
status.textContent="Archive actualisée le "+dateText(data.updatedAt)+". Les anciens articles sont conservés. Utilisez le bouton pour consulter la suite de l’historique.";
}).catch(()=>{status.textContent="Le chargement automatique est momentanément indisponible. Les articles déjà publiés restent conservés.";});
})();