from write_files import write_file

signatures_code = """
import React, { useState } from 'react';
import { Plus, Check, Flame } from 'lucide-react';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { addToCart } from '../data/cartStore';

export default function SignaturesShowcase() {
  const signatures = MENU_ITEMS.filter((item) => item.isSignature);
  const [selectedPortions, setSelectedPortions] = useState<Record<string, 'half' | 'full' | 'single'>>({});
  const [dietaryOptions, setDietaryOptions] = useState<Record<string, 'regular' | 'jain' | 'swaminarayan'>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handlePortionChange = (itemId: string, portion: 'half' | 'full' | 'single') => {
    setSelectedPortions((prev) => ({ ...prev, [itemId]: portion }));
  };

  const handleDietaryChange = (itemId: string, diet: 'regular' | 'jain' | 'swaminarayan') => {
    setDietaryOptions((prev) => ({ ...prev, [itemId]: diet }));
  };

  const handleAdd = (item: MenuItem) => {
    const portion = selectedPortions[item.id] || (item.priceHalf ? 'half' : (item.priceSingle ? 'single' : 'full'));
    const diet = dietaryOptions[item.id] || 'regular';
    addToCart(item, portion, diet);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section id="signatures" className="py-20 sm:py-28 bg-[#F7F4EB] text-[#0F0F0F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D01B1B]/10 border border-[#D01B1B]/30 text-[#D01B1B] text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>HERITAGE CRAFT SINCE 1980</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#0F0F0F] leading-[0.95]">
            Crown <span className="text-[#D01B1B]">Signatures</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#0F0F0F]/75 font-sans max-w-xl mx-auto leading-relaxed">
            The dishes that built our reputation across Central India. Slow-cooked over bhattis, finished in pure desi ghee, and perfected over 45 years.
          </p>
        </div>

        {/* 5 Signature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {signatures.map((item, idx) => {
            const currentPortion = selectedPortions[item.id] || (item.priceHalf ? 'half' : (item.priceSingle ? 'single' : 'full'));
            const currentDiet = dietaryOptions[item.id] || 'regular';
            const price = currentPortion === 'half' ? item.priceHalf : (currentPortion === 'full' ? item.priceFull : item.priceSingle);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-1 ring-1 ring-[#D01B1B]/20' : ''
                }`}
              >
                <div>
                  {/* Image Presentation */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-green-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-green-600/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        PURE VEG
                      </span>
                      {item.isJainAvailable && (
                        <span className="bg-amber-100 text-[#965C00] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                          JAIN OPTION
                        </span>
                      )}
                    </div>
                    {item.isSignature && (
                      <div className="absolute top-3 right-3 bg-[#D01B1B] text-white font-display text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
                        SIGNATURE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#0F0F0F] group-hover:text-[#D01B1B] transition leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0F0F0F]/70 mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Portion Controls */}
                    {item.priceHalf && item.priceFull ? (
                      <div className="mt-4 pt-4 border-t border-[#0F0F0F]/5 flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase text-[#0F0F0F]/60">Portion:</span>
                        <div className="inline-flex bg-[#F7F4EB] p-0.5 rounded-lg border border-[#0F0F0F]/10">
                          <button
                            type="button"
                            onClick={() => handlePortionChange(item.id, 'half')}
                            className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition min-h-[32px] ${
                              currentPortion === 'half'
                                ? 'bg-[#0F0F0F] text-white'
                                : 'text-[#0F0F0F]/70 hover:text-[#0F0F0F]'
                            }`}
                          >
                            Half: ₹{item.priceHalf}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePortionChange(item.id, 'full')}
                            className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition min-h-[32px] ${
                              currentPortion === 'full'
                                ? 'bg-[#0F0F0F] text-white'
                                : 'text-[#0F0F0F]/70 hover:text-[#0F0F0F]'
                            }`}
                          >
                            Full: ₹{item.priceFull}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-[#0F0F0F]/5 flex items-center justify-between">
                        <span className="text-xs font-display font-bold uppercase text-[#0F0F0F]/60">Price:</span>
                        <span className="font-mono text-base font-bold text-[#D01B1B]">
                          ₹{item.priceSingle}/-
                        </span>
                      </div>
                    )}

                    {/* Jain / Regular Toggle */}
                    {item.isJainAvailable && (
                      <div className="mt-3 flex items-center gap-2">
                        <label className="text-[11px] font-display uppercase tracking-wide text-[#0F0F0F]/60">Prep:</label>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleDietaryChange(item.id, 'regular')}
                            className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                              currentDiet === 'regular'
                                ? 'bg-[#0F0F0F] text-white border-[#0F0F0F]'
                                : 'bg-transparent text-[#0F0F0F]/60 border-black/10'
                            }`}
                          >
                            Regular
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDietaryChange(item.id, 'jain')}
                            className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                              currentDiet === 'jain'
                                ? 'bg-green-700 text-white border-green-700 font-bold'
                                : 'bg-transparent text-green-800 border-green-300'
                            }`}
                          >
                            Jain
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs transition min-h-[44px] ${
                      addedItem === item.id
                        ? 'bg-green-700 text-white'
                        : 'bg-[#0F0F0F] hover:bg-[#D01B1B] text-white'
                    }`}
                  >
                    {addedItem === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add To Takeaway • ₹{price}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
"""
write_file("src/components/SignaturesShowcase.tsx", signatures_code)

bestsellers_code = """
import React, { useState } from 'react';
import { Plus, Check, ArrowRight, Star } from 'lucide-react';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { addToCart } from '../data/cartStore';

export default function BestsellersShowcase() {
  const bestsellers = MENU_ITEMS.filter((item) => item.isBestseller && !item.isSignature).slice(0, 6);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    const portion = item.priceSingle ? 'single' : (item.priceHalf ? 'half' : 'full');
    addToCart(item, portion, 'regular');
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section id="bestsellers" className="py-20 sm:py-28 bg-[#0F0F0F] text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E4A834]/15 border border-[#E4A834]/30 text-[#E4A834] text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>INDORE DINING FAVORITES</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-[0.95]">
              Top <span className="text-[#E4A834]">Bestsellers</span> & Combos
            </h2>
            <p className="mt-3 text-sm text-white/70 max-w-xl font-sans">
              The most ordered feast boxes, tandoori soya chaap, and comfort thalis across Swiggy, Zomato, and our 5 takeaway counters.
            </p>
          </div>

          <a
            href="#full-menu"
            className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 border border-[#E4A834] text-[#E4A834] px-6 py-3 rounded-xl font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition min-h-[44px] shrink-0"
          >
            <span>Explore All 19+ Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 6 Bestseller Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((item) => {
            const price = item.priceSingle || item.priceHalf || item.priceFull;

            return (
              <div
                key={item.id}
                className="bg-[#181818] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E4A834]/50 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/40">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-[#0F0F0F]/90 text-green-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        PURE VEG
                      </span>
                      {item.isJainAvailable && (
                        <span className="bg-[#0F0F0F]/90 text-[#E4A834] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#E4A834]/40">
                          JAIN OK
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-wider font-bold">
                        {item.categoryLabel}
                      </span>
                      <span className="font-mono text-base font-bold text-white">
                        ₹{price}/-
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white group-hover:text-[#E4A834] transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-xs transition min-h-[44px] ${
                      addedItem === item.id
                        ? 'bg-green-700 text-white'
                        : 'bg-white/10 hover:bg-[#D01B1B] text-white'
                    }`}
                  >
                    {addedItem === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add To Order • ₹{price}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
"""
write_file("src/components/BestsellersShowcase.tsx", bestsellers_code)
