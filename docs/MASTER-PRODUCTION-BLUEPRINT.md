# MediTrip India — Master production blueprint

**Product vision:** a verified medical-travel companion for patients planning care in India, with Bangladesh-to-India travel as a first-class use case. The app is a planning and provider-discovery tool; it does not diagnose, recommend treatment, promise outcomes, or replace the treating hospital.

This document is the source-of-truth roadmap for the shared static web app, PWA and Android wrapper. The current ZIP is a buildable, expanded beta; a line marked “planned” is not shipped functionality.

## Product principles

- No generative AI service or paid API. Smart Match and search are deterministic, local rule-based systems with visible reasons.
- Provider data must link to official provider pages or public registries. A source link is provenance, not accreditation, identity proof, quality ranking or endorsement.
- Never invent prices, exchange rates, hotel distances, doctor identities, facilities, credentials, availability or medical outcomes. Unknown values stay unknown and are confirmed by the user with the provider.
- No account or server upload for core use. Saved trip details remain on the device unless the user exports or shares them.
- UI languages: English, বাংলা and हिन्दी. Device speech synthesis uses locally installed voices. Tamil and Telugu phrase support is planned; it is not represented as complete in this build.
- Hospital/doctor photos are excluded unless identity and display rights are verified. Original city illustrations and initials are safe fallbacks.

## Navigation and design

Mobile has five fixed tabs: Home, Treatment, Hospitals, My Trip and More. More links to doctors, stays, phrase/guide content, emergency and visa references, and settings. Desktop keeps a separate sidebar and a constrained central workspace; the layout does not stretch a phone screen across the monitor.

Visual direction: deep navy, medical blue, cyan/teal, white/off-white and restrained violet; readable Bengali and Devanagari fonts; 16–24 px card corners, subtle borders and shadows, keyboard focus, reduced-motion support and responsive controls. Hospital/city illustrations are labelled as illustrations. Three.js, interactive India map and real-photo inventory are planned rather than implied to exist.

## Current data snapshot and launch targets

Counts below are records shipped in this package, not claims that each record is fully verified. Status flags live in the JSON. The review date is recorded in each source file.

| Dataset | Current | Launch target | State |
|---|---:|---:|---|
| Hospital records | 43 | 40–50 | Count reached; several imported records remain `needs_review`; confirm each branch and its services |
| Doctor records | 69 | 120–150 | Short; imported profiles are marked `needs_review` until identity/profile evidence is reviewed |
| Stays | 6 | 40–60 | Short; do not infer proximity, rate or availability from a city-area listing |
| Treatment paths | 15 | 30–40 | Short; prices intentionally require a written hospital quote |
| Medical city records | 8 | 8–10 | Kolkata, Chennai, Hyderabad, Delhi NCR, Bengaluru, Mumbai, Kochi, Ahmedabad |
| Language phrases | 24 | exactly 500 (20×25) | Short; English/Bengali/Hindi only; no templated or machine-filled medical phrases |
| Official source records | See `data/sources.json` | 200+ | Short; expand by primary-source review |
| Area-guide entries | 0 curated POIs | 100+ | Not populated; external Maps search is user initiated |

The app filter includes additional hospital cities from the imported directory. An empty city guide or specialty list means no curated data is available; it does not mean no care exists there.

## Shipped workflows

- **Home and search:** local search groups matching hospitals, treatment paths, doctors and cities; English/Bengali/Hindi labels; no AI API. Coverage reflects the local data, not all providers in India.
- **Hospital discovery:** city and mapped-specialty filters, source links, safe illustration, save and compare up to three hospitals, Maps directions and branch-specific stay search. Do not interpret a directory entry as a verified clinical match.
- **Rule-based Smart Match:** deterministic city, specialty and stay filters with reasons. It does not score clinical outcomes, accreditation, cost or doctor skill.
- **Treatment Finder:** 15 care-pathway labels, translated names, keyword search, hospital links where the local specialty mapping matches, report reminder and written-quote reminder. The list is not medical advice.
- **Doctor directory:** 69 listed records with safe photo fallback and source links. Several records need a person-by-person review before a production “verified” claim.
- **Stays:** six records, current prices and live availability omitted; users can search Maps near a selected hospital. A map result must be confirmed directly.
- **Trip planning:** locally saved checklist, hospital/stay shortlist, manual INR budget, user-entered INR→BDT rate, plan JSON import/export and share. The currency rate is not fetched live.
- **Language support:** full app shell in English, Bengali and Hindi, guides and 24 three-language phrases; speech uses device TTS, not bundled recordings. Missing offline voice is reported.
- **Visa/emergency references:** More provides the official India e-Visa page and India 112 reference. Requirements and emergency details must be rechecked on the linked official pages.
- **Offline:** static assets and curated JSON are bundled; PWA service worker supports local offline use. External links need connectivity. Android uses the same web source in a wrapper.

## Remaining blueprint work

### Provider data and verification

- Person-by-person official doctor profile, hospital affiliation, credentials, language, active status and last-checked review; add experience/procedures only when an official source states them.
- Reach 120–150 reviewed doctors; add 40–60 genuinely curated hotel/guest-house options with official property contact/source and measured, sourced proximity.
- Reach 30–40 treatment paths and exactly 500 reviewed phrases across 20 categories × 25 in English, Bengali, Hindi, Tamil and Telugu. Each phrase needs human review and search aliases in all supported scripts.
- Expand the source ledger toward 200+ URL records; keep a verification log and periodic provider/visa/emergency review schedule.
- Fill 100+ area-guide POIs only from dependable sources and record category, address, source and last checked date.

### Patient and travel tools

- Treatment journey milestones: diagnosis, reports, hospital, doctor, quote, visa, travel, treatment, discharge and follow-up.
- Readiness score, stay-duration *planning* category with clear disclaimer, disease-specific checklist, patient medical-summary and second-opinion pack.
- Questions for doctor, discharge checklist, Bangladesh follow-up contact methods and printable/shareable travel pack.
- Local emergency card, large-text/elderly/attendant accessibility, scam education, nearest emergency contacts and a sourced Bangladesh→India route/land-port guide.
- Expense tracker by category, manual quotes, live currency conversion only if a free trustworthy source is chosen later; retain last-known value and timestamp before enabling it.
- Nearby stay cards require actual official property records. Keep maps-based search as the fallback until enough reliable entries exist.
- Provider comparison should expose known/unknown values, not compare unsupported ratings. Doctor compare (up to 3), accreditation evidence and international desk fields are planned.

### Platform and release

- PWA: maintain app shell cache and versioned data refresh; validate install/update/offline on the production HTTPS host.
- Android: use the included Android Studio WebView wrapper and shared source; run debug/release build and device tests on a machine with Android SDK/JDK. Native share, file import/export, call/map intents and installed-voice TTS require device QA.
- Play: provide publisher email, public privacy URL, own upload key, signed AAB, genuine screenshots and current Play declarations. A source ZIP or debug APK is not a Play submission.
- Keep hosting/static JSON free at this stage; only purchase the Google Play developer registration requested by the publisher. Add paid services only after usage justifies them.

## Canonical data layout

`data/` includes the original directory/content JSON plus production datasets: hospitals, doctors, stays, treatments, cities, phrases, i18n, visa, emergency, travel, area-guide, sources, verification log, schema and offline DB. `tools/build-production-data.py` merges the checked-in source-backed additions into canonical production JSON; it is self-contained, idempotent, and does not scrape at runtime. `tools/sync-data.py` emits the offline JS payload.

## Acceptance checks before a public production claim

1. Every displayed factual provider field has an appropriate source and a real verification state.
2. No unresolved doctor identity, image-rights, stale contact, invented hotel proximity or fabricated quote appears as verified.
3. English/Bengali/Hindi UI route smoke tests pass; translated medical phrase collection is human reviewed. Tamil/Telugu stay marked planned until reviewed.
4. Offline PWA install/update, Android file/share/call/maps/TTS and large-text/reduced-motion behavior pass on physical devices.
5. Signed Play AAB, privacy policy, support channel, store assets and declarations are ready.
6. The numbers in this document and the home screen match the data shipped in that release.
