# Nanaksar Dhaba — Image Performance & UI Fluidity Implementation Plan (Revised)

**Target Problem:** Very slow image loads (~66 MB unique served PNG payload) and UI scrolling/drawer lag.  
**Review Status:** Revised to incorporate all 7 critical findings and the 6-gate verification protocol from `Critique/implementation-plan-review.md`.  
**Destination:** Production deployment readiness for Nanaksar Dhaba Flagship.

---

## 1. Reconciled Benchmark Matrix (Honest, Verified Math)

| Surface / Metric | Current Measured State | Target Budget | Acceptance Range | Method / Proof |
| :--- | :--- | :--- | :--- | :--- |
| **Repo Raw Assets (Triplicated)** | 130.3 MB (53 PNGs) | ~6 MB | Archive/Dedupe | Disk inspection |
| **Served Unique Payload** | **~66 MB** (20 unique menu dishes @ 56 MB + ~10 MB brand) | **< 4.5 MB** | 3.0–4.8 MB (~93–95% cut) | `public/assets/` size sum |
| **Homepage Cold Transfer** | **~38 MB** | **< 1.5 MB** | 1.1–1.6 MB | DevTools Network, disabled cache |
| **Menu Explorer Cold Transfer** | **~56 MB** (20 unique files, cached repeats) | **< 2.5 MB** | 1.8–2.8 MB | DevTools Network, first grid |
| **Static Build (`dist/`)** | **68.98 MB** | **< 6.0 MB** | < 6.0 MB | `npm run build` output |
| **Favicon Weight** | **1.54 MB** (`Logo.png`) | **< 5 KB** | 2–5 KB | `<link rel="icon">` request |
| **OG Image** | 1.80 MB PNG (`New-Back.png`) | **80–130 KB** | 1200×630 JPG (crawlers compliant) | WhatsApp / FB validator |
| **Cart Drawer Open FPS** | Frozen (sync decode of 2.8 MB PNGs) | **60 FPS** | Zero frames > 50 ms | DevTools Performance trace |
| **Scroll Jank (Outlets Stack)** | Repaint on every scroll frame (`filter`) | **Composited** | Zero `filter` repaint cycles | DevTools Rendering lane |

---

## 2. Per-Asset Acceptance Budget Table

Any generated asset falling outside these ranges fails the build:

| Asset Class | Dimensions | Format | Quality | Budget Range | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Menu Dish Cards (20 unique)** | 700×560 / 700×700 | WebP | q75 | **45–100 KB** | Visual QA: no banding on ghee/gravy at 2x |
| **Cart Thumbnails (`thumbs/`)** | 120×120 square crop | WebP | q80 | **5–12 KB** | Retina 2x for 60px/40px slots |
| **Hero Desktop** | 1600×900 | WebP | q80 | **100–170 KB** | Source `BB.png` (1672×941) |
| **Hero Mobile** | 768×600 | WebP | q78 | **40–70 KB** | Fast mobile LCP variant |
| **Founder Portrait** | 800×650 | WebP | q80 | **55–85 KB** | Story section |
| **Brand Logo Lockup** | 280×280 (Retina 2x) | WebP | q85 | **< 25 KB** | Clean edges, zero fuzziness |
| **Brand Typography** | 480w | WebP | q85 | **< 18 KB** | Header lockup |
| **Favicon** | 32×32 | PNG | — | **< 5 KB** | Standard browser icon |
| **Apple Touch Icon** | 180×180 | PNG | — | **< 25 KB** | iOS home screen bookmarks |
| **OG Social Share Cover** | 1200×630 | JPEG | q75 | **80–130 KB** | Universal WhatsApp/FB/iMessage support |

---

## 3. Step-by-Step Implementation Roadmap

### Phase 1: Automated Asset Optimization Pipeline (`scripts/optimize-images.py`)
Using Python 3.12 + Pillow 12.2.0:
1. **Menu Dishes:** Read all unique images in `public/assets/menu/`. Downscale to 700px width with Lanczos filter, save as `.webp` (q75, method 6).
2. **Cart Thumbnails (`public/assets/menu/thumbs/`):** Center-crop and downscale to 120×120 square, save as `.webp` (q80).
3. **Hero Standardization:**
   * Select `BB.png` (1672×941) as the authoritative master hero image.
   * Generate `hero-desktop.webp` (1600w, q80) and `hero-mobile.webp` (768w, q78).
   * Delete redundant, unused `Hero_background.png` (2.22 MB) and `Desired_hero.png` (2.14 MB) from `public/assets/`.
4. **Brand Assets:**
   * Downscale `Logo.png` to 280×280 `Logo.webp` (Retina 2x for 44px display) + `favicon-32x32.png` + `apple-touch-icon.png` (180×180).
   * Downscale `Brand_Name.png` to `Brand_Name.webp` (480w).
   * Convert `Founder.png` to 800w `Founder.webp`.
5. **OG Social Cover:**
   * Create `public/assets/og-cover.jpg` (1200×630 JPEG, q75) from `New-Back.png` for universal WhatsApp/Facebook crawler support. (Never use WebP for OG).

### Phase 2: Wiring Thumbnails & Fixing Cart Drawer (`src/components/CartDrawer.tsx`)
1. **Thumbnail Resolution:**
   * In `CartDrawer.tsx`, resolve cart thumbnail URLs via:
     ```tsx
     const thumbUrl = imageUrl ? imageUrl.replace('/assets/menu/', '/assets/menu/thumbs/').replace(/\.png$/, '.webp') : '';
     ```
   * Add `onError` fallback to main `imageUrl`.
2. **Hardcoded Accompaniments:**
   * Update `POPULAR_ACCOMPANIMENTS` image paths to use `/assets/menu/thumbs/*.webp`.
3. **Drawer Thumbnail Attributes:**
   * Change lines 346–347 & 446–447:
     ```tsx
     // Before
     loading="eager" decoding="sync"
     // After (8 KB thumb + eager load + async decode + explicit retina box)
     loading="eager" decoding="async" width={60} height={60}
     ```
   * *Rationale (reconciled):* Inside an already-open drawer, thumbs are in-viewport. `eager` avoids lazy pop-in, while `decoding="async"` + 8 KB file eliminates the main-thread freeze.

### Phase 3: Codebase Data References (`src/data/restaurantData.ts`)
* Update all 37 `image:` entries in `MENU_ITEMS` from `/assets/menu/*.png` to `/assets/menu/*.webp`.

### Phase 4: Main-Thread & GPU Compositor Smoothing
1. **OutletsStack (`src/components/OutletsStack.tsx`):**
   * Remove lines 23–24 (`filter: brightness(...)`).
   * Remove `filter` from `<motion.div style={{ scale, filter }} ...>`. Retain `scale` only.
   * Eliminates continuous repaint invalidation during scroll.
2. **Hero LCP Attributes (`src/components/Hero.astro`):**
   * Retain `fetchpriority="high"` and use `decoding="sync"` (or `auto`, **never** `async`).
   * Add explicit intrinsic dimensions: `width={1672} height={941}` to eliminate CLS.
   * Add responsive `<picture>` markup or mobile `srcset` using `hero-mobile.webp` and `hero-desktop.webp`.
3. **Island Deferral (`src/pages/index.astro`):**
   * Change `<SignaturesShowcase client:load />` and `<BestsellersShowcase client:load />` to `client:visible`.
   * Defers below-fold React component hydration until the user scrolls towards them, speeding up initial interactive paint.
4. **Marquee:**
   * Retain the existing design mask. Keep items transform-only.
5. **Component Dimensions & WebP Updates:**
   * Update `Header.tsx`, `Footer.astro`, and `HeritageStory.astro` to reference `.webp` assets with explicit `width` and `height`.
   * Update `SignaturesShowcase.tsx` and `BestsellersShowcase.tsx` with `decoding="async"` and explicit dimensions (`width={700} height={440}`).

### Phase 5: Shell & Astro Configuration
1. **Layout Head (`src/layouts/Layout.astro`):**
   * Replace `<link rel="icon" type="image/png" href="/assets/Logo.png" />` with:
     ```html
     <link rel="icon" type="image/png" href="/assets/favicon-32x32.png" />
     <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
     ```
   * Update OG tags to use JPEG:
     ```html
     <meta property="og:image" content="https://nanaksardhaba.com/assets/og-cover.jpg" />
     <meta property="og:image:width" content="1200" />
     <meta property="og:image:height" content="630" />
     ```
   * Add `<link rel="preload" as="image" href="/assets/hero-desktop.webp" type="image/webp" />`.
2. **Astro Config (`astro.config.mjs`):**
   * Update `prefetch: { prefetchAll: false, defaultStrategy: 'hover' }`.

---

## 4. Six-Gate Verification Protocol

Before declaring completion, every gate must pass:

1. **Gate 1: Build & Size Check**
   * `npm run build` succeeds cleanly.
   * `dist/` total folder size is **< 6.0 MB** (down from 68.98 MB).
   * No raw `.png` menu dishes remain inside `dist/assets/menu/` (only `.webp` and `thumbs/*.webp`).
2. **Gate 2: Per-Asset Size Range Conformance**
   * Check all generated files against the Acceptance Budget Table (§2). Zero assets exceed budget.
3. **Gate 3: Visual Fidelity QA**
   * Inspect 3 benchmark dishes (dark gravy: *Dal Makhani*, crisp texture: *Sev Tamatar*, complex thali: *Bhojan Thali*) at 2x zoom. Confirm zero banding or color shifts.
4. **Gate 4: Cart Drawer Fluidity**
   * Performance trace during cart open: confirm zero frames exceed 50 ms. Thumbs resolve from `thumbs/` directory.
5. **Gate 5: Scroll Performance**
   * DevTools Rendering lane: scroll past OutletsStack. Confirm zero repaint invalidations.
6. **Gate 6: Link & Open Graph Sharing**
   * Confirm `og:image` points to `og-cover.jpg` with valid 1200×630 dimensions. Favicon request transfers < 5 KB.
