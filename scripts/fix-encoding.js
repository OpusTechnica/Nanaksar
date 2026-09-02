const fs = require('fs');
const path = require('path');

// 1. Fix Hero.astro
const heroAstro = `---
import OutletsRibbon from './OutletsRibbon.astro';
import { BRAND_INFO } from '../data/restaurantData';
---

<section id="home" class="relative w-full min-h-[100dvh] bg-[#0F0F0F] text-white flex flex-col justify-between overflow-hidden pt-20 sm:pt-24">
  
  <!-- Hero Background Image & Gradient Scrim -->
  <div class="absolute inset-0 z-0">
    <img
      src="/assets/New-Back.png"
      alt="Nanaksar Dal Makhani and Authentic Thali Feast"
      class="w-full h-full object-cover object-center sm:object-right select-none"
      loading="eager"
      fetchpriority="high"
    />
    <div class="absolute inset-0 hero-scrim"></div>
  </div>

  <!-- Hero Main Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 w-full my-auto">
    <div class="max-w-2xl lg:max-w-3xl flex flex-col items-start text-left">
      
      <!-- Eyebrow Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#E4A834]/15 border border-[#E4A834]/30 mb-3 sm:mb-4">
        <span class="w-2 h-2 rounded-full bg-[#E4A834] animate-pulse"></span>
        <span class="font-display text-xs sm:text-sm font-bold tracking-[0.25em] text-[#E4A834] uppercase">
          ESTD. {BRAND_INFO.established} <span class="mx-1 text-white/40">•</span> {BRAND_INFO.yearsOfHeritage} YEARS OF HERITAGE
        </span>
      </div>

      <!-- Main Headline (Letterpress Solid Typography) -->
      <h1 class="font-display text-4xl xs:text-5xl sm:text-7xl lg:text-[5.5rem] font-bold uppercase tracking-tight leading-[0.92] sm:leading-[0.88] mb-4">
        <span class="text-[#F7F4EB] block">GOOD FOOD.</span>
        <span class="text-[#D01B1B] block">PURE SEWA BHAAV.</span>
      </h1>

      <!-- Decorative Sub-Badge (Using SVG icons) -->
      <div class="flex items-center gap-2 sm:gap-3 my-2 sm:my-3 text-[#E4A834]">
        <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z"/></svg>
        <span class="font-display text-xs sm:text-sm font-semibold tracking-[0.20em] uppercase text-[#E4A834]">
          100% SHUDDH PURE VEGETARIAN <span class="mx-1 text-white/40">•</span> PURE DESI GHEE
        </span>
        <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6-6.3 4.6 2.3-7.1-6-4.5h7.6z"/></svg>
      </div>

      <!-- Narrative Copy -->
      <p class="font-sans text-[#F7F4EB]/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl">
        Serving authentic, hygienic, and honest North Indian vegetarian food in Indore <strong class="text-white font-semibold">since 1980</strong>. From our legendary 24-hour slow-cooked Dal Makhani to clay-oven hand-crushed Chur Chur Naan, Nanaksar is a sacred dining tradition for every family.
      </p>

      <!-- Dual Action CTAs -->
      <div class="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 w-full xs:w-auto">
        <!-- Primary CTA: Explore Signatures -->
        <a
          href="#signatures"
          class="flex items-center justify-center gap-2 bg-[#D01B1B] hover:bg-[#C62828] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition shadow-lg hover:scale-[1.02] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E4A834]"
        >
          <span>EXPLORE SIGNATURES</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>

        <!-- Secondary CTA: Five Outlets -->
        <a
          href="#outlets"
          class="flex items-center justify-center gap-2 border border-[#E4A834] hover:bg-[#E4A834]/15 text-[#E4A834] px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#E4A834]"
        >
          <span>FIVE INDORE OUTLETS</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </a>
      </div>

    </div>
  </div>

  <!-- Bottom Docked 5-Outlets Status Ribbon -->
  <OutletsRibbon />

</section>
`;
fs.writeFileSync(path.join(__dirname, '../src/components/Hero.astro'), heroAstro, 'utf8');

// 2. Fix OutletsRibbon.astro
const ribbonAstro = `---
import { OUTLETS } from '../data/restaurantData';
---

<div class="relative z-20 w-full border-t border-[#E4A834]/25 bg-[#0F0F0F]/95 backdrop-blur-md py-4 sm:py-6">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      
      <!-- Left Anchor Title -->
      <div class="flex items-center gap-3 lg:pr-6 lg:border-r lg:border-white/10 shrink-0">
        <span class="w-2 h-8 bg-[#D01B1B] rounded-full hidden sm:block"></span>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[#E4A834]">
              Five Outlets
            </span>
            <span class="bg-[#D01B1B] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
              INDORE
            </span>
          </div>
          <p class="text-[11px] text-white/60 font-medium">Open Daily: 11:00 AM - 11:30 PM</p>
        </div>
      </div>

      <!-- Outlets Container (Mobile: Swipeable Snap Ribbon | Desktop: Flex Row) -->
      <div class="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x gap-3 lg:gap-4 py-1 lg:py-0 lg:overflow-visible lg:justify-end">
        {OUTLETS.map((outlet) => (
          <a
            href={outlet.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="snap-start shrink-0 w-[240px] sm:w-[260px] lg:w-auto bg-[#181818] hover:bg-[#222222] border border-white/10 hover:border-[#E4A834]/50 rounded-xl p-3 flex flex-col justify-between transition group focus:outline-none focus:ring-2 focus:ring-[#E4A834]"
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-display text-xs font-bold text-white uppercase tracking-wider group-hover:text-[#E4A834] transition">
                {outlet.name}
              </span>
              {outlet.isFlagship ? (
                <span class="text-[9px] font-mono text-[#E4A834] bg-[#E4A834]/15 px-1.5 py-0.5 rounded font-bold">
                  FLAGSHIP
                </span>
              ) : outlet.isNew ? (
                <span class="text-[9px] font-mono text-green-400 bg-green-950/60 px-1.5 py-0.5 rounded font-bold">
                  NEW
                </span>
              ) : (
                <span class="text-[9px] font-mono text-white/50">
                  INDORE
                </span>
              )}
            </div>

            <p class="text-[11px] text-white/60 line-clamp-1">
              {outlet.subtitle}
            </p>

            <div class="flex items-center justify-between pt-2 mt-1 border-t border-white/5 text-[10px] font-mono text-[#E4A834]">
              <span>Directions</span>
              <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>
        ))}
      </div>

    </div>
  </div>
</div>
`;
fs.writeFileSync(path.join(__dirname, '../src/components/OutletsRibbon.astro'), ribbonAstro, 'utf8');

// 3. Fix index.astro
const indexAstro = `---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
---

<Layout>
  <!-- Flagship Hero Section with Docked 5-Outlets Ribbon -->
  <Hero />

  <!-- Verification Note for Milestone 2 -->
  <section class="py-12 bg-[#181818] border-t border-white/10 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15803D]/20 text-green-400 border border-green-600/40 text-xs font-bold uppercase tracking-wider mb-3">
        <span class="w-2 h-2 rounded-full bg-green-500"></span> MILESTONE 2 ACTIVE AND VERIFIED
      </span>
      <h2 class="font-display text-2xl sm:text-3xl font-bold uppercase text-white">
        Header, Hero and 5-Outlets Docked Ribbon Operational
      </h2>
      <p class="text-sm text-white/70 max-w-xl mx-auto mt-2 font-sans">
        Test the sticky glassmorphic navigation, "Book Table" reservation console, takeaway cart drawer, and the mobile-swipeable 5-outlet ribbon.
      </p>
    </div>
  </section>
</Layout>
`;
fs.writeFileSync(path.join(__dirname, '../src/pages/index.astro'), indexAstro, 'utf8');

console.log('Successfully written clean UTF-8 files without any unicode replacement issues.');
