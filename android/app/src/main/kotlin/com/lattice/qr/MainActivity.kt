package com.lattice.qr

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.apexhub.sdk.ApexHubConfig
import com.apexhub.sdk.ApexHubUpdater
import kotlinx.coroutines.launch

/**
 * MainActivity - Entry point for the Lattice QR Studio app
 * 
 * Handles:
 * - Foreground update checks on app launch
 * - Resuming pending installations
 * - Custom analytics tracking
 */
class MainActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "Lattice"
    }

    private lateinit var updater: ApexHubUpdater

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initializeApexHub()
    }

    private fun initializeApexHub() {
        try {
            val publicKey = BuildConfig.APEXHUB_PUBLIC_KEY

            updater = ApexHubUpdater(
                context = this,
                config = ApexHubConfig(publicKey = publicKey)
            )

            // Check for updates on app launch
            // Shows dialog if update is available
            lifecycleScope.launch {
                updater.checkAndPrompt(activity = this@MainActivity)
            }

        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize ApexHub in MainActivity", e)
        }
    }

    override fun onResume() {
        super.onResume()

        // The ApexHub SDK resumes any pending installation internally once the
        // user returns from granting the "install unknown apps" permission, so
        // no manual call is required here.
    }

    /**
     * Example: Track a custom event when QR code is generated
     */
    fun trackQRGenerated(size: Int, format: String, contentLength: Int) {
        try {
            lifecycleScope.launch {
                updater.trackEvent(
                    appId = BuildConfig.APEXHUB_APP_ID,
                    eventType = "custom",
                    eventName = "qr_generated",
                    metadata = mapOf(
                        "qr_size" to size.toString(),
                        "format" to format,
                        "content_length" to contentLength.toString()
                    )
                )
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to track event", e)
        }
    }

    /**
     * Example: Handle custom update UI
     */
    private suspend fun checkAndUpdateCustomUI() {
        try {
            updater.checkAndUpdate(
                activity = this,
                onUpdateFound = { info ->
                    // Show your own dialog with version & release notes
                    Log.d(TAG, "Update available: ${info.latestVersion}")
                    Log.d(TAG, "Release notes: ${info.releaseNotes}")
                    true // Proceed with download
                },
                onProgress = { percent ->
                    Log.d(TAG, "Download progress: $percent%")
                },
                onError = { message ->
                    Log.e(TAG, "Update check failed: $message")
                }
            )
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check updates with custom UI", e)
        }
    }
}
