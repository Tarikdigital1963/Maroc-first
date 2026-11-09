(function(){
"use strict";
const script=document.currentScript;
const section=script&&script.dataset.section||"maroc";
const labels={maroc:"Actualités du Maroc",politique:"Politique",international:"International",economie:"Économie",societe:"Société",sport:"Sport",culture:"Culture",emploi:"Emploi",inclusion:"Inclusion et handicap",immobilier:"Immobilier",flash:"Flash News",flash_sport:"Flash Sport",budget:"Budget"};
const icons={maroc:"🇲🇦",politique:"🏛️",international:"🌍",economie:"💰",societe:"👥",sport:"⚽",culture:"🎭",emploi:"💼",inclusion:"♿",immobilier:"🏡",flash:"🚨",flash_sport:"⚽",budget:"📊"};
const style=document.createElement("style");
style.textContent=".mf-daily{margin:24px 0;padding:20px;background:#182230;color:#f4f7fb;border:1px solid #39485c;border-radius:16px}.mf-daily h2{color:#f0c65b}.mf-daily-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px}.mf-daily-card{background:#101923;border:1px solid #39485c;border-radius:12px;padding:14px;overflow-wrap:anywhere}.mf-daily-card img{width:100%;height:155px;object-fit:cover;border-radius:9px;margin-bottom:8px}.mf-daily-card a{color:#ffe08a;font-weight:bold}.mf-daily-meta{color:#c1ccda;font-size:.88em}.mf-daily-status{color:#c1ccda}";
document.head.append(style);
const main=document.querySelector("main")||document.body;
const sectionBox=document.createElement("section");sectionBox.className="mf-daily";
const heading=document.createElement("h2");heading.textContent=(icons[section]||"📰")+" "+(labels[section]||"Dernières actualités")+" · Articles récents";
const status=document.createElement("p");status.className="mf-daily-status";status.textContent="Chargement des actualités archivées…";
const grid=document.createElement("div");grid.className="mf-daily-grid";sectionBox.append(heading,status,grid);
const footer=document.querySelector("footer");if(footer)main.insertBefore(sectionBox,footer);else main.append(sectionBox);
function dateText(v){try{return new Date(v).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"});}catch(e){return "";}}
fetch("./actualites.json?ts="+Date.now(),{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("archive indisponible");return r.json();}).then(data=>{
let items=(data.sections&&data.sections[section])||[];
if(section==="budget")items=(data.sections.economie||[]).filter(x=>/budget|impôt|fiscal|dépense|finance publique/i.test(x.title+" "+x.summary));
if(!items.length){status.textContent="Aucun nouvel article disponible pour cette rubrique pour le moment.";return;}
items=items.slice(0,24);grid.replaceChildren();
items.forEach(item=>{
const card=document.createElement("article");card.className="mf-daily-card";
if(item.image){const img=document.createElement("img");img.loading="lazy";img.src=item.image;img.alt="Image associée à l’actualité";img.onerror=()=>img.remove();card.append(img);}
const title=document.createElement("h3"),link=document.createElement("a");link.href=item.url;link.target="_blank";link.rel="noopener noreferrer";link.textContent=item.title;title.append(link);card.append(title);
if(item.summary){const p=document.createElement("p");p.textContent=item.summary;card.append(p);}
const meta=document.createElement("p");meta.className="mf-daily-meta";meta.textContent=[item.source,dateText(item.published)].filter(Boolean).join(" · ");card.append(meta);grid.append(card);
});
status.textContent="Archive actualisée le "+dateText(data.updatedAt)+". Les anciens articles restent consultables dans cette rubrique.";
}).catch(()=>{status.textContent="Le chargement automatique est momentanément indisponible. Les articles déjà publiés restent conservés.";});
})();