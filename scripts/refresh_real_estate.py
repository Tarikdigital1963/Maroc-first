#!/usr/bin/env python3
"""Importe les annonces immobilières depuis des flux XML de partenaires autorisés."""
import json, os, sys, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,"immobilier.json")
URLS=[u.strip() for u in os.environ.get("REAL_ESTATE_FEED_URLS","").splitlines() if u.strip()]
if not URLS:
    print("Aucun flux autorisé configuré (REAL_ESTATE_FEED_URLS). Fichier conservé sans modification.")
    sys.exit(0)

def txt(node, name):
    el=node.find(name)
    return (el.text or "").strip() if el is not None else ""

def parse_feed(url):
    req=urllib.request.Request(url,headers={"User-Agent":"MarocFirst-PartnerFeed/1.0"})
    with urllib.request.urlopen(req,timeout=30) as response:
        raw=response.read(8_000_000)
    root=ET.fromstring(raw)
    ads=[]
    for ad in root.findall(".//ad"):
        listing_id=txt(ad,"id")
        link=txt(ad,"url")
        title=txt(ad,"title")
        if not listing_id or not title or not link.startswith("https://"):
            continue
        pictures=[]
        for p in ad.findall(".//picture"):
            pic=txt(p,"picture_url") or (p.text or "").strip()
            if pic.startswith("https://"):
                pictures.append(pic)
        price=txt(ad,"price")
        price_el=ad.find("price")
        period=price_el.attrib.get("period","") if price_el is not None else ""
        city=txt(ad,"city")
        raw_date=txt(ad,"date") or txt(ad,"updated_at")
        raw_type=txt(ad,"property_type").lower()
        type_names={"apartment":"Appartement","house":"Maison","villa":"Villa","land":"Terrain","riad":"Riad","farm":"Ferme","office":"Bureau","shop":"Local commercial","commercial":"Local commercial"}
        item={
            "id":listing_id,"url":link,"title":title,"content":txt(ad,"content"),
            "type":txt(ad,"type"),"type_label":txt(ad,"type") or "Annonce partenaire",
            "property_type":type_names.get(raw_type,txt(ad,"property_type")),"price":price,
            "currency":"DH","rent_period":period,"city":city,
            "city_area":txt(ad,"city_area"),"agency":txt(ad,"agency") or txt(ad,"company"),
            "date":raw_date,"area":txt(ad,"floor_area") or txt(ad,"plot_area"),
            "rooms":txt(ad,"rooms"),"bathrooms":txt(ad,"bathrooms"),
            "image":pictures[0] if pictures else ""
        }
        if item["type"]=="For Rent": item["type_label"]="À louer"
        elif item["type"]=="For Sale": item["type_label"]="À vendre"
        elif item["type"]=="Land For Sale": item["type_label"]="Terrain à vendre"
        ads.append(item)
    return ads

all_ads=[]
errors=[]
for url in URLS:
    try:
        all_ads.extend(parse_feed(url))
        print("Flux traité :",url)
    except Exception as exc:
        errors.append(f"{url}: {exc}")
if errors:
    print("Erreur(s) de flux; conservation de l'ancien fichier :", "; ".join(errors),file=sys.stderr)
    sys.exit(1)

seen=set()
unique=[]
for item in all_ads:
    key=(item["id"],item["url"])
    if key in seen: continue
    seen.add(key)
    unique.append(item)
priority={"Fès":0,"Meknès":1,"Khémisset":2}
unique.sort(key=lambda x:x.get("date",""),reverse=True)
unique.sort(key=lambda x:priority.get(x.get("city"),3))
unique=unique[:120]
data={"updatedAt":datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),"sourceStatus":f"{len(URLS)} flux partenaire(s) traités","listings":unique}
with open(OUT,"w",encoding="utf-8") as f:
    json.dump(data,f,ensure_ascii=False,indent=2)
    f.write("\n")
print(f"{len(unique)} annonce(s) valides publiées dans immobilier.json")
