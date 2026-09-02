# Implementation Plan: Nanaksar Dhaba Astro + React Project Conversion

Convert the static prototype into a high-performance **Astro + React + TypeScript + Tailwind CSS** restaurant application with an optimized asset pipeline (guaranteeing 100% reliable image rendering for all brand & menu assets), hybrid Framer Motion + GSAP micro-interactions, an interactive menu catalog, a 4-outlet directory, a table reservation system, and a takeaway order cart drawer.

## User Review Required

> [!IMPORTANT]
> **Asset Resolution & Image Rendering:**
> The primary bug in the static HTML was raw local relative paths failing in browsers (`Assets/...`). In the new Astro project, assets in `public/assets/` and `src/assets/` are mapped through Astro's image optimization pipeline (`astro:assets` `<Image />` component) and public root URLs (`/assets/...`), ensuring immediate, zero-broken-link asset rendering across all pages and components.

> [!NOTE]
> **Workflow Control:**
> Per your choice of **Step-by-Step Approval**, we will execute **Milestone 1 (Scaffold & Image Verification)** first, verify all hero images and brand marks render cleanly in the browser, and await your green light before proceeding to each subsequent milestone.

---

## Architecture & Tech Stack

- **Core Framework:** [Astro v5](https://astro.build) (SSG / Hybrid Islands Architecture for sub-second load times & 100 SEO score)
- **UI Components:** React 19 (`@astrojs/react`) with TypeScript
- **Styling & Tokens:** Tailwind CSS v3/v4 (`@astrojs/tailwind`) with full [DESIGN.md](file:///c:/Users/WIN/Documents/Design%20Templets/Fast%20food%20Restaurants/Nankasar/Project%20Nankasar/DESIGN.md) token integration
- **Icons:** `lucide-react`
- **Animations:** Hybrid `framer-motion` (interactive UI/modals/cart/tabs) + `gsap` / ScrollTrigger (smooth heritage reveals and entrance choreography)
- **Design Standard:** Strict adherence to [SKILL.md (Nanaksar Designer Agent)](file:///c:/Users/WIN/Documents/Design%20Templets/Fast%20food%20Restaurants/Nankasar/Project%20Nankasar/.agents/skills/nanak/SKILL.md) — crisp optical contrast, zero blurry glowing drop shadows, WCAG AAA/AA compliance.

---

## Proposed Changes

### Milestone 1: Project Scaffolding & Asset Pipeline (Immediate Step)

#### [NEW] Astro Project Configuration
- `astro.config.mjs` — Astro configuration with React and Tailwind integrations.
- `package.json` — Dependencies: `astro`, `@astrojs/react`, `@astrojs/tailwind`, `react`, `react-dom`, `typescript`, `tailwindcss`, `lucide-react`, `framer-motion`, `gsap`, `@types/react`.
- `tsconfig.json` — TypeScript strict configuration with path aliases (`@components/*`, `@assets/*`, `@data/*`).
- `tailwind.config.mjs` — Nanaksar custom theme tokens (Tandoori Crimson `#D01B1B`, Desi Ghee Amber `#E4A834`, Tandoor Charcoal `#0F0F0F`, Makkhan Cream `#F7F4EB`, FSSAI Veg `#15803D`, fonts: Oswald, DM Sans, Playfair Display).

#### [NEW] Asset Directory Structure
- Migrate and organize all images into `public/assets/` and `src/assets/`:
  - `Hero_background.png` (Optimized hero backdrop with gradient scrim)
  - `Desired_hero.png` (Design reference)
  - `Logo.png` (Official circular seal)
  - `Brand_Name.png` (Official bilingual typographic brand mark)
  - `Menu.webp`, `Menu_1.webp`, `Menu_2.webp`, `Menu-3.webp` (Authentic scanned physical menus)

#### [NEW] Core Layout & Base Page
- `src/layouts/Layout.astro` — Global typography preloads (Google Fonts: Oswald, DM Sans, Playfair Display), SEO metadata, design tokens stylesheet, favicon.
- `src/pages/index.astro` — Main flagship page assembling the components.

---

### Milestone 2: Brand Header, Hero & 4-Outlets Bottom Dock

#### [NEW] Component Architecture
- `src/components/Header.tsx` — Sticky top navigation with official brand lockup (`Logo.png` + `Brand_Name.png`), red sliding hover underline bars, mobile slide-out drawer, and `[ORDER ONLINE]` / `[BOOK TABLE]` quick CTAs.
- `src/components/Hero.astro` or `src/components/Hero.tsx` — Pixel-perfect recreation of `Desired_hero.png` with crisp letterpress typography, `SINCE 2005` amber eyebrow, `GOOD FOOD. PURE SEWA BHAAV.` headlines, and dual action CTAs.
- `src/components/OutletsBar.tsx` — Four Outlets bottom anchor bar docked to the hero (Dewas Naka Flagship, Vijay Nagar, Geeta Bhawan, Bhawarkua) with live Google Maps links and direction affordances.

---

### Milestone 3: Interactive Menu Catalog & Jain/Dietary Filtering

#### [NEW] Menu Data & Components
- `src/data/menuData.ts` — Typed catalog of Nanaksar dishes extracted directly from menu scans (Dal Specialties, Paneer Specialties, Indori Sabjiya, Soya Chaap, Tandoori Breads, Desserts & Beverages) with prices, half/full portions, spice levels, Jain availability flags, and FSSAI veg indicators.
- `src/components/MenuSection.tsx` — Interactive menu grid with:
  - Instant category switching with Framer Motion layout animations.
  - Dedicated "Jain Preparations Only" toggle.
  - "Add to Order" quick action dispatching to the Takeaway Cart.

---

### Milestone 4: 24-Hour Bhatti Heritage Bento & Visual Storytelling

#### [NEW] Heritage Story Components
- `src/components/HeritageBento.tsx` — Bento grid highlighting:
  - 2005 Highway Inception & Avtar Singh ("Veer Ji").
  - 24-Hour Slow-Simmered Dal Makhani Bhatti craft (overnight soak & 14-hr reduction).
  - Clay-oven hand-crushed Chur Chur Naan.
  - 100% Pure Vegetarian & Shuddh Desi Ghee purity guarantee.

---

### Milestone 5: Table Reservation Modal & WhatsApp Takeaway Cart Drawer

#### [NEW] Interactive State Modules
- `src/components/BookingModal.tsx` — Frictionless table reservation dialog with branch selection, date/time pickers, guest count, special dietary notes (Jain/regular), and instant confirmation feedback.
- `src/components/CartDrawer.tsx` — Slide-out takeaway order cart drawer calculating totals, portion choices, delivery/takeaway options, and 1-click WhatsApp order formatting (`Send to Nanaksar Outlet`).
- `src/components/Footer.tsx` — Comprehensive brand footer with outlet operating hours, addresses, social links, and FSSAI license credentials.

---

## Verification Plan

### Automated Build & Lint Tests
- `npm run build` / `npx astro check` — Verify zero TypeScript or Astro compiler errors.
- Verify asset bundling and output directory in `dist/`.

### Manual & Visual Verification
1. **Image Rendering Check:** Open local preview server (`http://localhost:4321`), verify `Hero_background.png`, `Logo.png`, and `Brand_Name.png` load with HTTP 200 and display razor-sharp across viewports.
2. **Mobile Mode Verification:** Test viewport 390px (mobile) and 1440px (desktop) ensuring zero layout shifts, no horizontal scrollbar, and crisp typography.
3. **Interactive Features Test:**
   - Test category tab switching in Menu.
   - Test Jain filter toggle.
   - Add items to Cart Drawer and check quantity/price recalculations.
   - Open and submit Table Booking form.
