package com.lattice.qr

import android.app.Application
import android.util.Log
import androidx.lifecycle.lifecycleScope
import com.apexhub.sdk.ApexHubConfig
import com.apexhub.sdk.ApexHubUpdater
import kotlinx.coroutines.launch

/**
 * Application class that initializes ApexHub SDK for:
 * - OTA Updates: Periodic background checks & user prompts
 * - Analytics: Track app events & performance
 * - Crash Reporting: Monitor production issues
 */
class MyApplication : Application() {

    companion object {
        private const val TAG = "Lattice"
    }

    override fun onCreate() {
        super.onCreate()

        try {
            // Initialize ApexHub SDK with configuration from BuildConfig
            val publicKey = BuildConfig.APEXHUB_PUBLIC_KEY
            val channel = BuildConfig.APEXHUB_CHANNEL
            val checkInterval = BuildConfig.APEXHUB_CHECK_INTERVAL_HOURS

            if (publicKey.isEmpty() || publicKey == "pk_live_") {
                Log.w(TAG, "ApexHub public key not configured. Update checks disabled.")
                return
            }

            val updater = ApexHubUpdater(
                context = this,
                config = ApexHubConfig(
                    publicKey = publicKey,
                    channel = channel,
                    checkIntervalHours = checkInterval,
                )
            )

            // Schedule silent background checks
            // Posts a notification when an update is found
            updater.schedulePeriodicCheck(appDisplayName = "Lattice QR")

            Log.d(TAG, "ApexHub SDK initialized successfully")
            Log.d(TAG, "Channel: $channel, Check interval: ${checkInterval}h")

        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize ApexHub SDK", e)
        }
    }
}
