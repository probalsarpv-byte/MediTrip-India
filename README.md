# MediTrip India V1

GitHub Pages-ready static medical travel companion prototype.

## Important
This repository ships with **demo data only**. Do not publish the included hospital/doctor records as factual listings. Replace them with verified real-world records before launch.

## Run locally
Because JSON is loaded with `fetch()`, open through a local web server instead of double-clicking `index.html`.

### VS Code
Use the Live Server extension and open `index.html`.

### Node
```bash
npx serve .
```

### Python
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`.

## GitHub Pages
1. Create a repository.
2. Upload the contents of this folder to the repository root.
3. Commit and push.
4. GitHub → Settings → Pages.
5. Deploy from branch → `main` → `/root`.
6. Open the published URL.

## Main features
- Mobile-first PWA
- Hospital and doctor directory
- Treatment explorer
- Verified/review status badges
- Smart city matching
- Hospital compare
- Cost planner
- Medical Visa guide
- Medical language assistant with text-to-speech
- Google Maps embed and directions
- Favorites and treatment journey using LocalStorage
- Offline service worker cache
- Smooth app-style navigation

## Data files
- `data/hospitals.json`
- `data/doctors.json`
- `data/treatments.json`
- `data/cities.json`
- `data/phrases.json`
- `data/visa.json`

## Next production step
Build the verified India hospital/doctor dataset and replace demo contacts/costs. Keep `verified`, `status`, source metadata and review logs for every dynamic entity.
