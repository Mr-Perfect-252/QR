# Lattice — QR Studio (React Native)

A URL-to-QR generator app matching the "Lattice" design: cream palette,
serif title, live preview, color presets, adjustable size, error
correction levels, and PNG export/save-to-gallery.

## Run locally (fastest way to try it)

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your Android phone — no build needed.

## Get a real .apk — three options

### Option A: GitHub Actions (already set up, no local Android setup needed)

This repo includes `.github/workflows/build-apk.yml`. Steps:

1. Push this folder to a new GitHub repository.
2. Go to the repo's **Actions** tab. The workflow runs automatically on
   push to `main`, or click **Run workflow** to trigger it manually.
3. When it finishes (~5–8 min), open the completed run and download the
   **lattice-qr-debug-apk** artifact — that's your installable `.apk`.
4. Transfer it to your Android phone and tap to install (allow
   "install from unknown sources" if prompted).

This builds a **debug** APK, which is fine for personal use/testing.

### Option B: EAS Build (Expo's cloud build service)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

EAS emails/links you a downloadable `.apk` when the cloud build finishes —
no local Android SDK required either.

### Option C: Build locally with Android Studio

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

The APK appears at `android/app/build/outputs/apk/debug/app-debug.apk`.

## Project structure

```
lattice-qr/
├── App.js                     # Main screen/UI
├── app.json                   # Expo app config (name, package id, colors)
├── package.json
└── .github/workflows/
    └── build-apk.yml          # CI workflow that builds the APK for you
```

## Customizing

- Colors/presets: edit the `PRESETS` array in `App.js`.
- App name / package id: edit `app.json` (`expo.name`, `expo.android.package`).
- To produce a signed **release** APK instead of debug, change the
  workflow's `assembleDebug` to `assembleRelease` and add your keystore
  as a GitHub secret (see Expo/Android docs for signing config).
