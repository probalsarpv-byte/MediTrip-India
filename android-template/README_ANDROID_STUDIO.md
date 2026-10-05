# Android Studio wrapper

This package is intentionally built as a static SPA so the same UI can run on GitHub Pages now and inside an Android WebView later.

1. Create an Android Studio project (Kotlin, minSdk 24+).
2. Copy this web package (index.html, css, js, data, assets) into:
   app/src/main/assets/www/
3. Copy MainActivity.kt and activity_main.xml from android-template as a starter.
4. Add INTERNET permission.
5. For production, replace demo JSON data with verified source-tracked data.
6. If you later prefer Capacitor, the same web directory can be used as the webDir.

Important: Service worker is for the web/PWA build. Android WebView can load the local files without it.
