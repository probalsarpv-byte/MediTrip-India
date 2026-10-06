# MediTrip India — Production V1.2 (Zero-cost PWA / APK-ready)

Verified medical travel companion for patients (especially from Bangladesh) seeking treatment in India.

## What's new in V1.2
- **19 hospitals** (added Apollo Proton Cancer Centre Chennai + Indraprastha Apollo Delhi)
- **42 doctors** — enriched experience/languages/qualifications + new profiles for Apollo Chennai, MIOT, Manipal, CARE, BLK-Max
- **8 hostel/stay suggestions** near major hospital clusters
- **17 phrases** (bn / en / hi) covering consultation, reception, payment, visa, emergency, pharmacy, stay
- **Single offline DB**: `data/offline-db.json` (~68 KB) for easy APK embedding
- Hospital covers & doctor avatars follow image policy (illustrative / avatar fallback)
- PWA service worker caches all data + assets for offline use
- Smart Match, Compare (2–3), Cost planner, Language assistant, Journey checklist

## Zero-cost APK options
1. **Install as PWA** (Chrome / Edge / Samsung Internet): Open site → “Add to Home screen”. Works offline.
2. **Trusted Web Activity (TWA)** with free Bubblewrap / Android Studio → generates a signed APK that opens this PWA. No Play Store fee required for sideload.
3. **Capacitor / Cordova** (optional later) if you want native plugins.

## Run locally
```bash
cd meditrip
npx serve -p 3000   # or any static server
# open http://localhost:3000
```

## Data safety
- Treatment prices are **never invented** — user enters official hospital quote.
- Doctor photos = safe avatar unless exact official-profile reuse is cleared.
- Hospital images = illustrative covers unless license cleared.
- Hostels = directory-style suggestions only; confirm with hospital international desk.

## Files
- `data/offline-db.json` — single file for embedding
- `data/*.production.json` — individual collections
- `js/app.js` — main app
- `sw.js` — offline cache (version meditrip-production-v1.2-20261005)
