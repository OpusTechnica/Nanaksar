from write_files import write_file

platforms_section = """---
const PLATFORMS = [
  {
    id: "swiggy",
    partnerTag: "INSTANT DELIVERY PARTNER",
    tagColor: "text-[#FC8019]",
    name: "SWIGGY",
    subtitle: "Lightning-fast Delivery",
    rating: "4.7",
    reviewCount: "2.3L+ reviews",
    sentiment: "Rated EXCELLENT by food lovers",
    url: "https://www.swiggy.com/city/indore/nanaksar-dhaba-vijay-nagar-rest133832",
    btnText: "ORDER ON SWIGGY",
    btnClass: "bg-[#FC8019] hover:bg-[#E56F08] text-white",
    cardBorder: "hover:border-[#FC8019]/60",
    iconType: "swiggy"
  },
  {
    id: "zomato",
    partnerTag: "GREAT FOOD. FAST.",
    tagColor: "text-[#E23744]",
    name: "ZOMATO",
    subtitle: "Discover. Order. Enjoy.",
    rating: "4.5",
    reviewCount: "1.8L+ reviews",
    sentiment: "Rated VERY GOOD by food lovers",
    url: "https://www.zomato.com/indore/nanaksar-dhaba-dewas-naka",
    btnText: "ORDER ON ZOMATO",
    btnClass: "bg-[#E23744] hover:bg-[#CC2532] text-white",
    cardBorder: "hover:border-[#E23744]/60",
    iconType: "zomato"
  },
  {
    id: "magicpin",
    partnerTag: "LIVE TRACKING. ON TIME.",
    tagColor: "text-[#9B80FF]",
    name: "MAGICPIN",
    subtitle: "Exclusive Offers & Savings",
    rating: "4.3",
    reviewCount: "96K+ reviews",
    sentiment: "Rated VERY GOOD by food lovers",
    url: "https://magicpin.in/Indore/Dewas-Naka/Restaurant/Nanaksar-Dhaba/",
    btnText: "ORDER ON MAGICPIN",
    btnClass: "bg-[#5B3CE6] hover:bg-[#4828D6] text-white",
    cardBorder: "hover:border-[#5B3CE6]/60",
    iconType: "magicpin"
  },
  {
    id: "google",
    partnerTag: "TRUSTED REVIEWS. REAL PEOPLE.",
    tagColor: "text-[#4285F4]",
    name: "GOOGLE REVIEWS",
    subtitle: "Read Authentic Reviews",
    rating: "4.6",
    reviewCount: "1.2K+ reviews",
    sentiment: "Rated EXCELLENT by food lovers",
    url: "https://maps.google.com/?q=Nanaksar+Dhaba+Dewas+Naka+Indore",
    btnText: "VIEW ON GOOGLE MAPS",
    btnClass: "bg-[#1A73E8] hover:bg-[#1557B0] text-white",
    cardBorder: "hover:border-[#1A73E8]/60",
    iconType: "google"
  }
];
---

<section id="platforms" class="py-20 sm:py-28 bg-[#0A0A0A] text-white border-t border-white/10 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    <!-- Section Eyebrow & Headline -->
    <div class="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5A93C]/40 bg-[#121212] mb-4">
        <span class="font-display text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#E5A93C] uppercase">
          DELIVERY &amp; DISCOVERY
        </span>
      </div>

      <h2 class="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-[0.95]">
        AVAILABLE ON YOUR <span class="text-[#E5A93C]">FAVORITE APPS</span>
      </h2>

      <p class="mt-4 text-sm sm:text-base text-white/70 font-sans max-w-2xl mx-auto leading-relaxed">
        Prefer doorstep delivery with real-time tracking or want to browse authentic customer reviews? Click any official partner to visit our verified space.
      </p>
    </div>

    <!-- 4 Platform Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {PLATFORMS.map((p) => (
        <div class={`bg-[#121212] rounded-2xl p-6 border border-white/10 ${p.cardBorder} transition-all duration-300 flex flex-col justify-between text-center group shadow-xl hover:translate-y-[-2px]`}>
          
          <div>
            <!-- Top Partner Tag -->
            <p class={`text-[10px] font-mono font-bold tracking-wider uppercase mb-5 ${p.tagColor}`}>
              {p.partnerTag}
            </p>

            <!-- Authentic Brand Icon Badge -->
            <div class="mb-4 flex justify-center">
              {p.iconType === 'swiggy' && (
                <div class="w-16 h-16 rounded-full bg-[#FC8019] flex items-center justify-center shadow-lg ring-4 ring-[#FC8019]/20 group-hover:scale-105 transition-transform">
                  <svg class="w-9 h-9 fill-white" viewBox="0 0 100 100">
                    <path d="M50 8C33.4 8 20 21.4 20 38c0 19.3 27 52.8 28.2 54.2 1 1.2 2.6 1.8 4.1 1.8s3.1-.6 4.1-1.8C57.6 90.8 80 57.3 80 38 80 21.4 66.6 8 50 8zm-2.2 46.5c-4.6 0-8.3-3.7-8.3-8.3 0-4.6 3.7-8.3 8.3-8.3 4.6 0 8.3 3.7 8.3 8.3 0 4.6-3.7 8.3-8.3 8.3z"/>
                    <path d="M50.2 22.3c-8.7 0-15.8 7.1-15.8 15.8 0 8.7 7.1 15.8 15.8 15.8 8.7 0 15.8-7.1 15.8-15.8 0-8.7-7.1-15.8-15.8-15.8zm0 24.2c-4.6 0-8.4-3.8-8.4-8.4s3.8-8.4 8.4-8.4 8.4 3.8 8.4 8.4-3.8 8.4-8.4 8.4z"/>
                  </svg>
                </div>
              )}

              {p.iconType === 'zomato' && (
                <div class="w-16 h-16 rounded-full bg-[#E23744] flex items-center justify-center shadow-lg ring-4 ring-[#E23744]/20 group-hover:scale-105 transition-transform px-2">
                  <span class="font-sans font-black text-white text-xs tracking-tighter lowercase italic transform -rotate-2">
                    zomato
                  </span>
                </div>
              )}

              {p.iconType === 'magicpin' && (
                <div class="w-16 h-16 rounded-full bg-[#4A2EC5] flex items-center justify-center shadow-lg ring-4 ring-[#4A2EC5]/20 group-hover:scale-105 transition-transform px-2">
                  <span class="font-sans font-bold text-white text-xs tracking-tight lowercase">
                    magicpin
                  </span>
                </div>
              )}

              {p.iconType === 'google' && (
                <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg ring-4 ring-white/20 group-hover:scale-105 transition-transform">
                  <svg class="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
              )}
            </div>

            <!-- Platform Name & Tagline -->
            <h3 class="font-display text-2xl font-bold uppercase text-white tracking-wide leading-tight">
              {p.name}
            </h3>
            <p class="text-xs text-white/60 font-sans mt-1">
              {p.subtitle}
            </p>

            <!-- Inner Rating Box (Exact Mockup Match) -->
            <div class="bg-[#181818] rounded-xl p-3 my-5 border border-white/5 text-center">
              <div class="flex items-center justify-center gap-2 text-xs font-mono font-bold text-white">
                <span class="text-[#E5A93C]">★ {p.rating}</span>
                <span class="text-white/30">|</span>
                <span class="text-white/70 font-sans font-normal">({p.reviewCount})</span>
              </div>
              <p class="text-[10px] text-white/50 font-sans mt-1">
                {p.sentiment}
              </p>
            </div>
          </div>

          <!-- Outbound Redirect Button -->
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            class={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition ${p.btnClass} min-h-[44px] shadow-lg`}
          >
            <span>{p.btnText}</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

        </div>
      ))}
    </div>

    <!-- Bottom Verified & Trusted Ribbon -->
    <div class="flex items-center justify-center gap-3 sm:gap-4 mt-12 sm:mt-16 text-[10px] sm:text-xs font-mono tracking-widest text-[#E5A93C] uppercase">
      <div class="w-12 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-[#E5A93C]/40"></div>
      <span class="text-white/70">100% OFFICIAL PARTNERS</span>
      <svg class="w-4 h-4 text-[#E5A93C] fill-[#E5A93C]/15 shrink-0" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span class="text-white/70">VERIFIED &amp; TRUSTED</span>
      <div class="w-12 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-[#E5A93C]/40"></div>
    </div>

  </div>
</section>
"""
write_file("src/components/PlatformsSection.astro", platforms_section)
print("Updated PlatformsSection.astro with exact mockup fidelity.")
