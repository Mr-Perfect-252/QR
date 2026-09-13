plugins {
    id("com.android.application")
    id("kotlin-android")
}

android {
    namespace = "com.lattice.qr"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.lattice.qr"
        minSdk = 23
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        // ApexHub SDK Configuration (injected from environment / .env at build time).
        // See .env.example for the full list of supported variables.
        buildConfigField("String", "APEXHUB_PUBLIC_KEY", "\"${System.getenv("APEXHUB_PUBLIC_KEY") ?: "pk_live_"}\"")
        buildConfigField("String", "APEXHUB_APP_ID", "\"${System.getenv("APEXHUB_APP_ID") ?: "app_"}\"")
        buildConfigField("String", "APEXHUB_CHANNEL", "\"${System.getenv("APEXHUB_CHANNEL") ?: "stable"}\"")
        // NOTE: ApexHubConfig.checkIntervalHours is a Long, so this field must be `long` (with an L suffix).
        buildConfigField("long", "APEXHUB_CHECK_INTERVAL_HOURS", "${System.getenv("APEXHUB_CHECK_INTERVAL_HOURS") ?: "6"}L")
        buildConfigField("boolean", "APEXHUB_DEBUG", System.getenv("APEXHUB_DEBUG")?.toBoolean()?.toString() ?: "false")
    }

    buildFeatures {
        // Required by AGP 8+ for buildConfigField(...) to generate BuildConfig.
        buildConfig = true
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }
}

dependencies {
    // ApexHub SDK — OTA updates, analytics & crash reporting (Maven Central).
    implementation("io.github.mr-perfect-252:sdk:1.0.0")
    
    // Core Android
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.9.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Lifecycle
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1")
    
    // WorkManager (required by ApexHub for background checks)
    implementation("androidx.work:work-runtime-ktx:2.8.1")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
