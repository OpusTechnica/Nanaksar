# Pre-Landing ("The Threshold") — Detailed Plan

**Status:** Plan only. No code touched.
**Goal:** A premium, exclusive entry ritual worthy of a heritage house — one room, one idea, one door — that frames price, masks load, and routes visitors into the main site.
**Non-goals:** No menu, no prices, no offers, no slider, no funnel. No gating of SEO or return visitors.

---

## 1. Concept lock

**Name:** The Threshold.
**Canvas:** Full-viewport obsidian `#0F0F0F` (Zone 2 hearth token), faint radial ember warmth (matte, no glow token violation).
**Center stack (exact order):**
1. `Logo.webp` seal — fade + 1.03 settle.
2. `ESTD. 1980 — INDORE` — amber `#E4A834`, mono 11px, tracking `0.25em` (matches §4.1 eyebrow rule).
3. `Brand_Name.webp` wordmark.
4. Thin rule `#E4A834/40`, 48px, draws outward (scaleX 0→1).
5. Editorial italic (Cormorant): *"Ghar Jaisa Swad. Seva Wala Pyar."*
6. Single CTA: **Enter the Dhaba →** — solid crimson `#D01B1B`, white `display` uppercase 12px, `rounded-xl`, `min-h-[46px]`.
7. Whisper footer: `5 OUTLETS · OPEN TILL 3 AM · 100% SHUDDH VEG` — white/40, mono 10px. Quiet `Skip` text-link (same line or corner).

**Why this order:** seal (who) → date (proof) → name (house) → belief (soul) → door (action). Matches Hermès/Rolex/Aman ritual grammar.

---

## 2. Routes & gating (SEO-safe)

| Phase | Route | Behavior |
|---|---|---|
| **Preview (build first)** | `/welcome` | Standalone page, `noindex`. Main site untouched. Share link for approval. |
| **Gate (only after A/B sign-off)** | `/` shows Threshold once per session, then main content | Implemented via `sessionStorage.nanaksar_entered`: if set → render homepage immediately; else render Threshold overlay that swaps to homepage on Enter/Skip. Homepage keeps `/` URL — zero SEO URL change. |

**Rules:**
- Repeat visit / back button in same session → no ritual.
- `?skip=1` forces homepage (for ads/WhatsApp deep links).
- Crawlers: homepage HTML always server-rendered; Threshold is a client-side overlay layer, never a redirect. `og:image` stays `og-cover.jpg`.
- Kill switch: one flag `THRESHOLD_ENABLED` in one file → revert to plain homepage in 1 commit.

---

## 3. Design spec (system-pure)

| Element | Token / value | Notes |
|---|---|---|
| BG | `#0F0F0F`, radial `#1A1206 → transparent` 60% | Matte warmth, no blur-glow |
| Seal | `Logo.webp` 280px (2x), `~112px` display | Preloaded; `width/height` set (CLS 0) |
| Eyebrow | mono 11px, `#E4A834`, `tracking-[0.25em]` | §4.1 eyebrow verbatim |
| Wordmark | `Brand_Name.webp` 480w | Preloaded |
| Rule | `h-px w-12 bg-[#E4A834]/40` | scaleX draw, 600ms ease-out |
| Belief line | `font-editorial italic`, `#F7F4EB/90`, 17–19px | Never `display` — voice rule (§2) |
| CTA | `bg-[#D01B1B] hover:bg-[#B81414]`, white, `font-display` 12px uppercase | Same component token as Hero CTA |
| Footer | mono 10px, `white/40` | Proof whisper, not nav |
| Spacing | `gap-5`, vertical rhythm `8/5/4/6` | Generous air = luxury |
| Radius/shadow | `rounded-xl`, CTA shadow only | No card shadows anywhere |

**Responsive:** identical stack at 360px; seal 88px, wordmark `w-56`; footer wraps to 2 lines. No layout shift between breakpoints.

---

## 4. Motion spec (pure CSS, <2s total)

Staggered keyframes, each `opacity 0→1 + translateY(8px→0)` except noted:

| t | Element | Duration |
|---|---|---|
| 0ms | seal (fade + scale 1.03→1) | 700ms |
| 150ms | eyebrow | 500ms |
| 300ms | wordmark | 600ms |
| 500ms | rule (scaleX) | 600ms |
| 650ms | belief line | 500ms |
| 800ms | CTA + footer | 500ms |

- Total block: CTA interactive at ~900ms, full settle ~1.3s.
- `prefers-reduced-motion: reduce` → everything visible instantly, zero animation.
- `Skip` appears at 1000ms (keyboard-focusable from 0ms).
- No JS animation lib; one `<style>` block, `animation-fill-mode: both`.
- Behind the ritual: `<link rel="preload">` hero-desktop, Logo, Brand_Name + `preconnect` fonts already in `Layout.astro` — entering feels instant.

---

## 5. Technical implementation

**New files (2):**
1. `src/components/Threshold.astro` — the overlay/page UI (props: `mode: 'page' | 'overlay'`). Zero framework JS.
2. `src/scripts/threshold-gate.ts` (or inline `<script is:inline>`) — sessionStorage check, Enter/Skip handlers, `?skip=1` support, `THRESHOLD_ENABLED` flag. <30 lines.

**Touched files (3, minimal diffs):**
1. `src/pages/welcome.astro` (new, preview): `<Layout><Threshold mode="page" /></Layout>` + `noindex` meta.
2. `src/pages/index.astro`: wrap `<Threshold mode="overlay">` above existing content behind flag. No content changes.
3. `src/layouts/Layout.astro` (head only): preload `Logo.webp` + `Brand_Name.webp` on first paint.

**State machine:** `unseen → ritual (1.3s) → ready (CTA active) → entered (overlay fades 250ms, sessionStorage set, focus moved to main)`. Skip jumps `unseen → entered`.

---

## 6. Content (locked, no lorem)

- Eyebrow: `ESTD. 1980 — INDORE`
- Belief: `Ghar Jaisa Swad. Seva Wala Pyar.`
- CTA: `Enter the Dhaba`
- Skip: `Skip`
- Footer: `5 OUTLETS · OPEN TILL 3 AM · 100% SHUDDH VEG`
- Seasonal slot (optional, 1 line max above CTA, e.g. `Diwali Bhojan Thali — till Nov 2`). Off by default.

---

## 7. Accessibility & performance budgets

- Focus: on overlay show, focus trapped to CTA/Skip; on enter, focus to `<main>`; `Esc` = Skip. Contrast: amber-on-black 9.16:1 (AAA), white-on-crimson 4.91:1 (AA) — per matrix.
- Budgets: Threshold transfer **<150 KB** (seal 22 + wordmark 21 + CSS ~5 + fonts shared); interactive **<1s** on 4G; Lighthouse on `/welcome`: Performance ≥95, CLS 0.
- Reduced-motion, 200% zoom, keyboard-only: all must pass before gate phase.

---

## 8. Analytics & A/B gate criteria

Events: `threshold_shown`, `threshold_entered`, `threshold_skipped`, `threshold_cta_time_ms`.
Gate `/` only if preview week shows: skip rate <35%, median enter <2.5s, outlet-click rate from homepage not down vs baseline. Else keep `/welcome` as campaign link only.

---

## 9. Build order

1. **Phase A (preview):** `Threshold.astro` + `/welcome` + head preloads → deploy preview link → approve feel.
2. **Phase B (gate):** overlay wiring in `index.astro` + sessionStorage + `?skip=1` + kill switch → A/B week.
3. **Phase C (keep/kill):** metrics review → gate stays or `/welcome` remains as seasonal entry only.

---

## 10. Verification checklist

- [ ] `/welcome` renders pixel-clean at 360/768/1440, CLS 0, <150 KB.
- [ ] Reduced-motion + keyboard + Esc + 200% zoom pass.
- [ ] Repeat visit shows no ritual; `?skip=1` bypasses; crawlers get homepage HTML.
- [ ] OG/Twitter cards unchanged (homepage JPG).
- [ ] Kill switch reverts in 1 commit.
- [ ] Events firing; baseline vs gated outlet-click comparison recorded.
