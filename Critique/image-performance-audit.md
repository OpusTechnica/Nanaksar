# Image Slow-Load & Lag Audit — Nanaksar Live Site

**Date:** 2026-09-04
**Scope:** Read-only audit. No code edited.
**Site root:** `Project Nankasar` (Astro 5 + React + Tailwind)

---

## 1. Root Cause: Images are 10–30x too heavy

Measured in repo (`src/assets` + `public/assets`):

> **53x `.png` = 130.3 MB total, 2.5–3.05 MB each.**
> Only 4x `.webp` (0.2 MB) + 1x `.svg` in the whole project.

### Top offenders

| File | Size | Displayed at |
|---|---|---|
| `menu/bhojan-thali.png` | **3.05 MB** | ~400px card (`aspect-[16/10]`, `h-48`) |
| `menu/jagga-daku-soya-chaap.png` | **2.98 MB** | ~400px card |
| `menu/chur-chur-naan-stuffed.png` | **2.96 MB** | ~400px card |
| `menu/chur-chur-naan.png` | **2.92 MB** | ~400px card + 60px cart thumb |
| `menu/sev-tamatar-combo-kesar-halwa.png` | **2.92 MB** | ~400px card |
| `BB.png` (hero) | **1.80 MB** | fullscreen cover |
| `Hero_background.png` | **2.22 MB** | apparent unused duplicate |
| `Desired_hero.png` | **2.14 MB** | `public/assets` root |
| `Founder.png` | **1.93–1.98 MB** | story section |
| `Logo.png` | **1.54 MB** | `h-10 w-10` header + favicon |
| `Brand_Name.png` | **910 KB** | `h-8 w-auto` header |
| `New-Back.png` (og:image) | **1.80 MB** | social crawl |

True dimensions (sampled via PIL): `1254×1254` / `1402×1122` — served to a ~400px card and 60px thumbnail. ~7x over-resolution.

`dist/` = **69 MB / 58 files** — confirms full-res PNGs ship verbatim to production, no build-time compression.

### Triple duplication

Same ~3 MB file exists in 3 places:

- `Assets/Menu_images/`
- `src/assets/menu/`
- `public/assets/menu/`

Inflates repo, invites double-ship, makes future compression easy to miss in one copy.

### No modern image pipeline

- 0 WebP/AVIF for menu items, no `srcset` / `sizes`.
- No `astro:image` / `<Image />` — all plain `<img src={...}>` (`Hero.astro`, `SignaturesShowcase.tsx`, `BestsellersShowcase.tsx`, `MenuExplorer.tsx`, `CartDrawer.tsx`).

---

## 2. How images are loaded — why it feels laggy

### Hero / LCP (`src/components/Hero.astro:11-17`)

```astro
<img src={heroBg.src} loading="eager" fetchpriority="high" />
```

Intent is correct, but: 1.8 MB PNG, no `width`/`height` (CLS risk), no `<link rel="preload">`, no mobile variant (`object-[72%_center]` still downloads the full desktop file).

### Homepage below-fold (`SignaturesShowcase.tsx:48-53`, `BestsellersShowcase.tsx:57-62`)

12 cards × ~3 MB ≈ 36 MB if the user scrolls. Has `loading="lazy"` (good) but missing `decoding="async"` + missing `width`/`height`, plus `group-hover:scale-105 duration-500` on every image = repaint jank on scroll.

### Menu grid (`MenuExplorer.tsx:472-478`)

Has `loading="lazy" decoding="async"` (good) + 18-item windowing via IntersectionObserver (good) — but each item is still ~3 MB, so the first 18 ≈ 50 MB.

### Cart — worst lag source (`CartDrawer.tsx:343-347, 443-447`)

```tsx
<img loading="eager" decoding="sync" />
```

60px / 40px thumbnails force **synchronous decode of 3 MB PNGs on drawer open** — blocks the main thread and freezes the slide animation. Should be the opposite: `lazy` + `async`.

---

## 3. Non-image lag multipliers

1. `astro.config.mjs:8-11` — `prefetch: { prefetchAll: true }` + `ClientRouter fallback="swap"` (`Layout.astro:48`) = hovering any link prefetches full pages and their 3 MB images.
2. `Layout.astro:84,92` — `Header client:load` + `CartDrawer client:load` + `transition:persist` = React + cart store on the critical path, delays LCP.
3. `OutletsRibbon.astro:5` — `backdrop-blur-md` over scrolling content + many `shadow-[0_20px…]` + `hover:scale` = compositing cost on low-end mobiles.
4. Fonts (`Layout.astro:32-35`) — 4 families (Cinzel + Cormorant Garamond + JetBrains Mono + Plus Jakarta Sans in many weights) render-blocking, no subset tuning.
5. `Logo.png` 1.54 MB used as `<link rel="icon">` (`Layout.astro:27`) — every first visit pays 1.5 MB before the tab even renders.

---

## 4. Severity ranking / recommended fix order

1. **P0 — Re-encode menu + hero:** WebP/AVIF at 800w + 400w + `srcset`, target ~80–150 KB each. Expected: 130 MB → ~5 MB (~95% cut). Single biggest win for slow load.
2. **P0 — Cart thumbs:** `CartDrawer` `eager/sync` → `lazy/async`, add explicit `width`/`height`. Fixes drawer-open freeze.
3. **P1 — Hero + brand:** preload compressed hero WebP, add dimensions, ship a 768w mobile variant. Logo/Brand as SVG or <50 KB WebP; stop using 1.5 MB PNG as favicon.
4. **P1 — Delivery:** turn off `prefetchAll`, dedupe `Assets/` vs `src/` vs `public/`, enable Astro image optimization so `dist/` stops shipping 69 MB.
5. **P2 — Scroll jank:** reduce hover-scale / blur on the scroll path, defer non-critical React islands to `client:visible` / `client:idle`.

---

## 5. Evidence / file references

- Sizes: `public/assets/menu/*.png`, `src/assets/menu/*.png`, `src/assets/BB.png`, `public/assets/Logo.png`, `public/assets/New-Back.png`
- Usage: `src/components/Hero.astro`, `src/components/SignaturesShowcase.tsx`, `src/components/BestsellersShowcase.tsx`, `src/components/MenuExplorer.tsx`, `src/components/CartDrawer.tsx`
- Shell: `src/layouts/Layout.astro`, `src/pages/index.astro`, `astro.config.mjs`, `src/data/restaurantData.ts` (all `image: '/assets/menu/…'` paths)
