#!/usr/bin/env python3
"""Build a cumulative, source-linked daily news archive for Maroc First."""
import json, os, re, time, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

OUT = "actualites.json"
MAX_PER_SECTION = None
UA = "MarocFirstNewsBot/1.0 (+https://tarikdigital1963.github.io/)"
QUERIES = {
 "maroc": ["Maroc actualités gouvernement société aujourd'hui", "المغرب أخبار اليوم"],
 "politique": ["Maroc politique gouvernement parlement diplomatie", "المغرب السياسة الحكومة البرلمان"],
 "international": ["actualité internationale monde ONU diplomatie aujourd'hui", "أخبار العالم اليوم الأمم المتحدة"],
 "economie": ["Maroc économie entreprises marchés emploi budget", "المغرب الاقتصاد المقاولات"],
 "societe": ["Maroc société éducation santé environnement villes", "المغرب مجتمع تعليم صحة بيئة"],
 "sport": ["sport Maroc football Botola équipe nationale athlétisme tennis", "الرياضة المغرب كرة القدم"],
 "culture": ["Maroc culture cinéma musique livres patrimoine", "المغرب الثقافة السينما"],
 "emploi": ["Maroc emploi recrutement formation travail", "المغرب التشغيل فرص العمل"],
 "inclusion": ["Maroc handicap inclusion accessibilité droits personnes handicapées", "المغرب الإعاقة الإدماج"],
 "immobilier": ["Maroc immobilier logement urbanisme construction", "المغرب العقار السكن"],
 "flash": ["Maroc actualité urgente dernière minute OR breaking news", "أخبار عاجلة المغرب"],
 "flash_sport": ["sport actualité urgente football résultats compétition", "أخبار رياضية عاجلة"]
}
def clean(s):
    return re.sub(r"\s+", " ", (s or "").strip())
def fetch(q):
    params = urllib.parse.urlencode({"q": q, "hl":"fr", "gl":"MA", "ceid":"MA:fr"})
    url = "https://news.google.com/rss/search?" + params
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as response:
        root = ET.fromstring(response.read())
    items=[]
    for node in root.findall(".//item"):
        title=clean(node.findtext("title"))
        link=clean(node.findtext("link"))
        desc=clean(node.findtext("description"))
        source_node=node.find("source")
        source=clean(source_node.text if source_node is not None else "")
        pub=clean(node.findtext("pubDate"))
        image=""
        for child in list(node):
            if child.tag.endswith("thumbnail") or child.tag.endswith("content"):
                image=child.attrib.get("url","")
                if image: break
        if not title or not link.startswith("http"): continue
        try:
            dt=parsedate_to_datetime(pub).astimezone(timezone.utc).isoformat()
        except Exception:
            dt=datetime.now(timezone.utc).isoformat()
        # Google RSS descriptions can contain HTML; strip tags conservatively.
        summary=clean(re.sub("<[^>]+>", " ", desc))
        items.append({"title":title,"url":link,"published":dt,"source":source or "Google Actualités","summary":summary[:420],"image":image if image.startswith("https://") else ""})
    return items

try:
    with open(OUT, encoding="utf-8") as f: archive=json.load(f)
except Exception:
    archive={"updatedAt":"","sections":{}}
sections=archive.get("sections",{})
errors=[]
for section, queries in QUERIES.items():
    old=sections.get(section,[])
    known={x.get("url") for x in old}
    fresh=[]
    for query in queries:
        try:
            for item in fetch(query):
                if item["url"] not in known:
                    known.add(item["url"]); fresh.append(item)
        except Exception as e:
            errors.append(section + ": " + str(e)[:160])
    merged=sorted(fresh+old,key=lambda x:x.get("published",""),reverse=True)
    sections[section]=merged if MAX_PER_SECTION is None else merged[:MAX_PER_SECTION]
archive={"updatedAt":datetime.now(timezone.utc).isoformat(),"sections":sections,"note":"Titres et résumés issus de flux RSS publics; les articles complets restent chez leurs éditeurs.","errors":errors}
with open(OUT,"w",encoding="utf-8") as f:
    json.dump(archive,f,ensure_ascii=False,indent=2)
print("Sections:", {k:len(v) for k,v in sections.items()})
print("New entries:", sum(len([x for x in sections[k] if x.get("published","") >= archive["updatedAt"][:10]]) for k in sections))
if not any(sections.values()):
    raise SystemExit("No news items retrieved; refusing to publish an empty archive.")
