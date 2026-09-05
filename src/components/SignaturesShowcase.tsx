import React, { useState } from 'react';
import { Plus, Check, Flame } from './ui/Icon';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { addToCart } from '../data/cartStore';

// Top 3 Verified Crown Signatures of Nanaksar Dhaba
const CROWN_SIGNATURE_IDS = ['dal-makhani', 'chur-chur-naan-stuffed', 'paneer-angara'];

export default function SignaturesShowcase() {
  const signatures = CROWN_SIGNATURE_IDS.map((id) =>
    MENU_ITEMS.find((item) => item.id === id)
  ).filter((item): item is MenuItem => Boolean(item));
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    const portion = item.priceFull ? 'full' : (item.priceSingle ? 'single' : 'half');
    addToCart(item, portion, 'regular');
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <section id="signatures" className="py-20 sm:py-28 bg-[#F7F4EB] text-[#0F0F0F] relative border-t border-[#0F0F0F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D01B1B]/10 border border-[#D01B1B]/30 text-[#D01B1B] text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>HERITAGE CRAFT • ROOTS SINCE 1980</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#0F0F0F] leading-[0.95]">
            Crown <span className="text-[#D01B1B]">Signatures</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#0F0F0F]/75 font-sans max-w-xl mx-auto leading-relaxed">
            The three hallmark dishes that established our culinary authority in Central India. Slow-cooked over traditional bhattis, finished in pure cow desi ghee, and served with sewa.
          </p>
        </div>

        {/* 3 Crown Signature Cards Grid (High-Impact 3-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
          {signatures.map((item) => {
            const price = item.priceFull || item.priceSingle;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition-all duration-200 flex flex-col justify-between group shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              >
                <div>
                  {/* Image Presentation */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={700}
                      height={560}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-white text-green-700 font-sans text-[10px] font-bold px-2 py-0.5 rounded border border-green-600/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        PURE VEG
                      </span>
                      {item.isJainAvailable && (
                        <span className="bg-[#F4EBD0] text-[#965C00] font-sans text-[10px] font-bold px-2 py-0.5 rounded border border-[#965C00]/30">
                          JAIN OK
                        </span>
                      )}
                    </div>
                    {item.isSignature && (
                      <div className="absolute top-3 right-3 bg-[#D01B1B] text-white font-display text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                        SIGNATURE
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-sans text-[#965C00] uppercase tracking-wider font-bold">
                        {item.categoryLabel}
                      </span>
                      <span className="font-sans text-base font-bold text-[#D01B1B]">
                        ₹{price}/-
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#0F0F0F] group-hover:text-[#D01B1B] transition leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#0F0F0F]/65 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0 mt-auto">
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
                        <span>Add To Takeaway • ₹{price}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Explore Full Menu & Specialty Preparations CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href="/all-categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#0F0F0F]/15 hover:border-[#D01B1B] hover:text-[#D01B1B] text-[#0F0F0F] font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition shadow-sm"
          >
            <span>Explore Full Menu &amp; Specialty Dishes</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

      </div>
    </section>
  );
}
