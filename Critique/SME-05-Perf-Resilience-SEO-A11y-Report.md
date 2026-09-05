# SME-05 — Performance, Resilience, SEO & Accessibility Benchmark
**Agency:** CyberShield • **Expert:** Mr. Rohan Iyer (13y, Web Vitals + WCAG 2.2 AA auditor, hospitality sites)
**Mode:** Passive review only • **Scope:** Local code only (no Lighthouse/build run) • **Permission:** READ-ONLY

## 1. Persona & Mandate
Benchmark gaps, leaks, and inefficiencies that become availability, discoverability, or compliance liabilities: load weight, crash paths, SEO truthfulness, a11y barriers, legal display.

## 2. Tasks Assigned
1. Static perf inventory (images, fonts, islands, preloads).
2. Resilience review (storage parse, image fallback, scroll-lock, reduced-motion).
3. SEO/A11y/legal benchmark (meta, JSON-LD, dialogs, contrast claims).

## 3. Scope
**In:** `src/layouts/Layout.astro`, `src/components/StructuredData.astro`, `Hero.astro`, `MenuExplorer.tsx`, `menu/DishCard.tsx`, `Threshold.astro`, `Header.tsx`, `CartDrawer.tsx`, `Footer.astro`, `src/styles/global.css`, `public/assets/**`, `Land.html`, `design-system.html`
**Out:** Measured Lighthouse/CWV (needs build+serve — forbidden); live SERP check.

## 4. Assumptions
- Static hosting; no edge image CDN; `dist/` is build output (not reviewed line-by-line).
- `DESIGN.md` contrast matrix is CLAIMED, implementation must be spot-checked, not assumed.

## 5. Constraints
- No `npm run build/preview`, no image re-encode, no network timing. All perf claims are static-risk, not measured.

## 6. Findings

### PERF
**P1 [Medium] — Heavy image catalog with duplication, no responsive `srcset` in components.**
- `public/assets/menu/*.webp` (~20 full) + `thumbs/*.webp` (~20 thumbs) + 4 scanned `Menu*.webp` + hero pair + Logo/Brand/Founder/og-cover ≈ 50 files. Thumbs appear hand-duplicated (same basename, `thumbs/` prefix via `restaurantData.ts:786-789` string replace) — 2× bytes for every dish.
- `TrayItem.tsx:33-41`, `CartDrawer.tsx:404-415` use plain `<img src>` with fixed 44–68px boxes but load full thumbs (no `srcset`/`sizes`); `Hero` preloads are the only responsive split (`Layout.astro:85-91` desktop/mobile media preloads — good).
- Fonts: 5 families in one Google Fonts CSS (`Cinzel, Cormorant Garamond, JetBrains Mono, Noto Serif Devanagari, Plus Jakarta Sans` — `Layout.astro:100-103`) render-blocking; `JetBrains Mono` loaded but `font-mono` maps to Jakarta (`tailwind.config.mjs:31`) → wasted download.

**P2 [Low] — Island weight:** `Header client:load` + `CartDrawer/TableReservationModal client:idle` persisted (`Layout.astro:157-168`) + `ClientRouter fallback=swap`. Sensible, but every page ships React+nanostores runtime for a mostly-static site. No action unless LCP suffers — note for lab measurement.

**P3 [Good] — Preloads + sprite:** hero/Logo/Brand preloads + single `icons.svg` sprite (`Layout.astro:106`) are best-practice. Keep.

### RESILIENCE
**R1 [Medium] — Un guarded `JSON.parse` on persistent stores.**
- `@nanostores/persistent` `decode: JSON.parse` (`cartStore.ts:19-22`) + `Threshold.astro:292` `JSON.parse(localStorage.getItem)` wrapped in try/catch (good there) — but a user/hand-edited `nanaksar_cart_v1` with corrupt JSON will throw inside the store subscription on load → blank cart drawer / island crash. Recommend `decode` wrapper with fallback `[]` (not applied — report only).

**R2 [Low] — Scroll-lock + focus:** `CartDrawer.tsx:103-123` and `Header.tsx:21-34` both toggle `document.body.style.overflow`; Astro `before-swap` resets (good). Threshold moves focus to `main` on exit (`Threshold.astro:430-434` — good). Dialogs lack focus-trap + `aria-describedby`; Esc closes cart but booking modal has no Esc handler (inconsistency).

**R3 [Good] — Reduced-motion honored** in `Threshold.astro:269-279`. Keep pattern for drawer/modal.

### SEO / TRUTHFULNESS
**S1 [Medium] — Invalid `og:type` + unsourced rating.**
- `Layout.astro:115` `og:type= restaurant` is INVALID (must be `website`/`article`); scrapers fall back unpredictably. `StructuredData.astro:23-29` hardcodes `aggregateRating 4.5 / ratingCount 5000 / reviewCount 5000` with no source — Google treats unsourced self-serving ratings as spam; risks rich-result penalty.
- `openingHours Mo-Su 11:00-23:30` (JSON-LD) vs site copy `11:45 AM – 3:00 AM` (`restaurantData.ts:84`, `Footer.astro:70`) — mismatch = crawler distrust + late-night customer dispute.

**S2 [Low] — No `robots`/`sitemap`, `welcome` gate vs crawler:** `Layout.astro:81` `noindex` prop exists but no page sets it on `welcome` (curtain). Session-gated hero (`curtain-gate-active` CSS hides `#home` for first-visit) is JS+CSS only — crawler sees content (good), but humans with JS disabled see hidden home (progressive-enhancement gap).

### A11Y / LEGAL
**A1 [Low] — Dialog semantics partial:** `role=dialog aria-modal` present (`CartDrawer.tsx:192`, `TableReservationModal.tsx:79`) but no `aria-describedby`, focus not trapped, background not `inert`. Touch targets mostly ≥44px (good in `LuxuryControls.tsx:211,218,252`) except a few 9–11px eyebrow texts (decorative, acceptable).
**A2 [Good] — Contrast system exists** (`DESIGN.md` matrix + `gold-dark #965C00` tokens); spot-check shows body copy uses `#0F0F0F/70` on cream — verify at lab, don't assume AAA.
**L1 [Low] — Legal footer thin:** © + FSSAI + hours present; missing privacy/terms/contact-email/grievance (DPDP, see SME-02), no allergen/Jain-prep disclaimer next to order buttons despite Jain flags in data.

## 7. Risks & Mitigations (SME's own)
| Risk | Mitigation |
|------|------------|
| Perf claim without metrics | Every perf item labeled static-risk with explicit "confirm in lab" note |
| Assuming contrast passes | Cited token values + sampled classes; recommended measured check |
| Missing hidden sitemap | Glob for `sitemap|robots` → none found; stated as absent |

## 8. QA Checklist
- [x] Asset inventory (count + duplication pattern + preload list)
- [x] Font + island + router weight reviewed
- [x] Storage-parse + image-fallback + scroll/focus paths traced
- [x] Meta/OG/JSON-LD/hours consistency cross-checked (3 mismatches filed)
- [x] Dialog roles, targets, reduced-motion checked
- [x] Mapped to CWV + WCAG 2.2 AA + FSSAI display + Google Rich Results policy
- [x] No files modified

## 9. Recommendations (not applied)
1. Lab: run Lighthouse on `dist/` preview; fix `og:type→website`, source or remove `aggregateRating`, align `openingHours` to `11:45–03:00` with `openingHoursSpecification` overnight split.
2. Thumbs: generate at build (`astro:assets`) with `widths=[96,192]` + `srcset`; drop unused `JetBrains Mono` or map `font-mono` to it.
3. Wrap persistent `decode` in try/catch→`[]`; add `max` qty + focus-trap (`inert` background) for both dialogs; add `/privacy` link in footer.

**Verdict:** No outage-class defect. Biggest leverage: **image-weight discipline + JSON-LD truthfulness + storage-crash guard** — all cheap, all pre-launch.
