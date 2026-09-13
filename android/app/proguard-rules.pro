# ApexHub SDK — keep public API surface used via reflection / WorkManager.
-keep class com.apexhub.sdk.** { *; }

# WorkManager workers are instantiated by name.
-keep class * extends androidx.work.ListenableWorker { *; }

# Kotlin coroutines.
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
