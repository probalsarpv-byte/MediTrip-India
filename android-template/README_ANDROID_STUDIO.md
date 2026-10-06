# MediTrip India Production V2 — Android Studio handoff

The web app is a static SPA and can be packaged inside Android Studio.

Recommended:
1. Create a Kotlin Android project (minSdk 24+).
2. Copy the web folders/files into `app/src/main/assets/www/`.
3. Use the included `MainActivity.kt` WebView wrapper as the starting point.
4. For production, handle `tel:`, `https://wa.me/`, Google Maps URLs and external websites with Android intents.
5. Add adaptive launcher icons from the MediTrip icon artwork.
6. Keep JavaScript and DOM storage enabled; keep file access limited to app assets.
7. Test Android back behavior, offline mode, text-to-speech and external links before Play Store release.

This repo remains the source-of-truth for the same UI used by GitHub Pages and the future APK.
