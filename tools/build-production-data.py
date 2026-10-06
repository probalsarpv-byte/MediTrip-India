#!/usr/bin/env python3
"""Rebuild production data from checked-in canonical JSON and curated additions.

No network, private API, or external checkout is required. Official records in
curated-additions.json are manually reviewed and source linked.
"""
from pathlib import Path
import csv, json

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
TODAY = '2026-10-06'

def read(name):
    return json.loads((DATA / name).read_text(encoding='utf-8'))

def write(name, value):
    (DATA / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

directory = read('directory.json')
additions = read('curated-additions.json')
for group in ('doctors', 'hotels'):
    by_id = {item['id']: item for item in directory[group]}
    for item in additions[group]:
        by_id[item['id']] = item
    directory[group] = list(by_id.values())
directory['version'] = '2.1.0'
directory['reviewedAt'] = TODAY

# Every record link must resolve to the hospital database; preserve official names.
hospital_ids = {x['id'] for x in directory['hospitals']}
for group in ('doctors', 'hotels'):
    ids = [x['id'] for x in directory[group]]
    if len(ids) != len(set(ids)):
        raise ValueError(f'duplicate IDs in {group}')
    for item in directory[group]:
        if item.get('hospital') not in hospital_ids:
            raise ValueError(f"{group} record {item['id']} links unknown hospital {item.get('hospital')}")
        for url in item.get('sources', []):
            if not url.startswith('https://'):
                raise ValueError(f"non-HTTPS source on {item['id']}: {url}")

source_records = read('sources.json')
urls = {x.get('url') for x in source_records}
for group in ('hospitals', 'doctors', 'hotels'):
    for item in directory[group]:
        sources = item.get('sources') or ([item.get('source')] if item.get('source') else [])
        for url in sources:
            if url and url not in urls:
                source_records.append({'id': 'SRC_CURATED_' + item['id'].upper().replace('-', '_'),
                    'type': 'official_' + ('hotel' if group == 'hotels' else 'doctor' if group == 'doctors' else 'hospital'),
                    'name': item.get('name', {}).get('en', item['id']), 'url': url,
                    'lastChecked': TODAY, 'verificationStatus': item.get('verificationStatus', 'needs_review')})
                urls.add(url)

# Idempotent CSV ledger updates, retaining the checked-in header and existing rows.
ledger = DATA / 'source-ledger.csv'
with ledger.open(encoding='utf-8', newline='') as f:
    rows = list(csv.DictReader(f))
known = {(r.get('record_id'), r.get('official_source')) for r in rows}
for group in ('doctors', 'hotels'):
    for item in additions[group]:
        for url in item.get('sources', []):
            key = (item['id'], url)
            if key not in known:
                rows.append({'record_id': item['id'], 'kind': group, 'name': item['name']['en'],
                    'official_source': url, 'additional_sources': url, 'review_date': TODAY,
                    'retrieval_evidence': 'official_profile' if group == 'doctors' else 'official_property_page',
                    'notes': 'Official source checked; identity/location only. No unverified photo, rate, rating or distance asserted.'})
                known.add(key)
with ledger.open('w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['record_id','kind','name','official_source','additional_sources','review_date','retrieval_evidence','notes'])
    writer.writeheader(); writer.writerows(rows)

content = read('content.json')
translations = read('translations.json')
cities = read('cities.production.json')
write('directory.json', directory)
write('hospitals.production.json', directory['hospitals'])
write('doctors.production.json', directory['doctors'])
write('stays.production.json', directory['hotels'])
write('treatments.production.json', directory['treatments'])
write('phrases.production.json', content['phrases'])
write('i18n.json', translations)
write('visa.production.json', read('visa.production.json'))
write('emergency.production.json', read('emergency.production.json'))
write('travel.production.json', read('travel.production.json'))
write('area-guide.production.json', read('area-guide.production.json'))
write('sources.json', source_records)
write('verification-log.json', [{'date': TODAY, 'action': 'Expanded checked-in curated doctor profiles and hotel source records; no synthetic records or images.',
    'counts': {'hospitals': len(directory['hospitals']), 'doctors': len(directory['doctors']), 'stays': len(directory['hotels']), 'treatments': len(directory['treatments']), 'phrases': len(content['phrases']), 'sources': len(source_records)}}])
write('schema.json', {'version': '2.1.0', 'requiredHospital': ['id','city','name.en','address.en','source','sources','verificationStatus'],
    'requiredDoctor': ['id','name.en','hospital','specialty','source','verificationStatus'], 'requiredStay': ['id','city','name.en','address.en','source','hospital','verificationStatus'],
    'statuses': ['verified_official','verified_official_plus_registry','needs_review','inactive'],
    'photoPolicy': 'No real-person photo is displayed unless identity and reuse rights are separately verified.'})
write('offline-db.json', {'version':'2.1.0','directory':directory,'content':content,'translations':translations,
    'referenceLinks': {'visa':'https://indianvisaonline.gov.in/evisa/tvoa.html','emergency':'https://112.gov.in/'}})
print(f"Built canonical data: {len(directory['hospitals'])} hospitals · {len(directory['doctors'])} doctors · {len(directory['hotels'])} stays · {len(directory['treatments'])} treatments · {len(content['phrases'])} phrases · {len(source_records)} sources")
