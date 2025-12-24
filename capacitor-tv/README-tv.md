TramPhim TV — Capacitor project

This folder contains a separate Capacitor configuration for the Android TV build.

Quick setup (local machine):

- Install Capacitor globally if you don't have it:
  - `npm install -g @capacitor/cli`
- From repository root (`tramphim-frontend`), build the web assets:
  - `npm run build`
- From this folder (`tramphim-frontend/capacitor-tv`) run:
  - `npx cap init --web-dir="../dist" com.tramphim.tv TramPhimTV` (only if you didn't create the project via the repo files)
  - `npx cap add android`
  - `npx cap sync android`

Notes:
- This project is intentionally separate from the existing mobile Capacitor project (do not modify `android/` at the repo root).
- After you `npx cap add android` a native Android project will be created under `capacitor-tv/android` — edit `android/app/src/main/AndroidManifest.xml` to include TV-specific flags (leanback launcher, uses-feature).

Repository helper scripts:

- From the `tramphim-frontend` root you can run:
  - `npm run tv:build` — builds the web assets (same as `npm run build`)
  - `npm run tv:cap-add-android` — creates the native Android project inside `capacitor-tv` (runs `npx cap add android` inside the folder)
  - `npm run tv:cap-sync` — syncs web assets to the Capacitor TV android project

Example:

```
npm run tv:build
cd capacitor-tv
npx cap add android
npx cap sync android
```


