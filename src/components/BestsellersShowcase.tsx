import React, { useState } from 'react';
import { Plus, Check, ArrowRight, Star } from './ui/Icon';
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
    <section id="bestsellers" className="py-20 sm:py-28 bg-[#F7F4EB] text-[#0F0F0F] relative border-t border-[#0F0F0F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#965C00]/10 border border-[#965C00]/30 text-[#965C00] text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>INDORE DINING FAVORITES</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#0F0F0F] leading-[0.95]">
              Top <span className="text-[#D01B1B]">Bestsellers</span> &amp; Combos
            </h2>
            <p className="mt-3 text-sm text-[#0F0F0F]/70 max-w-xl font-sans">
              The most ordered feast boxes, tandoori soya chaap, and comfort thalis across Swiggy, Zomato, and our 5 takeaway counters.
            </p>
          </div>

          <a
            href="/all-categories"
            className="inline-flex items-center gap-2 bg-[#0F0F0F] hover:bg-[#D01B1B] text-white px-6 py-3 rounded-xl font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition min-h-[44px] shrink-0"
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
                className="bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-white text-green-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-green-600/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        PURE VEG
                      </span>
                      {item.isJainAvailable && (
                        <span className="bg-[#F4EBD0] text-[#965C00] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-[#965C00]/30">
                          JAIN OK
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[#965C00] uppercase tracking-wider font-bold">
                        {item.categoryLabel}
                      </span>
                      <span className="font-mono text-base font-bold text-[#D01B1B]">
                        ₹{price}/-
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#0F0F0F] group-hover:text-[#D01B1B] transition">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#0F0F0F]/65 mt-1.5 line-clamp-2 leading-relaxed">
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
