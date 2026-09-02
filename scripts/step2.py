from write_files import write_file

menu_explorer_code = """
import React, { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { addToCart } from '../data/cartStore';

export default function MenuExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [jainOnly, setJainOnly] = useState<boolean>(false);
  const [swaminarayanOnly, setSwaminarayanOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Specialties' },
    { id: 'dal', label: 'Dal Specialties' },
    { id: 'paneer', label: 'Paneer Gravies' },
    { id: 'chaap', label: 'Soya Chaap' },
    { id: 'sabjiya', label: 'Indori Sabjiya' },
    { id: 'combos', label: 'Thalis & Combos' },
    { id: 'breads', label: 'Tandoori Breads' },
    { id: 'rice', label: 'Rice & Khichdi' },
    { id: 'desserts', label: 'Desserts & Sweets' },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (jainOnly && !item.isJainAvailable) {
      return false;
    }
    if (swaminarayanOnly && !item.isSwaminarayanAvailable) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAdd = (item: MenuItem) => {
    const portion = item.priceHalf ? 'half' : (item.priceSingle ? 'single' : 'full');
    const diet = jainOnly ? 'jain' : (swaminarayanOnly ? 'swaminarayan' : 'regular');
    addToCart(item, portion, diet);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section id="full-menu" className="py-20 sm:py-28 bg-[#F7F4EB] text-[#0F0F0F] border-t border-[#0F0F0F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#D01B1B]">
            FULL MENU DIRECTORY
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-[#0F0F0F] mt-1">
            Explore All Categories
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#0F0F0F]/70">
            Filtered live for Jain and Swaminarayan preparations. Direct takeaway order dispatch to your chosen Indore outlet.
          </p>
        </div>

        {/* Search & Dietary Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#0F0F0F]/10 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#0F0F0F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dal, Paneer, Naan, Thali..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F4EB] border border-[#0F0F0F]/10 focus:border-[#D01B1B] outline-none rounded-xl pl-10 pr-4 py-2.5 text-base md:text-xs text-[#0F0F0F] placeholder-[#0F0F0F]/40"
            />
          </div>

          {/* Dietary Toggles */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setJainOnly(!jainOnly);
                if (!jainOnly) setSwaminarayanOnly(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition min-h-[40px] border ${
                jainOnly
                  ? 'bg-green-700 text-white border-green-700 shadow'
                  : 'bg-[#F7F4EB] text-green-900 border-green-600/30 hover:bg-green-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${jainOnly ? 'bg-white' : 'bg-green-600'}`}></span>
              <span>Jain Friendly Only</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSwaminarayanOnly(!swaminarayanOnly);
                if (!swaminarayanOnly) setJainOnly(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition min-h-[40px] border ${
                swaminarayanOnly
                  ? 'bg-[#965C00] text-white border-[#965C00] shadow'
                  : 'bg-[#F7F4EB] text-[#965C00] border-amber-500/30 hover:bg-amber-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${swaminarayanOnly ? 'bg-white' : 'bg-[#965C00]'}`}></span>
              <span>Swaminarayan Prep</span>
            </button>
          </div>

        </div>

        {/* Category Filter Tabs (Swipeable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`snap-start shrink-0 px-4 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition min-h-[40px] ${
                selectedCategory === cat.id
                  ? 'bg-[#0F0F0F] text-white shadow'
                  : 'bg-white text-[#0F0F0F]/70 border border-[#0F0F0F]/10 hover:bg-[#0F0F0F]/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Catalog Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#0F0F0F]/10 max-w-lg mx-auto">
            <p className="font-display text-xl font-bold uppercase text-[#0F0F0F]">No Items Matched</p>
            <p className="text-xs text-[#0F0F0F]/60 mt-1">
              Try turning off the dietary filter or resetting your search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setJainOnly(false);
                setSwaminarayanOnly(false);
                setSearchQuery('');
              }}
              className="mt-4 bg-[#D01B1B] text-white px-4 py-2 rounded-lg text-xs font-display font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const price = item.priceSingle || item.priceHalf || item.priceFull;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-black/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="bg-white/95 text-green-700 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-green-600/30">
                          VEG
                        </span>
                        {item.isJainAvailable && (
                          <span className="bg-amber-100 text-[#965C00] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                            JAIN
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <span className="text-[9px] font-mono text-[#D01B1B] font-bold uppercase block">
                        {item.categoryLabel}
                      </span>
                      <h4 className="font-display text-base font-bold uppercase text-[#0F0F0F] mt-0.5 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#0F0F0F]/70 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-[#0F0F0F]/5 mt-2">
                    <span className="font-mono text-sm font-bold text-[#D01B1B]">
                      ₹{price}/-
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdd(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition min-h-[36px] ${
                        addedItem === item.id
                          ? 'bg-green-700 text-white'
                          : 'bg-[#0F0F0F] hover:bg-[#D01B1B] text-white'
                      }`}
                    >
                      {addedItem === item.id ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
"""
write_file("src/components/MenuExplorer.tsx", menu_explorer_code)

heritage_story_code = """---
import { BRAND_INFO } from '../data/restaurantData';
---

<section id="story" class="py-20 sm:py-28 bg-[#0F0F0F] text-white border-t border-white/10 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    <!-- Section Header -->
    <div class="max-w-3xl mb-16 text-left">
      <span class="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#E4A834]">
        SINCE 1980 • HIGHWAY HERITAGE
      </span>
      <h2 class="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-none mt-2">
        45+ Years of <span class="text-[#D01B1B]">Highway Soul</span> & Sewa
      </h2>
      <p class="mt-4 text-sm sm:text-base text-white/70 leading-relaxed font-sans">
        From a humble roadside stop along Dewas Naka founded by Avtar Singh ("Veer Ji") in 1980, Nanaksar Dhaba has grown into Indore's iconic institution for slow-cooked North Indian vegetarian purity.
      </p>
    </div>

    <!-- 2-Column Editorial Showcase -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Left: 4-Stage 24-Hour Dal Makhani Bhatti Craft -->
      <div class="lg:col-span-7 bg-[#181818] rounded-3xl p-6 sm:p-10 border border-white/10 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <span class="font-display text-xs font-bold text-[#E4A834] uppercase tracking-widest">
              THE 24-HOUR CULINARY RITUAL
            </span>
            <span class="bg-[#D01B1B] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              BHATTI SIMMER
            </span>
          </div>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-[#E4A834]/15 text-[#E4A834] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#E4A834]/30">
                01
              </div>
              <div>
                <h4 class="font-display text-lg font-bold text-white uppercase">Overnight Lentil Soaking</h4>
                <p class="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                  Whole black urad lentils (sabut urad) are sorted, triple-washed, and soaked overnight for 8 to 10 hours in clean water.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-[#E4A834]/15 text-[#E4A834] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#E4A834]/30">
                02
              </div>
              <div>
                <h4 class="font-display text-lg font-bold text-white uppercase">Low-Smoke Green Bhatti Furnaces</h4>
                <p class="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                  Lentils transfer into thick brass deghs set over slow-burning eco-friendly bhattis, releasing gentle consistent heat.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-[#E4A834]/15 text-[#E4A834] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#E4A834]/30">
                03
              </div>
              <div>
                <h4 class="font-display text-lg font-bold text-white uppercase">10 to 14 Hour Gravy Reduction</h4>
                <p class="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                  Continuous simmering with fresh tomato purees and churning ladles of unsalted white butter creates natural velvet creaminess without artificial thickeners.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-[#D01B1B]/20 text-[#D01B1B] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#D01B1B]/40">
                04
              </div>
              <div>
                <h4 class="font-display text-lg font-bold text-[#E4A834] uppercase">Shuddh Desi Ghee Tempering</h4>
                <p class="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                  Finished with fresh coriander, cream, and a smoking ladle of pure cow desi ghee right before stainless-steel thali service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/60">
          <span>• Zero Preservatives</span>
          <span>• Zero Artificial Colors</span>
          <span>• 100% Desi Ghee Purity</span>
        </div>
      </div>

      <!-- Right: Veer Ji's Highway Genesis Card -->
      <div class="lg:col-span-5 flex flex-col gap-6">
        
        <div class="bg-[#181818] rounded-3xl p-6 sm:p-8 border border-white/10 flex-1 flex flex-col justify-between">
          <div>
            <div class="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider text-[#E4A834] mb-3">
              <span>FOUNDED BY AVTAR SINGH ("VEER JI")</span>
            </div>
            <h3 class="font-display text-2xl sm:text-3xl font-bold uppercase text-white leading-tight">
              "Ghar Jaisa Swad. Seva Wala Pyar."
            </h3>
            <p class="font-serif italic text-sm text-white/80 mt-3 leading-relaxed">
              "When we started on Dewas Naka in 1980, the highway was dark and long-distance drivers sought only honest food that tasted of home. We promised never to compromise on ghee, cleanliness, or sewa. Today, families come from all corners of Indore, but our bhatti still burns with that exact same spirit."
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-[#D01B1B]/20 text-[#D01B1B] font-display font-bold flex items-center justify-center border border-[#D01B1B]/40">
              AS
            </div>
            <div>
              <h5 class="font-display text-sm font-bold uppercase text-white">Avtar Singh (Veer Ji)</h5>
              <p class="text-[11px] text-[#E4A834] font-mono">Founder • Nanaksar Dhaba Indore</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-[#D01B1B] to-[#961212] rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
          <div>
            <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-white/80 block">
              OUR LIFELONG COMMITMENT
            </span>
            <h4 class="font-display text-xl sm:text-2xl font-bold uppercase mt-0.5">
              100% Shuddh Pure Vegetarian
            </h4>
            <p class="text-xs text-white/90 mt-1">
              Strictly pure vegetarian kitchens across all 5 Indore branches.
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 ml-3">
            <span class="w-4 h-4 rounded-full bg-green-400"></span>
          </div>
        </div>

      </div>

    </div>

  </div>
</section>
"""
write_file("src/components/HeritageStory.astro", heritage_story_code)
