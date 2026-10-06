# Android build and release

The current 2.0 web source and wrapper are included, but a 2.0 APK was not compiled in this workspace because the Android SDK/Gradle/Build Tools are unavailable. Open this project in Android Studio and build a fresh debug APK before device testing. The old pre-update 1.0 APK is intentionally not shipped.

## Toolchain

- Android Studio with Android SDK Platform **36**, Build Tools **35.0.0**, JDK **17**.
- Android Gradle Plugin **8.11.1**, Gradle **8.13** (pinned wrapper).
- Minimum supported Android: API 26 / Android 8.0; target API 36. Keep Android System WebView updated (modern ES2020 JavaScript is used).
- No AndroidX, Kotlin or runtime third-party dependency. Platform Java APIs only.
- Official compatibility reference: https://developer.android.com/build/releases/agp-8-11-0-release-notes

In Android Studio open the **android/** directory, wait for Gradle sync, install the SDK packages offered, and choose Build > Generate App Bundles or APKs. `android/local.properties` may point to your SDK; never commit it.

## CLI debug

Set `ANDROID_HOME` to your installed SDK directory. From `android/`:

```sh
./gradlew assembleDebug
# Windows: gradlew.bat assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`. Debug builds use a development certificate and `.debug` package suffix; **do not submit them to Play**.

## Configure publisher

Edit `web/config.js` (single-quoted values): set `publisherName`, a real `supportEmail`, and public HTTPS `privacyPolicyUrl`. Host the supplied privacy template after replacing owner/contact fields and checking your actual release behaviour. Also change applicationId/namespace if the suggested ID is already taken; update Java package folders, AndroidManifest activity and relevant tests if changed. Confirm rights to the app name yourself.

## Sign a release

Keep the upload key outside this project. If creating one, run this interactively; keytool will ask for passwords:

```sh
keytool -genkeypair -v -keystore /secure/location/meditrip-upload.jks -alias meditrip -keyalg RSA -keysize 3072 -validity 10000
```

Provide these four environment variables locally/through secure CI secrets:

- `MEDITRIP_KEYSTORE`: absolute path to your `.jks` file
- `MEDITRIP_STORE_PASSWORD`
- `MEDITRIP_KEY_ALIAS`
- `MEDITRIP_KEY_PASSWORD`

Do not put passwords in scripts, Gradle properties, README or the ZIP. Then:

```sh
./gradlew lintRelease bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab`. The release build checks publisher and signing configuration. It does not validate medical accuracy or guarantee Play acceptance. Upload through Play Console with Play App Signing configured for your account.

## Device acceptance checks

Test on API 26 and a current Android 15/16 phone, narrow screen, large text, portrait/landscape, dark mode, Bengali and Hindi shaping. Test installed offline bn/en/hi voices in airplane mode; missing voice, stop and rate controls. Test Back/modal, external source/map/phone links, storage restart, budget, compare, import/export using Android document picker, share cancellation, safe areas and keyboard resizing. Files picked from cloud storage and external browser pages need their own connectivity. No app network permission is present.

## Web deployment

Copy the contents of `web/` to GitHub Pages or another HTTPS static host. No npm/build step. Hash routes support project subdirectories. On HTTPS the service worker caches the packaged directory after the first successful load; source/maps/external provider links still need Internet. Local HTTP preview does not register the service worker. Bump `web/sw.js` CACHE string on updates. Do not change CSP to allow arbitrary remote scripts.

## Optional GitHub build (no Android Studio computer needed)

A manual `.github/workflows/android-build.yml` is included. Put the project contents at the root of **your own** GitHub repository, including the hidden `.github` folder. From Actions > Build MediTrip Android > Run workflow choose `debug`. Download the APK from the finished run's artifact. This workflow has not been run against your repository; review it before enabling. GitHub plan/runner quotas apply; no paid app API is involved.

For `release`, first complete `web/config.js`. In repository Actions secrets add `MEDITRIP_KEYSTORE_BASE64` (your upload keystore encoded as base64), `MEDITRIP_STORE_PASSWORD`, `MEDITRIP_KEY_ALIAS` and `MEDITRIP_KEY_PASSWORD`. Keep the original key securely outside the repository. The workflow decodes it into temporary runner storage, builds, uploads only APK/AAB outputs, and removes the temporary key. Base64 is an encoding, not encryption: use GitHub secrets, never a committed file. Only run release on code you trust; untrusted modified workflows can access signing secrets. Actions output is not automatically published to Play.

Action references: https://github.com/actions/setup-java · https://github.com/android-actions/setup-android · https://github.com/gradle/actions · https://github.com/actions/upload-artifact . These build-time actions are not runtime app services.
