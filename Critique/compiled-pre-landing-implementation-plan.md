# Compiled Master Implementation Plan: Pre-Landing ("The Threshold")

**Document:** Compiled Master Implementation Plan  
**Target:** Nanaksar Dhaba Web Experience  
**Source Synthesis:** Synthesized from user intake requirements and the expert architectural critique in `Critique/pre-landing-plan.md`.

---

## 1. Concept & Visual Hierarchy

**Name:** *The Threshold* (Nanaksar Dhaba Entry Ritual)  
**Canvas:** Full-viewport Obsidian `#0F0F0F` with matte radial hearth warmth (`#1A1206` to transparent, zero artificial blur).  
**Center Stack (Hermès / Rolex / Aman Ritual Order):**
1. **Heritage Seal (Who):** `/assets/Logo.webp` (280px master, rendered at ~112px display width, CLS 0, fade + 1.03 scale settle).
2. **Eyebrow Timestamp (Proof):** `ESTD. 1980 — INDORE` — Desi Ghee Amber `#E4A834`, `font-mono text-[11px] uppercase tracking-[0.25em]`.
3. **Wordmark (The House):** `/assets/Brand_Name.webp` (rendered sharp at 480w / `w-56 sm:w-72`).
4. **Hairline Gold Rule:** `h-px w-12 bg-[#E4A834]/40` with smooth CSS `scaleX(0 → 1)` draw.
5. **Belief Inscription (The Soul):** *“Ghar Jaisa Swad. Seva Wala Pyar.”* in `font-editorial italic text-[#F7F4EB]/90 text-lg sm:text-xl`.
6. **Primary Action (The Door):** **Enter the Dhaba →** — Solid tandoori crimson `bg-[#D01B1B] hover:bg-[#B81414]`, white `font-display text-xs uppercase font-bold tracking-wider rounded-xl min-h-[46px] px-8`.
7. **Whisper Proof Footer:** `5 OUTLETS · OPEN TILL 3 AM · 100% SHUDDH VEG` in `font-mono text-[10px] text-white/40 tracking-wider` + subtle inline `Skip` link.

---

## 2. Best-of-Breed Architecture: Dual-Mode Rollout

| Mode / Route | Description & Safety Guarantee |
| :--- | :--- |
| **Standalone Preview Route** (`/welcome`) | Standalone page with `noindex` meta tag. Allows 100% risk-free visual inspection, testing, and approval without modifying the main homepage behavior. |
| **Gated Overlay on Homepage** (`/`) | Client-side overlay in `src/pages/index.astro` guarded by `THRESHOLD_ENABLED = true`. Server always renders full homepage HTML immediately for zero SEO impact. |

### Smart Bypasses & Failsafes:
- **Session Intelligence:** Checks `sessionStorage.getItem('nanaksar_entered')`. If already set, overlay is suppressed instantly with zero flash.
- **Deep-Link Bypass:** `?skip=1` query parameter automatically skips the veil (essential for WhatsApp, Instagram, and Google Ad deep-links).
- **Keyboard & Escape Hatch:** `Esc` or clicking `Skip` instantly dismisses the overlay and moves focus to `<main>`.
- **Single-File Kill Switch:** `const THRESHOLD_ENABLED = true;` allows instant rollback to normal homepage behavior in 1 line.

---

## 3. Motion & Performance Budget (Pure CSS, <1.3s Total)

No bloated JS animation libraries. Executed via GPU-accelerated CSS keyframes with `animation-fill-mode: both`:

| Time (ms) | Element | Animation Effect | Duration |
| :--- | :--- | :--- | :--- |
| `0ms` | Seal (`Logo.webp`) | Fade + scale `1.03 → 1.0` | 700ms |
| `150ms` | Eyebrow (`ESTD. 1980 — INDORE`) | Fade + translateY `8px → 0` | 500ms |
| `300ms` | Wordmark (`Brand_Name.webp`) | Fade + translateY `8px → 0` | 600ms |
| `500ms` | Gold Rule | ScaleX `0 → 1` | 600ms |
| `650ms` | Tagline (*"Ghar Jaisa Swad..."*) | Fade + translateY `8px → 0` | 500ms |
| `800ms` | CTA (`Enter the Dhaba`) + Footer | Fade + translateY `8px → 0` | 500ms |
| `1000ms` | Quiet `Skip` link appears | Fade-in | 300ms |

- **Total Budget:** Total transfer **<150 KB** (Seal 22KB + Wordmark 21KB + CSS ~5KB).
- **CTA interactive at ~900ms**, complete visual settle at ~1.3s.
- **Accessibility:** `prefers-reduced-motion: reduce` renders all elements immediately with 0ms transition.

---

## 4. Proposed Changes & File Manifest

### Component Layer

#### [NEW] `src/components/Threshold.astro`
- Reusable Astro component accepting `mode: 'page' | 'overlay'`.
- Contains the ritual center stack, obsidian canvas, pure CSS keyframe styles, and inline `<script>` for `sessionStorage`, `?skip=1`, and key listeners.

### Page Routes Layer

#### [NEW] `src/pages/welcome.astro`
- Standalone preview route at `http://localhost:4321/welcome`.
- Renders `<Threshold mode="page" />` with `robots: noindex` meta tag for isolated testing.

#### [MODIFY] `src/pages/index.astro`
- Mount `<Threshold mode="overlay" />` at the top of the homepage template, protected by `THRESHOLD_ENABLED` toggle.

### Optimization Layer

#### [MODIFY] `src/layouts/Layout.astro`
- Add `<link rel="preload" href="/assets/Logo.webp" as="image" type="image/webp">` and `<link rel="preload" href="/assets/Brand_Name.webp" as="image" type="image/webp">` in `<head>` to ensure instantaneous, zero-CLS rendering.

---

## 5. Verification Plan

### Automated Build Verification
- Execute `npm run build` to confirm zero TypeScript, Astro, or static HTML generation errors.

### Functional Verification
1. Open `/welcome`: Verify isolated, pixel-perfect render across mobile (360px) and desktop (1440px).
2. Test motion sequence: Verify smooth 1.3s reveal and instant CTA readiness.
3. Test enter click & `Esc` key: Confirm seamless transition and unlock of body scroll.
4. Test session caching: Refreshing `/` suppresses the overlay; opening incognito re-engages the ritual.
5. Test `?skip=1`: Confirm query parameter immediately bypasses the overlay.
