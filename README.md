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
- **Official brand mark** — the real Kangal Games logo (dog-head emblem +
  wordmark) is used across the site, favicon, and app icons. A vector SVG
  fallback emblem is also included in `Logo.jsx` for places a raster mark
  isn't ideal.
- **Playable demo — _Kangal: Night Watch_** — a modern vector-art canvas action
  game embedded in the site (Demo section) and available fullscreen at
  `game.html`. Guard the moonlit steppe: move (WASD / arrows / touch joystick),
  bark to knock wolves back (Space / on-screen button), and grab **bones & meat**
  to heal. Glow, particles, screen shake, escalating waves, localStorage best.
- **Installable on phones** — the game is a **PWA** (Add to Home Screen on
  iOS/Android) and pre-wired with **Capacitor** for native `.apk` / `.ipa`
  builds. See **[MOBILE.md](MOBILE.md)**.

## 🖼️ Brand logo

The official Kangal Games logo (`logo.png` in `public/`) is the studio's
proprietary artwork and is used site-wide — hero, nav, favicon, and the
generated PWA/app icons in `public/icons/` (192, 512, maskable, Apple touch).

A vector `KangalEmblem` fallback still lives in `src/Logo.jsx` for contexts
where a lightweight SVG mark is preferable, but it should stay visually
consistent with the official logo rather than be treated as a separate brand.

**Note:** this logo and all related artwork are © Kangal Games — see
[License & rights](#-license--rights) below before reusing or redistributing.

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
  logo.png              Official Kangal Games logo (© all rights reserved)
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

## © License & rights

This repository contains the source code for the Kangal Games marketing site
and demo game. Unless otherwise noted:

- **Code** in this repository is provided for internal use by Kangal Games and
  its collaborators only. No open-source license is granted.
- **All logos, brand marks, artwork, game assets, character art, audio, and
  visual design** (including but not limited to the Kangal Games emblem,
  wordmark, app icons, and the *Kangal: Night Watch* game art) are the
  exclusive property of Kangal Games. **All rights reserved.**
- None of the above may be copied, reproduced, modified, distributed, or used
  in other projects — commercial or non-commercial — without prior written
  permission from Kangal Games.

For permissions or licensing inquiries, please contact Kangal Games directly.

---

© Kangal Games. All rights reserved. — Loyal to the craft, fearless in the making.
