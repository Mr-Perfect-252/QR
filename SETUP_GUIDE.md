# Lattice QR - Setup & Build Guide

Complete guide to setting up the Lattice QR Studio app with ApexHub SDK integration.

## Prerequisites

- **Android Studio** 2023.1 or later
- **Android SDK** 23 (API level 23) or higher
- **Java 11** or later
- **Gradle** 8.0+
- Node.js & npm (for React Native/Expo CLI)

## Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Mr-Perfect-252/QR.git
cd QR

# Install Node dependencies
npm install

# Install Android dependencies
cd android
./gradlew build
cd ..
```

### 2. Configure ApexHub SDK

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your ApexHub keys
# Get keys from: https://apexhub.app/console
nano .env
```

Required environment variables:
```
APEXHUB_PUBLIC_KEY=pk_live_YOUR_KEY_HERE
APEXHUB_APP_ID=app_YOUR_ID_HERE
APEXHUB_CHANNEL=stable
APEXHUB_CHECK_INTERVAL_HOURS=6
```

### 3. GitHub Packages Authentication

ApexHub SDK is hosted on GitHub Packages. Set up authentication:

```bash
# Linux/macOS
export GITHUB_ACTOR=your_github_username
export GITHUB_TOKEN=your_personal_access_token

# Windows (PowerShell)
$env:GITHUB_ACTOR = "your_github_username"
$env:GITHUB_TOKEN = "your_personal_access_token"
```

**Get a Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `read:packages` scope
3. Save it securely (you'll only see it once)

### 4. Build & Run

#### Development (with Expo)

```bash
# Start dev server
npm start

# Run on Android
npm run android

# Or use Expo CLI
expo start --android
```

#### Production Build

```bash
cd android

# Build release APK
./gradlew assembleRelease

# Or build App Bundle (for Google Play)
./gradlew bundleRelease

cd ..
```

Output:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- App Bundle: `android/app/build/outputs/bundle/release/app-release.aab`

## Project Structure

```
QR/
├── .env.example                          # Environment template
├── APEXHUB_INTEGRATION.md               # SDK integration guide
├── SETUP_GUIDE.md                        # This file
├── App.js                                # React Native entry point
├── app.js                                # QR Studio app logic
├── package.json                          # Node dependencies
│
├── android/                              # Android Native Code
│   ├── app/
│   │   ├── build.gradle.kts             # App build config + SDK
│   │   └── src/main/
│   │       ├── AndroidManifest.xml      # Permissions & app config
│   │       ├── kotlin/com/lattice/qr/
│   │       │   ├── MyApplication.kt     # ApexHub initialization
│   │       │   └── MainActivity.kt      # Main activity + SDK usage
│   │       └── res/                     # UI resources
│   │
│   ├── build.gradle.kts                 # Root build config
│   ├── settings.gradle.kts              # Repository + SDK maven
│   ├── gradlew                           # Gradle wrapper (Linux/macOS)
│   └── gradlew.bat                      # Gradle wrapper (Windows)
│
└── src/                                 # React Native screens
    └── screens/
        └── HomeScreen.js                # Main QR generation UI
```

## File Explanations

### `.env.example`
Template for environment variables. Copy to `.env` and fill in your ApexHub keys.

### `android/app/build.gradle.kts`
- Defines Android app configuration
- Adds ApexHub SDK dependency
- Reads environment variables into `BuildConfig` for easy access in code

### `android/app/src/main/AndroidManifest.xml`
- Declares required permissions (INTERNET, REQUEST_INSTALL_PACKAGES, etc.)
- Registers application & activities
- ApexHub SDK merges its own manifest automatically

### `android/app/src/main/kotlin/com/lattice/qr/MyApplication.kt`
- Initializes ApexHub SDK on app launch
- Schedules background update checks
- Reads keys from `BuildConfig` (loaded from `.env`)

### `android/app/src/main/kotlin/com/lattice/qr/MainActivity.kt`
- Entry point activity
- Runs foreground update checks
- Provides example event tracking for analytics
- Resumes pending installations on resume

### `android/settings.gradle.kts`
- Configures GitHub Packages repository for ApexHub SDK
- Uses `GITHUB_ACTOR` and `GITHUB_TOKEN` for authentication

## Common Issues

### ❌ "Could not authenticate with ApexHub repository"

**Fix:** Set GitHub credentials
```bash
export GITHUB_ACTOR=your_username
export GITHUB_TOKEN=your_token
```

### ❌ "ApexHub SDK not found"

**Fix:** Ensure your `.env` has correct keys and rebuild:
```bash
cd android
./gradlew clean build
cd ..
```

### ❌ "Permission denied: REQUEST_INSTALL_PACKAGES"

**Fix:** App needs `REQUEST_INSTALL_PACKAGES` permission for OTA installs. This is in AndroidManifest.xml.

### ❌ "Build fails with Java version error"

**Fix:** Ensure Java 11+
```bash
java -version
# Should show 11.x or later
```

## Next Steps

1. **Configure in ApexHub Console:**
   - Set app channel (stable/beta/nightly)
   - Configure update checks
   - Create your first release

2. **Test Updates:**
   - Build and run the app
   - Upload a new version to ApexHub
   - Watch the update check trigger

3. **Monitor Analytics:**
   - View events in ApexHub Console → Analytics
   - Track custom events with `trackEvent()`

4. **Deploy to Play Store:**
   ```bash
   cd android
   ./gradlew bundleRelease
   # Upload app-release.aab to Google Play Console
   ```

## Support

- **ApexHub Docs:** https://apexhub.app/docs
- **ApexHub Console:** https://apexhub.app/console
- **This Repository:** https://github.com/Mr-Perfect-252/QR
- **Android SDK Repo:** https://github.com/Mr-Perfect-252/apexhub-android-sdk

## License

MIT © Lattice QR Studio
