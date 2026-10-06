# MediTrip India — Master edition 2.1.0

A free, offline-first hospital and medical-travel planning directory. Original responsive design, Bengali/English/Hindi interface and content, device text-to-speech, source-linked listings, hospital comparison, saved journeys, checklist, budget and JSON backup. No generative AI, ads, login, backend, analytics or paid API.

**Start here:** [বাংলা নির্দেশনা](docs/START-BN.md) · [Android build](docs/ANDROID-BUILD.md) · [Verification status](docs/VERIFICATION.md)

## Run the app

The Android Studio project is included. This package does not include a newly compiled APK: the current environment has no Android SDK/Gradle toolchain. Open `android/` in Android Studio to build and test from the included shared web assets. A Play Store upload requires a signed release AAB, your own signing key and publisher privacy/support details.

1. Install Python 3. Run `python tools/serve.py` from this folder.
2. Open http://localhost:4173/. Do not double-click index.html: HTTP is needed for consistent local storage.
3. Choose Bengali, English or Hindi in the header. Bengali is the initial language.
4. For Android, open `android/` in Android Studio. Bundled assets work without an Internet connection.

## Included

| Folder | Contents |
|---|---|
| `.github/` | Optional manual APK/AAB build workflow for your repository |
| `web/` | Ready static PWA, assets and all three languages |
| `android/` | Java/Gradle Android project, native offline TTS, export/import and share |
| `data/` | Canonical JSON data, translated content and source ledger |
| `tests/` | Logic, data and translation tests |
| `docs/` | Build, publishing, privacy, data maintenance and verification instructions |
| `store/` | Original launcher and feature-graphic assets; add actual device screenshots |
| `tools/` | Local preview, data synchronisation and developer asset scripts |

## Coverage and truthfulness

This is an expanded but still incomplete **source-linked starter directory**: 43 hospital records across 15 cities, 11 stay options, 69 doctor listings, 8 launch medical-city records, 15 treatment paths, 24 travel phrases, 18 checklist items and 8 FAQs. 19 new doctor profiles and 5 hotel pages were added from provider/property official pages on 2026-10-06. The hospital count meets the initial 40–50 target; doctor, stay, treatment and phrase targets remain in progress; records marked `needs_review` are visibly identified. This is not complete India-wide coverage; where branch departments are not confirmed, the interface says so. Nearby hotel search opens Maps and does not claim verified rates or distance. Where a full page was inaccessible, the source record explicitly says official search-result evidence. See `data/source-ledger.csv` and `docs/DATA-SOURCES.md`.

Four hotel records have a proximity relationship (one source describes a five-minute drive; actual travel varies); seven are labelled city-area options with route unverified. No invented kilometres, walking times, prices, ratings, availability or outcomes. The official-source label means provenance, not accreditation or clinical endorsement. Confirm branch, doctor availability, routes, room prices and accessibility directly with the provider.

City illustrations and doctor silhouettes are original visual assets, **not provider photographs**. Real hospital/doctor photographs require a licensed/authorised image before adding them. This version intentionally displays an illustration label.

## Publication

This ZIP is a source/build package. It is **not itself a Google Play upload file**. Play needs your signed release `.aab`. Before release: fill your publisher/support/privacy details, use your own signing key, run Android device tests, provide genuine screenshots, and complete the current Play Console declarations. The release Gradle task checks publisher fields and signing variables. See the verification report for what was actually run here.

## No recurring service cost

The Android app needs no server. Data updates are new app releases. The web edition can be hosted on free static hosting subject to the provider's terms/limits. Hosting has ordinary access logs; Android has no network permission. Device voice packs may need a one-time download in the phone's speech settings. Only installed offline voices are selected; missing voices produce a translated message. There are no bundled audio recordings.

## Maintenance

Edit canonical JSON in `data/`; run `python tools/build-production-data.py` then `python tools/sync-data.py`, then `node --test tests/*.test.cjs`. The data build is self-contained and needs no external repository snapshot. Increase `versionCode`, version name and service-worker cache name for updates. Review changed fields against primary sources and keep complete translations. See `docs/DATA-MAINTENANCE.md`.
