# 📱 Playing & shipping "Kangal: Night Watch" on phones

There are **two ways** to get the demo onto iPhone / Android. You already have
#1 working with zero extra tooling; #2 is for real App Store / Play Store builds.

---

## 1) Install as a web app (PWA) — works right now, no store, no Mac

The game is a **Progressive Web App**. Once the site is hosted over HTTPS
(e.g. Netlify, Vercel, GitHub Pages, your own server), anyone can install it:

**iPhone / iPad (Safari)**
1. Open the game page: `https://your-domain/game.html`
2. Tap the **Share** button → **Add to Home Screen**
3. It installs with the Kangal icon and launches fullscreen, no browser bar.

**Android (Chrome)**
1. Open `https://your-domain/game.html`
2. Tap the **⋮ menu** → **Install app** (or the "Add to Home screen" prompt)
3. Launches fullscreen and works offline.

> The service worker (`public/sw.js`) caches the game so it runs offline after
> the first load. The install metadata lives in `public/manifest.webmanifest`.

To try it locally over HTTPS you need a tunnel (PWA install needs HTTPS):
```bash
npm run build && npm run preview   # serves http://localhost:4173
# then expose it with a tunnel (ngrok/cloudflared) to get an https URL
```

---

## 2) Native app (.apk / .aab / .ipa) via Capacitor

The project is pre-wired with **[Capacitor](https://capacitorjs.com)**, which
wraps the built web app into real native iOS/Android projects. The final binary
must be built on your own machine — Android needs **Android Studio**, iOS needs
a **Mac with Xcode** and an **Apple Developer account** (these SDKs/signing
certs can't run in a cloud sandbox).

> When launched inside the native shell, the app opens straight into the game
> (see the Capacitor redirect in `src/main.jsx`).

### One-time setup
```bash
npm install                 # installs Capacitor (already in package.json)
```

### Android → .apk / .aab  (needs Android Studio + JDK 17)
```bash
npm run android:add         # creates the native android/ project (first time only)
npm run android:open        # builds web, syncs, opens Android Studio
```
Then in Android Studio:
- **Build ▸ Build APK(s)** → produces a debug `app-debug.apk` you can sideload.
- **Build ▸ Generate Signed Bundle / APK** → a signed `.aab` for Google Play.

Or fully from the CLI (after `android:add`):
```bash
npm run build && npx cap sync android
cd android && ./gradlew assembleDebug     # -> android/app/build/outputs/apk/debug/app-debug.apk
```

### iOS → .ipa  (needs a Mac + Xcode + Apple Developer account)
```bash
npm run ios:add             # creates the native ios/ project (first time only)
npm run ios:open            # builds web, syncs, opens Xcode
```
Then in Xcode: pick your Team under **Signing & Capabilities**, choose a device,
and **Product ▸ Archive** → **Distribute App** to export an `.ipa` / upload to
App Store Connect.

### App identity (edit before publishing)
`capacitor.config.json`:
```json
{ "appId": "com.kangalgames.nightwatch", "appName": "Kangal Night Watch" }
```
Change `appId` to your real reverse-domain bundle id and set app icons /
splash screens with `@capacitor/assets` (`npx @capacitor/assets generate`).

---

## Which should I use?
| | PWA (Add to Home Screen) | Capacitor native |
| --- | --- | --- |
| Cost | Free, instant | Play $25 once / Apple $99/yr |
| Needs a Mac | No | Yes (for iOS only) |
| App stores | No | Yes |
| Offline | Yes | Yes |
| Best for | Demos, quick sharing | A real published product |

For a demo to show people, the **PWA is the fastest path**. When you're ready to
publish to the stores, use the Capacitor route.
