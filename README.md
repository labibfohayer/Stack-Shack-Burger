# 🍔 Stack Shack - Pixel-Perfect Burger Restaurant Replica

A faithful, reverse-engineered replica of the [Webild Burger Restaurant Template](https://www.webild.io/templates/burger-restaurant) ("Stack Shack").

Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **Lenis** smooth scrolling.

---

## 🚀 Features

- **Exact Component Architecture:** 100% matched DOM hierarchy, styling, and animations.
- **Interactive Burger Loader:** Dropping patty physics with animated curved SVG curtains (`LoaderStackLayers`).
- **Organic Blob Buttons:** Custom SVG-like morphed border radii (`data-button="blob"`) with smooth cubic bezier transitions.
- **WaveEdge Fluid Dynamics:** Mathematical cosine-interpolated wave curves responding to scroll and time.
- **Parallax Photo Band & Cutout Layers:** Dynamic SVG clipping masks and multi-depth scroll parallax.
- **Interactive Austin Trail Map:** Traveling delivery icon tracking along an SVG spline road with stop reveals.
- **Physics Juggling Footer:** Floating food items tossed continuously into the air with random trajectory physics.
- **Centralized Data Store:** All content, menus, locations, and copy isolated in [restaurantData.ts](file:///home/labib-fohayer/.gemini/antigravity/scratch/burger-restaurant-replica/data/restaurantData.ts) for effortless editing.

---

## 🛠️ Getting Started

```bash
# 1. Enter the project folder
cd /home/labib-fohayer/.gemini/antigravity/scratch/burger-restaurant-replica

# 2. Run the development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

To build for production:
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
burger-restaurant-replica/
├── app/
│   ├── globals.css          # Design tokens, variables & typography imports
│   ├── layout.tsx           # SEO metadata, font links & smooth scroll provider
│   └── page.tsx             # Master page assembly
├── components/
│   ├── LoaderStackLayers.tsx
│   ├── NavbarPillMenu.tsx
│   ├── HeroPopTrio.tsx
│   ├── FeaturesMascotClaims.tsx
│   ├── StatementWavePhoto.tsx
│   ├── StatementCutoutLayers.tsx
│   ├── FeaturesTrailStops.tsx
│   ├── StatementStickerCta.tsx
│   ├── FooterJuggleWordmark.tsx
│   ├── SmoothScroll.tsx
│   └── primitives/
│       ├── Media.tsx
│       ├── PopWords.tsx
│       ├── MaskedLineReveal.tsx
│       ├── WaveEdge.tsx
│       ├── PeelSticker.tsx
│       ├── NudgeOnLeave.tsx
│       └── TextRoll.tsx
├── data/
│   └── restaurantData.ts    # Centralized editable content store
├── public/
│   ├── images/              # All 23 high-res webp assets
│   └── favicon.svg
├── reference/               # Original full-page reference screenshots (1440, 768, 375)
├── verification/            # Replica full-page verification screenshots (1440, 768, 375)
├── ANALYSIS.md              # Deep technical teardown and token specifications
└── FINAL_REPORT.md          # Comprehensive audit and verification report
```
