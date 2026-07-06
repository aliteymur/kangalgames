# 🐺 Kangal Games — Website

The official website for **Kangal Games**, an independent game studio building
bold, high-craft games — mobile-first, with AA and (one day) AAA ambitions.
Named after the Anatolian Kangal: loyal, strong, unshakeable.

Built with **React + Vite (JavaScript)** in a modern, cinematic dark style.

## ✨ Features

- **Modern cinematic design** — deep dark theme, warm gold/tan accents, layered
  radial glows, subtle film grain, `Space Grotesk` + `Inter` typography.
- **Scroll-reveal animations** — sections fade up as they enter the viewport
  (respects `prefers-reduced-motion`).
- **Honest content** — no invented games. A studio intro, a "what we make"
  ladder (Mobile → AA → AAA), a real roadmap, values, and a contact CTA.
- **Fully responsive** — sticky glass navbar with a mobile menu.
- **Vector brand mark** — a clean SVG Kangal emblem + wordmark (no image assets
  required). Easy to swap for your official logo.
- **Playable demo — _Kangal: Night Watch_** — a modern vector-art canvas action
  game embedded in the site (Demo section) and available fullscreen at
  `game.html`. Guard the moonlit steppe: move (WASD / arrows / touch joystick),
  bark to knock wolves back (Space / on-screen button), and grab **bones & meat**
  to heal. Glow, particles, screen shake, escalating waves, localStorage best.
- **Installable on phones** — the game is a **PWA** (Add to Home Screen on
  iOS/Android) and pre-wired with **Capacitor** for native `.apk` / `.ipa`
  builds. See **[MOBILE.md](MOBILE.md)**.

## 🖼️ Using your own logo

The hero and nav use a built-in vector emblem so the site looks complete out of
the box. To use your official logo art instead:

1. Drop your file into `public/` as `logo.png` (or `logo.svg`).
2. In `src/App.jsx`, find the hero `<KangalEmblem size={340} />` and replace it
   with:
   ```jsx
   <img src="/logo.png" alt="Kangal Games" style={{ maxWidth: '100%' }} />
   ```
3. (Optional) Do the same in the nav `LogoLockup` if you want the raster mark there too.

## 🗂️ Project structure

```
index.html            Marketing site shell, fonts, SEO/OG + PWA meta
game.html             Standalone fullscreen game (PWA start page / app entry)
favicon.svg           Kangal emblem favicon
capacitor.config.json Native (iOS/Android) app config
MOBILE.md             How to install as a PWA and build .apk / .ipa
public/
  manifest.webmanifest  PWA install metadata
  sw.js                 Service worker (offline cache)
  icons/                Generated app icons (192/512/maskable/apple)
  (drop your logo.png here)
src/
  main.jsx            Site entry (+ native redirect to the game)
  game-main.jsx       Standalone game entry
  App.jsx             Page layout & all sections
  GuardianGame.jsx    The playable canvas game
  Logo.jsx            Vector Kangal emblem + wordmark components
  useReveal.js        IntersectionObserver scroll-reveal hook
  pwa.js              Service-worker registration
  index.css           Modern cinematic theme + game styles
```

## 🚀 Getting started

```bash
npm install     # install dependencies
npm run dev     # dev server -> http://localhost:5173
npm run build   # production build -> dist/
npm run preview # preview the production build
```

Requires [Node.js](https://nodejs.org) 18+.

## 🛠️ Tech

- [React 18](https://react.dev)
- [Vite 5](https://vitejs.dev)
- Plain JavaScript, inline SVG, CSS (no UI framework)

---

© Kangal Games — Loyal to the craft, fearless in the making.
