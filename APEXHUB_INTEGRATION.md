# ApexHub SDK Integration Guide

This document explains how the ApexHub Android SDK has been integrated into the Lattice QR Studio app for OTA updates, analytics, and crash reporting.

## Overview

The ApexHub SDK provides:
- **OTA Updates**: Automatically check for and install app updates
- **Analytics**: Track user events and app performance
- **Crash Reporting**: Monitor and debug production crashes
- **Background Checks**: Periodic update checks even when app is closed

## Setup Instructions

### 1. Get Your ApexHub Keys

1. Go to [ApexHub Console](https://apexhub.app/console)
2. Select your app → **Settings** tab
3. Copy your **Public Key** (starts with `pk_live_`)
4. Copy your **App ID** (starts with `app_`)

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your keys
APEXHUB_PUBLIC_KEY=pk_live_YOUR_PUBLIC_KEY_HERE
APEXHUB_APP_ID=app_YOUR_APP_ID_HERE
APEXHUB_CHANNEL=stable
APEXHUB_CHECK_INTERVAL_HOURS=6
```

### 3. Android Build Configuration

The ApexHub SDK requires:
- Android 6.0+ (API 23+)
- Install permissions: Add to `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

> **Note**: The SDK's manifest merges these automatically. No manual action needed.

### 4. Initialize in Your App

Update your app initialization (in `android/app/src/main/java/...Application.kt`):

```kotlin
import com.apexhub.sdk.ApexHubUpdater
import com.apexhub.sdk.ApexHubConfig

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Read keys from environment
        val publicKey = BuildConfig.APEXHUB_PUBLIC_KEY
        val checkInterval = BuildConfig.APEXHUB_CHECK_INTERVAL_HOURS.toInt()
        
        val updater = ApexHubUpdater(
            context = this,
            config = ApexHubConfig(
                publicKey = publicKey,
                channel = "stable",
                checkIntervalHours = checkInterval,
            )
        )
        
        // Schedule silent background checks
        updater.schedulePeriodicCheck(appDisplayName = "Lattice QR")
    }
}
```

### 5. Foreground Update Check (MainActivity)

In your React Native entry point or main activity:

```kotlin
import com.apexhub.sdk.ApexHubUpdater

class MainActivity : ReactActivity() {
    private lateinit var updater: ApexHubUpdater
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val publicKey = BuildConfig.APEXHUB_PUBLIC_KEY
        updater = ApexHubUpdater(
            context = this,
            config = ApexHubConfig(publicKey = publicKey)
        )
        
        // Check for updates on app launch
        lifecycleScope.launch {
            updater.checkAndPrompt(activity = this@MainActivity)
        }
    }
    
    override fun onResume() {
        super.onResume()
        // Resume pending installations if user granted permissions
        ApkInstaller.resumePendingInstall(this)
    }
}
```

## Custom UI

You can override the default update dialog with custom UI:

```kotlin
lifecycleScope.launch {
    updater.checkAndUpdate(
        activity = this@MainActivity,
        onUpdateFound = { info ->
            // Show your own dialog
            showCustomUpdateSheet(
                info.latestVersion,
                info.releaseNotes
            )
            return@checkAndUpdate true // Proceed with download
        },
        onProgress = { percent ->
            progressBar.progress = percent
            progressText.text = "Downloading... $percent%"
        },
        onError = { message ->
            Log.e("ApexHub", "Update check failed: $message")
        }
    )
}
```

## Analytics

Track custom events for user engagement:

```kotlin
updater.trackEvent(
    appId = BuildConfig.APEXHUB_APP_ID,
    eventType = "custom",
    eventName = "qr_generated",
    metadata = mapOf(
        "qr_size" to "256px",
        "format" to "PNG",
        "content_length" to 50
    )
)
```

Events appear in ApexHub Console → **Analytics** tab in real-time.

## Update Strategies

Configure how users receive updates:

| Strategy | Behavior |
|---|---|
| `FLEXIBLE` (default) | User can tap "Later" and continue using the app |
| `IMMEDIATE` | Non-dismissible dialog (use for critical security patches only) |

## Troubleshooting

### SDK not checking for updates
- Verify `APEXHUB_PUBLIC_KEY` is correct
- Ensure internet permission is granted
- Check device has internet connectivity
- Verify update interval hasn't been set too high

### Analytics not appearing
- Confirm `APEXHUB_APP_ID` is correct
- Check network requests in Android Studio Profiler
- Verify events are being tracked before app closes

### Installation fails
- Ensure `REQUEST_INSTALL_PACKAGES` permission is granted
- Check app has write access to device storage
- Verify downloaded APK is valid before installation

## References

- [ApexHub Documentation](https://apexhub.app/docs)
- [ApexHub Console](https://apexhub.app/console)
- [SDK Release Notes](./RELEASE_NOTES.md)
- [Android SDK GitHub](https://github.com/Mr-Perfect-252/apexhub-android-sdk)
