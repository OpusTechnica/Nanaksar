# Nanak Heritage Icon Spec

Single source: `public/assets/icons.svg` → `src/components/ui/Icon.tsx` (`<use href>`) for React,
`<svg><use href="/assets/icons.svg#…"/></svg>` for Astro. Never import an icon library; never add
raster icons. `public/` auto-copies to `dist/` on `astro build` — never hand-copy or commit `dist/`.

## Construction
- 24×24 grid, 2px safe padding, 2px clearspace around every glyph.
- Functional set (16–24px): 2px stroke, round caps/joins. Editorial `tandoor-mark` (32–64px only): 1.5px.
- `TrayIcon` unified to 2px with the family.
- Fill only: `star-solid` (ratings), `veg-seal` dot, brand fills (WhatsApp/Instagram/Maps stay inline
  brand paths, not 24-grid monoline). Seals (`Logo.png` + `Brand_Name.png`) are lockups, never icons.

## Color map (binding)
| Context | Glyph color |
|---|---|
| On charcoal `#0F0F0F` / `#161616` / `#181818` | body cream `#F7F4EB` or heritage gold `#E4A834` (9.16:1 AAA) |
| On cream `#F7F4EB` | charcoal `#1A1A1A` (16.2:1 AAA) or dark amber `#965C00` (4.65:1 AA) — never bright gold |
| Veg/Jain | FSSAI dot `#15803D` fixed geometry; Jain = text tag, no religious glyph |
| Action tiles | solid crimson `#D01B1B` fill + white glyph (4.91:1 AA). Crimson is NEVER a line stroke |

## Tiles
Default: naked glyph, no tile, no background, `box-shadow: none`. Exception tiles only for cart CTA
and outlet-direction links: 32px visual box max, 8px radius dark / 4px cream, 1px hairline
(`white/10` or `gold/20`). 44px touch target via padding, never via visual box.

## Sizes & a11y
- 16px badges/meta, 20px UI default, 24px section eyebrows; min 16px functional / 32px editorial.
- Decorative icons: `aria-hidden` (default in `Icon.tsx`). Functional icon-only buttons: `aria-label`.
- Focus: `:focus-visible` 2px gold ring (ring-1 is too thin). Disabled: opacity + non-color cue.
- Status icons (check/alert) always paired with text, never color-alone.
- `prefers-reduced-motion`: marquee/drawer/counters/kinetic/smooth-scroll all inert (see `global.css`).

## Do / Don't (nanak §10/11)
Do: hairlines, typography-first scanning (dish name + mono price + veg/Jain tag), one accent per view,
photography as the appetite carrier. Don't: gradients, glows, glass, 3D, blobs, purple/blue,
text-shadows, blurry shadows, icon-per-dish pictures, Halal tags, crimson line icons.

## Regression gates (CI)
- `IconName` union == `<symbol id>` set; all symbols `viewBox="0 0 24 24"`; no `transform=`.
- No `<svg` paths left in `Footer/Hero/OutletsDirectory/PlatformsSection/OutletsRibbon` except brand fills.
- `lucide-react` absent from `package.json` + `astro.config.mjs`.
- 390px zero-overflow; 44px touch audit; Axe both canvases; sprite-blocked degrade keeps labels/layout.
