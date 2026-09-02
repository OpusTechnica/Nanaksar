from write_files import write_file

outlets_directory_code = """---
import { OUTLETS } from '../data/restaurantData';
---

<section id="outlets" class="py-20 sm:py-28 bg-[#0F0F0F] text-white border-t border-[#E4A834]/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
      <span class="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#E4A834]">
        ACROSS INDORE
      </span>
      <h2 class="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-tight mt-2">
        Five Outlets. <span class="text-[#D01B1B]">One Tradition.</span>
      </h2>
      <p class="mt-3 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
        Experience authentic highway comfort dining at any of our 5 strategically located family restaurants across Indore.
      </p>
    </div>

    <!-- 5 Outlets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {OUTLETS.map((outlet) => (
        <div class="bg-[#181818] p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-[#E4A834]/50 transition flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                outlet.isFlagship
                  ? 'bg-[#E4A834] text-black'
                  : outlet.isNew
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-white/80'
              }`}>
                {outlet.tag}
              </span>
              <span class="text-xs text-white/50 font-mono">Indore, M.P.</span>
            </div>

            <h3 class="font-display text-2xl font-bold uppercase text-white group-hover:text-[#E4A834] transition">
              {outlet.name}
            </h3>
            <p class="text-xs font-display text-[#E4A834] uppercase tracking-wide mt-0.5">
              {outlet.subtitle}
            </p>

            <p class="text-xs text-white/70 mt-3 leading-relaxed">
              {outlet.address}
            </p>
          </div>

          <div class="mt-6 pt-5 border-t border-white/10 space-y-3">
            <div class="text-[11px] font-mono text-white/60">
              <span class="text-[#E4A834]">• Hours:</span> {outlet.timings}
            </div>
            
            <div class="grid grid-cols-2 gap-2 pt-1">
              <a
                href={outlet.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-[#E4A834] hover:text-black text-white text-xs font-display font-bold uppercase py-2.5 rounded-lg transition min-h-[44px]"
              >
                <span>Directions</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>

              <a
                href={`tel:${outlet.phone.replace(/\\s/g, '')}`}
                class="inline-flex items-center justify-center gap-1.5 border border-white/20 hover:border-white text-white text-xs font-display font-bold uppercase py-2.5 rounded-lg transition min-h-[44px]"
              >
                <span>Call Outlet</span>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
"""
write_file("src/components/OutletsDirectory.astro", outlets_directory_code)

reviews_section_code = """---
---

<section id="reviews" class="py-20 sm:py-28 bg-[#F7F4EB] text-[#0F0F0F] border-t border-[#0F0F0F]/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
      <div class="inline-flex items-center gap-2 rounded-full border border-[#0F0F0F]/10 bg-white px-4 py-1.5 mb-4 shadow-sm">
        <div class="flex text-[#D01B1B] text-xs">
          ★★★★★
        </div>
        <span class="text-xs font-display font-bold uppercase tracking-wider text-[#0F0F0F]">
          4.4 / 5.0 Google & Zomato Rating (1,200+ Patrons)
        </span>
      </div>
      <h2 class="font-display text-4xl sm:text-6xl font-bold uppercase text-[#0F0F0F]">
        Loved Across Indore
      </h2>
      <p class="mt-3 text-sm sm:text-base text-[#0F0F0F]/70">
        From highway truckers in 1980 to third-generation family dinners today.
      </p>
    </div>

    <!-- 3 Review Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      
      <!-- Review 1 -->
      <div class="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-[#0F0F0F]/10 flex flex-col justify-between">
        <div>
          <div class="flex text-[#D01B1B] gap-1 mb-3 text-sm">
            ★★★★★
          </div>
          <p class="font-serif italic text-sm sm:text-base text-[#0F0F0F]/80 leading-relaxed">
            "The 24-hour Dal Makhani at Nanaksar is unmatched anywhere in Central India. You can taste the real slow-simmered bhatti smoke and pure desi ghee. Unbelievable taste and generous family portions."
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-[#0F0F0F]/10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#D01B1B]/10 text-[#D01B1B] font-display font-bold text-sm flex items-center justify-center">
            AS
          </div>
          <div>
            <h4 class="font-display text-sm font-bold uppercase text-[#0F0F0F]">Amit Sharma</h4>
            <p class="text-[11px] text-[#0F0F0F]/50 font-mono">Indore Foodie • Dewas Naka Regular</p>
          </div>
        </div>
      </div>

      <!-- Review 2 -->
      <div class="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-[#0F0F0F]/10 flex flex-col justify-between">
        <div>
          <div class="flex text-[#D01B1B] gap-1 mb-3 text-sm">
            ★★★★★
          </div>
          <p class="font-serif italic text-sm sm:text-base text-[#0F0F0F]/80 leading-relaxed">
            "Hot Chur Chur Naan crushed right in front of you with butter melting over it, paired with Sev Tamatar and Dal Makhani. This is true highway soul brought directly into Vijay Nagar!"
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-[#0F0F0F]/10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#E4A834]/20 text-[#965C00] font-display font-bold text-sm flex items-center justify-center">
            PG
          </div>
          <div>
            <h4 class="font-display text-sm font-bold uppercase text-[#0F0F0F]">Pooja Gupta</h4>
            <p class="text-[11px] text-[#0F0F0F]/50 font-mono">Vijay Nagar Family Dining</p>
          </div>
        </div>
      </div>

      <!-- Review 3 -->
      <div class="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-[#0F0F0F]/10 flex flex-col justify-between">
        <div>
          <div class="flex text-[#D01B1B] gap-1 mb-3 text-sm">
            ★★★★★
          </div>
          <p class="font-serif italic text-sm sm:text-base text-[#0F0F0F]/80 leading-relaxed">
            "Pure Sewa Bhaav is real here. The staff serves with genuine warmth and care. Outstanding hygienic food, pure desi ghee, and 100% vegetarian. Sudama Nagar outlet is fantastic."
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-[#0F0F0F]/10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#D01B1B]/10 text-[#D01B1B] font-display font-bold text-sm flex items-center justify-center">
            GS
          </div>
          <div>
            <h4 class="font-display text-sm font-bold uppercase text-[#0F0F0F]">Gurpreet Singh</h4>
            <p class="text-[11px] text-[#0F0F0F]/50 font-mono">Sudama Nagar Patron</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
"""
write_file("src/components/ReviewsSection.astro", reviews_section_code)

footer_code = """---
import { BRAND_INFO, OUTLETS } from '../data/restaurantData';
---

<footer class="bg-[#0A0A0A] text-white pt-16 pb-12 border-t border-white/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
      
      <!-- Brand & History (Col 1-5) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="flex items-center gap-3">
          <img src="/assets/Logo.png" alt="Nanaksar Dhaba Seal" class="h-14 w-14 object-contain" />
          <div>
            <h3 class="font-display text-2xl font-bold tracking-tight text-[#D01B1B] uppercase leading-none">
              NANAKSAR DHABA
            </h3>
            <span class="text-[10px] font-display font-semibold tracking-widest text-[#E4A834] uppercase block mt-1">
              ESTD. {BRAND_INFO.established} • INDORE, M.P.
            </span>
          </div>
        </div>

        <p class="font-serif italic text-sm text-white/70 max-w-sm leading-relaxed">
          "{BRAND_INFO.motto}" — 45+ years of pure vegetarian highway heritage, 24-hour slow-cooked Dal Makhani, and clay-oven tandoor craft.
        </p>

        <div class="flex items-center gap-2 text-xs font-mono text-green-400 pt-1">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <span>100% Shuddh Pure Vegetarian Kitchen</span>
        </div>
        <p class="text-[10px] font-mono text-white/40">
          FSSAI Lic. No: {BRAND_INFO.fssaiNumber}
        </p>
      </div>

      <!-- Quick Nav (Col 6-8) -->
      <div class="lg:col-span-3 space-y-3">
        <h4 class="font-display text-sm font-bold uppercase tracking-wider text-[#E4A834]">Quick Navigation</h4>
        <ul class="space-y-2 text-xs text-white/70 font-display uppercase tracking-wider">
          <li><a href="#home" class="hover:text-white transition">Home</a></li>
          <li><a href="#story" class="hover:text-white transition">1980 Highway Soul</a></li>
          <li><a href="#signatures" class="hover:text-white transition">Crown Signatures</a></li>
          <li><a href="#bestsellers" class="hover:text-white transition">Top Bestsellers</a></li>
          <li><a href="#full-menu" class="hover:text-white transition">All 19+ Menu Dishes</a></li>
          <li><a href="#outlets" class="hover:text-white transition">5 Indore Outlets</a></li>
          <li><a href="#reviews" class="hover:text-white transition">Patron Reviews</a></li>
        </ul>
      </div>

      <!-- 5 Outlets List (Col 9-12) -->
      <div class="lg:col-span-4 space-y-3">
        <h4 class="font-display text-sm font-bold uppercase tracking-wider text-[#E4A834]">Five Indore Outlets</h4>
        <ul class="space-y-2 text-xs text-white/70">
          {OUTLETS.map((o) => (
            <li>
              <strong class="text-white">{o.name}:</strong> {o.subtitle}
            </li>
          ))}
        </ul>
        <div class="pt-2 text-xs text-white/60 font-mono">
          <span>Open 7 Days: 11:00 AM - 11:30 PM</span>
        </div>
      </div>

    </div>

    <!-- Bottom Copyright -->
    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-4 pb-safe">
      <p>© 1980 - 2026 Nanaksar Dhaba (Indore). All Rights Reserved.</p>
      <p class="text-[11px] text-white/30">
        Pure Sewa Bhaav • Shuddh Desi Ghee • Indore, Madhya Pradesh
      </p>
    </div>
  </div>
</footer>
"""
write_file("src/components/Footer.astro", footer_code)

index_code = """---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import HeritageStory from '../components/HeritageStory.astro';
import SignaturesShowcase from '../components/SignaturesShowcase';
import BestsellersShowcase from '../components/BestsellersShowcase';
import MenuExplorer from '../components/MenuExplorer';
import OutletsDirectory from '../components/OutletsDirectory.astro';
import ReviewsSection from '../components/ReviewsSection.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <!-- 1. Flagship Hero & 5-Outlet Docked Status Ribbon -->
  <Hero />

  <!-- 2. Heritage Story & 24-Hour Bhatti Craft -->
  <HeritageStory />

  <!-- 3. Section 1: Crown Signatures (5 Flagship Dishes) -->
  <SignaturesShowcase client:visible />

  <!-- 4. Section 2: Top Bestsellers & Highway Combos -->
  <BestsellersShowcase client:visible />

  <!-- 5. Expandable All-Categories Menu Directory (19+ Items with Jain & Swaminarayan Toggles) -->
  <MenuExplorer client:visible />

  <!-- 6. Five Indore Outlets Directory -->
  <OutletsDirectory />

  <!-- 7. Social Proof & 4.4 Star Google Rating -->
  <ReviewsSection />

  <!-- 8. Comprehensive Brand Footer -->
  <Footer />
</Layout>
"""
write_file("src/pages/index.astro", index_code)
