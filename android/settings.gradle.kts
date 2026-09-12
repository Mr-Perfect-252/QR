pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        
        // ApexHub SDK Repository
        maven {
            url = uri("https://maven.pkg.github.com/Mr-Perfect-252/apexhub-android-sdk")
            credentials {
                // Use GitHub token for authentication
                // Set via: export GITHUB_ACTOR=your_username
                //          export GITHUB_TOKEN=your_personal_access_token
                username = (System.getenv("GITHUB_ACTOR") ?: "")
                password = (System.getenv("GITHUB_TOKEN") ?: "")
            }
        }
    }
}

rootProject.name = "Lattice QR"
include(":app")
