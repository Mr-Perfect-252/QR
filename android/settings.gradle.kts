pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
    plugins {
        id("com.android.application") version "8.4.0"
        id("org.jetbrains.kotlin.android") version "1.9.24"
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // The ApexHub SDK (io.github.mr-perfect-252:sdk) is published to Maven
        // Central, so no extra repository or credentials are required.
    }
}

rootProject.name = "Lattice QR"
include(":app")
