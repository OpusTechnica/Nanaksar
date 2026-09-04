# Critical Review — Image Performance Implementation Plan

**Reviewing:** `Critique/image-performance-implementation-plan.md`
**Reviewer stance:** adversarial. Steelman-check every number, every file ref, every causal claim.
**Ground truth used:** measured file sizes + dimensions + actual component source (all verified 2026-09-04).

---

## Verdict in one paragraph

Direction is correct (WebP + thumbs + kill `decoding="sync"` + kill `prefetchAll` + fix favicon), and Phases 1–4 would genuinely fix ~80% of the perceived lag. But the plan oversells its numbers, leaves its single biggest artifact (the `thumbs/` directory) unwired, makes two rendering claims that are wrong or overstated (marquee mask, hero `decoding="async"`), misses a shipping-breaking OG:image mistake, and ships a verification protocol too weak to prove anything. Fix the 7 issues below and it becomes shippable. As written: **approve direction, reject numbers + verification, request revision.**

---

## 1. What the plan gets right (keep all of this)

1. **WebP re-encode at ~700px is the right call.** 1402×1122 / 1254×1254 PNGs served to ~400px cards is the dominant cost. Any q70–82 WebP pass fixes it.
2. **Cart `loading="eager" decoding="sync"` diagnosis is correct and is the true drawer-freeze root cause** (`CartDrawer.tsx:343-347, 443-447` — 60px/40px thumbs synchronously decoding ~2.8 MB PNGs).
3. **Removing the scroll-driven `filter: brightness()` in `OutletsStack.tsx:23-24,33` is correct.** CSS `filter` on a `motion.div` invalidates paint every scroll frame; `scale` alone can stay on the compositor.
4. **`prefetchAll: true` → `false` is correct** (`astro.config.mjs:8-11`). Prefetching heavy secondary pages on a food site with 3 MB images is pure self-DDoS.
5. **Favicon fix is correct and overdue.** `Logo.png` is 1269×1239 / 1538 KB and is referenced as `<link rel="icon">` (`Layout.astro:27`). A 32px PNG is strictly better.

---

## 2. Critical issues (must fix before implementation)

### C1. Payload math is internally inconsistent — reconciled numbers below

The plan cites three different totals without explaining the counting method:

| Claim in plan | Measured reality |
|---|---|
| "~66.4 MB PNG payload" (title) | No path to 66.4 MB exists |
| "130.3 MB repo" (table) | Correct **only if** you sum `src/assets` + `public/assets` + `Assets/` triplicates |
| "Homepage ~41.1 MB / Menu ~95.8 MB" | Homepage ≈ 35–38 MB (hero 1.8 + 12 cards × ~2.8 + brand). Menu page cannot reach 95.8 MB |

Why menu ≠ 95.8 MB: `restaurantData.ts` has **37 `image:` refs but only 20 unique files** (verified: `bhojan-thali`, `chur-chur-naan`, … — the remaining 17 reuse `paneer-angara.png`, `chur-chur-naan.png`, etc.). 20 × ~2.8 MB ≈ **56 MB unique**, and the browser cache dedupes repeats. 95.8 MB implies counting every ref as a unique download, which browsers do not do.

**Benchmark correction (use these instead):**

| Surface | Current (unique, cold) | Plan claims | Corrected target |
|---|---|---|---|
| Repo (all 3 copies) | 130.3 MB | 130.3 MB ✓ | 130.3 MB |
| `public/` served payload (unique) | ~56 MB menu + ~10 MB brand ≈ **66 MB** | — | **This** is where "66.4 MB" comes from — label it |
| Homepage cold transfer | ~38 MB | 41.1 MB (≈ +8%, acceptable) | ~38 MB |
| `dist/` | 69 MB | 68.98 MB ✓ | 69 MB |

The plan's headline "`-97.1%`" divides a triplicated repo number by a deduplicated post number. Honest headline: **served payload 66 MB → ~2–3 MB (~95%), `dist/` 69 MB → <6 MB (~91%).** Still excellent — stop inflating it.

### C2. "~45 KB average at 700px q82" is optimistic by ~1.5–2x

Food photography at 700px wide, WebP q82, method 6, typically lands at **60–110 KB**, not 45 KB (greasy highlights + sev texture + thali clutter compress poorly). 45 KB is achievable at q70–75 or at 600px, not q82.

Measured dimensions sharpen this: menu files are 1402×1122 (5:4) and 1254×1254 (1:1). A 700px-wide downscale = 700×560 / 700×700. Expect:

| Asset class | Plan claims | Realistic benchmark (WebP) |
|---|---|---|
| Menu card 700px q82 | 45 KB | **65–100 KB** |
| Menu card 700px q75 | — | **45–65 KB** ← use this if 45 KB is the budget |
| Cart thumb 140px q80 | 8 KB | **6–12 KB** ✓ (plan correct) |
| Hero 1600px q80 (1672×941 source) | 110 KB | **110–160 KB** ✓-ish |
| Founder 800px (1448×1086 source) | 65 KB | **55–85 KB** ✓ |
| Logo 140px from 1269×1239 | 10 KB | 8–15 KB ✓, but blurry on retina — ship 280px 2x (~20 KB) |
| Total menu (20 unique × 75 KB) + thumbs + brand | 3.8 MB | **~2.5–4 MB** — plan's 3.8 MB is inside the range, but only at q75, not q82 |

**Suggestion:** specify `q75, 700px` OR `q82, 640px`, add a visual QA gate (side-by-side, no visible banding on ghee highlights), and re-state the target as **<5 MB** instead of 3.8 MB. Under-promise, over-deliver.

### C3. Biggest implementation gap: `thumbs/` is generated and never wired

Phase 1 creates `public/assets/menu/thumbs/` (good). Phase 3 then sets `width={60} height={60}` on the **same full-size URL** — the thumb files are never referenced. As written, the cart still downloads 2.8 MB per item, just with async decode. The freeze gets shorter; the bandwidth does not change.

**Required fix:** add a thumb-resolution step in `CartDrawer.tsx` (both `summary.items` thumbs and `POPULAR_ACCOMPANIMENTS`), e.g. derive `imageUrl.replace('/menu/', '/menu/thumbs/')` with fallback `onError` to full image (the component already has an `onError` handler — reuse it). Also fix `POPULAR_ACCOMPANIMENTS` hardcoded `/assets/menu/*.png` paths.

Related distortion bug: `width={60} height={60}` on a 5:4 source claims a square intrinsic ratio while CSS shows `object-cover` in a square box. It works visually but mis-reports CLS. Either generate **square-cropped** 120×120 thumbs (retina 2x for a 60px box) or set `width={60} height={48}`.

### C4. Cart `loading="lazy"` inside an open drawer is cargo-cult

Once the drawer is open, its thumbnails **are** the viewport — `loading="lazy"` defers images the user is already looking at and causes pop-in on open. The actual fix is (a) 8 KB thumb file + (b) `decoding="async"` + (c) explicit dimensions. `lazy` vs `eager` there is second-order. Keep `eager` + `async` + thumbs and the drawer is fast without pop-in; or keep `lazy` and accept a shimmer. The plan presents `lazy` as "eliminating the freeze" — it does not; the thumb file does.

### C5. Marquee mask claim is overstated; proposed replacement changes the design

`TestimonialsMarquee.tsx:115` uses a **static** `[mask-image:linear-gradient(...)]`. A static mask is rasterized once, not "continuous per-frame re-rasterization." The per-frame cost is the translate animation in `.marquee-track` (CSS keyframes in `global.css`), which is already `transform`-only and already composited. Measured expectation: removing the mask saves **<1 ms/frame**, not "scroll stutter."

Worse, the replacement (two opaque `h-16` cream gradient strips) is not visually identical: true feathered masking vs. painted-over strips differ on scroll overlap and add overdraw on every frame. **Suggestion:** keep the mask, add `content-visibility: auto` to off-screen columns, confirm `will-change: transform` is only on the track (not the cards), and drop this from the "FPS fix" narrative. The testimonial cards already do the right thing (initials avatar instead of photos — zero image cost).

### C6. Hero `decoding="async"` hurts LCP — reverse it

Phase 3 says: hero WebP + `decoding="async"`. For the LCP image the correct attributes are `decoding="sync"` (default) or `auto` + `fetchpriority="high"` + `<link rel="preload">`. `async` explicitly deprioritizes the one image you want first. The plan already adds the preload (good) — pair it with `fetchpriority="high"` (already in `Hero.astro:16`, keep it) and **do not** set `async` on the hero. Reserve `async` for below-fold cards. Also: hero source `BB.png` is exactly 1672×941, so `width="1672" height="941"` is correct — state that it was measured, not guessed. Same for `Hero_background.png` (1402×1122, 2.2 MB — heavier than BB; the plan should pick **one** hero and delete the other instead of optimizing both).

### C7. `New-Back.webp` as OG:image breaks link previews (shipping-blocker)

Phase 1 converts `New-Back.png` → `New-Back.webp` and `Layout.astro:43` serves it as `og:image`. WhatsApp / Facebook / iMessage crawlers **do not reliably support WebP OG images** and require absolute URLs + 1200×630. Shipping WebP OG = broken share cards. **Fix:** keep a dedicated `og-cover.jpg` (1200×630, q75, ~80–120 KB, absolute `https://` URL), never WebP, and add `og:image:width/height`. Also add `apple-touch-icon` (180px PNG) while touching the head — currently missing.

---

## 3. Missing pieces (plan is silent — add before build)

1. **No responsive images.** One 700px file for all densities: fine at 1x, soft on 2x phones for the 400px card (needs ~800px). Minimum: `srcset` 400w/700w or `sizes="(max-width:640px) 100vw, 400px"`. Hero needs 768w mobile + 1600w desktop variants.
2. **No dedupe step.** Triplicates (`Assets/` vs `src/assets` vs `public/`) remain. `src/assets/BB.png` imported via `heroBg.src` bypasses the `public/` optimization entirely unless the import is repointed. Script must cover both or delete one source of truth.
3. **No font or island work.** 4 font families + `SignaturesShowcase client:load` + `BestsellersShowcase client:load` stay on the critical path. At minimum: `display=swap` + subset + move below-fold showcases to `client:visible`.
4. **No cache story.** WebP + preload without `Cache-Control: immutable` on `/assets/` leaves repeat visits slow. One line in hosting config.
5. **No fallback.** WebP is ~97% supported, but the plan deletes PNGs with no fallback. Keep PNGs out of `dist/` but document the floor (or ship `<picture>` with JPEG fallback for the hero only).
6. **`client:idle` for CartDrawer has a tradeoff the plan ignores.** Idle defers cart JS — first cart-open after fast click can feel dead. Acceptable, but pair it with prefetch-on-cart-button-hover or keep `client:load` and cite measurement. Don't present it as free.

---

## 4. Benchmarks to hold the implementation to

### 4a. Page budgets (Moto G4 × 4G throttling, Lighthouse 12)

| Metric | Current (est.) | Budget after fix | How to measure |
|---|---|---|---|
| Homepage image transfer | ~38 MB | **<1.5 MB** | DevTools Network, disable cache, "All dishes" cold load |
| Menu page image transfer (first 18) | ~50 MB | **<1.5 MB** | Same, scrolled to first grid |
| LCP (hero) | 6–10s | **<2.5s** | Lighthouse ×3, median |
| INP (cart open / filter tap) | janky, likely >500 ms | **<200 ms** | DevTools Performance, 4x CPU |
| CLS | unknown (no dimensions) | **<0.1** | Lighthouse; requires width/height everywhere |
| `dist/` total | 69 MB | **<6 MB** (plan's target stands) | `du` after `npm run build` |
| Cart-open frame rate | visibly frozen | **no frame >50 ms** | Performance trace during drawer open |

### 4b. Per-asset acceptance table (replace plan §1 table's "post" column with ranges)

| Asset | Accept if |
|---|---|
| Menu card (700px WebP) | 45–100 KB, no visible banding at 2x |
| Cart thumb (120×120 WebP) | 5–12 KB |
| Hero desktop (1600w WebP) | 100–170 KB |
| Hero mobile (768w WebP) | 40–70 KB |
| Logo 280px 2x WebP | <25 KB |
| Favicon 32px PNG | <5 KB |
| OG cover 1200×630 JPG | 80–130 KB |

Anything outside the range fails the PR, no debate.

### 4c. Verification protocol (replaces plan §4)

1. `npm run build` passes + `dist/` <6 MB + `grep -r "\.png" dist/` shows only favicon + og-cover + apple-touch.
2. Lighthouse (mobile, throttled) ×3 before/after on `/` and `/all-categories`: record LCP/CLS/INP + filmstrip screenshots in the PR.
3. DevTools Performance trace: open cart, scroll marquee, scroll outlet stack — zero frames >50 ms, zero `filter` recalc in "Rendering" lane.
4. Visual QA: 3 dishes (dark gravy, sev texture, thali) side-by-side PNG vs WebP at 2x — approver signs off.
5. Link-preview check: absolute OG JPG validates in a card debugger; no WebP in `og:image`.
6. Rollback: keep `Assets/` originals untouched; script writes only `public/assets/**/*.webp` + `thumbs/`; revert = path-swap commit.

---

## 5. Concrete revision checklist for the plan author

- [ ] Relabel "66.4 MB" as **served unique payload** and correct menu-page math (20 unique files, ~56 MB, not 95.8 MB).
- [ ] Change `q82 → q75` (or 700px → 640px) **or** raise the per-card budget to 65–100 KB. Pick one; don't promise 45 KB at q82.
- [ ] Wire `thumbs/` into `CartDrawer` (+ `POPULAR_ACCOMPANIMENTS`); use square 120×120 thumbs.
- [ ] Hero: `fetchpriority="high"` + preload + `decoding="sync"/auto` (never `async`); delete one of `BB.png` / `Hero_background.png`.
- [ ] OG:image stays JPEG, absolute URL, 1200×630. Add apple-touch-icon.
- [ ] Downgrade marquee mask claim; keep mask, measure before replacing.
- [ ] Add srcset/sizes (cards + hero), font subset, island deferral, cache headers to scope.
- [ ] Replace §4 with the 6-gate protocol above including ranges, not single numbers.

**Bottom line:** the fix list is right, the physics is right, the proof is not. Revise the numbers, wire the thumbs, un-break OG sharing, and this plan ships.
