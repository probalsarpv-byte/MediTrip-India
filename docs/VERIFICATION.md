# Verification report — MediTrip India Master 2.1.0

## Checked in this workspace

- **11/11 logic and data test groups passed** (`node tests/core.test.cjs`): Bengali hospital search, expanded city/specialty matching, deterministic Smart Match, budget math and hostile inputs, local plan import allowlists, speech chunking, three-language UI key parity, source/reference/price checks, canonical JSON-to-JS parity and PWA manifest/precache files.
- `node --check web/app.js` passed after adding the Treatment Finder, grouped home search and mobile navigation.
- Data totals were checked against the canonical JSON: 43 hospital records, 69 doctor records, 11 stay records, 15 treatments, 8 launch medical cities, 24 phrases, 15 preparation guides and 18 checklist items. Hospital records span 15 cities.
- The browser smoke suite now covers the treatment list/detail, global search, More screen and all English/Bengali/Hindi routes. It **could not be executed here** because the environment has no Chromium executable. The previous 1.0 screenshot previews are removed rather than presented as current evidence.

## Not built or tested here

- The current workspace has no Android SDK, Gradle installation/cache, `apksigner` or Android Build Tools. The 2.1 web assets and Java wrapper were **not compiled into a new APK/AAB**. No stale 1.0 APK is included in this ZIP. Build the included `android/` project with Android Studio/JDK 17/SDK 36 before installing.
- No physical Android device was available. Native text-to-speech, import/export picker, share, external links, keyboard/safe areas, large text and offline behavior still require device testing.
- The current browser smoke suite, live GitHub Pages service-worker install/update and production HTTPS deployment were not exercised in this session.
- The master checklist and release gaps are listed in `MASTER-PRODUCTION-BLUEPRINT.md`.

## Data verification limits

The expanded JSON carries source URLs and `verificationStatus`. Imported hospitals/doctors requiring a detailed branch/person review are marked `needs_review`; do not promote them to verified without checking the linked official page. Official-source status shows provenance, not accreditation or clinical suitability. Some official pages were only available via official directories/search evidence during the source snapshot; the ledger records URLs and evidence mode. Contact, department, affiliation and availability can change.

No doctor photos, unsourced prices, exchange rates, hotel distances, accreditation claims or treatment outcomes are added. An 11-property stay list is below the 40–60 target; four entries have a proximity relationship and seven are city-area options. The 24 phrases do not meet the requested 500 phrase target or five-language phrase goal. Treatment paths total 15 of the 30–40 target. The canonical data build now runs entirely from checked-in files using `python tools/build-production-data.py`; build tests confirm it does not require any external checkout. This remains an expanded beta, not production-complete national coverage.

## Publication gate

This source ZIP is not a Google Play submission. Before publishing, compile/test Android, provide publisher email and public privacy URL, use your own protected upload key, produce and validate a signed release AAB, prepare real screenshots/store declarations, and review all `needs_review` medical provider records.
