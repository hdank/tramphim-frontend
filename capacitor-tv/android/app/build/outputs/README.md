This directory is used as the Gradle outputs location for APKs during CI.

If Gradle produces APKs they will appear under `apk/` subfolders. The `.gitkeep` exists to ensure the path is present so artifact upload steps that expect the path do not fail due to missing directories.

Do NOT commit actual APK binaries here unless you intend to version them.


