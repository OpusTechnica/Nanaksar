import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check } from './ui/Icon';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { addToCart } from '../data/cartStore';

const PAGE_CHUNK_SIZE = 16;

export default function MenuExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [jainOnly, setJainOnly] = useState<boolean>(false);
  const [swaminarayanOnly, setSwaminarayanOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_CHUNK_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // Reset visible slice when filters change so rendering is instantaneous (< 16ms)
  useEffect(() => {
    setVisibleCount(PAGE_CHUNK_SIZE);
  }, [selectedCategory, jainOnly, swaminarayanOnly, searchQuery]);

  // Windowed Intersection Observer: Auto-stream next batch only as user scrolls near bottom
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK_SIZE, filteredItems.length));
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredItems.length]);

  // Scroll Position Persistence across Astro ViewTransitions
  useEffect(() => {
    const handleBeforeSwap = () => {
      sessionStorage.setItem('nanaksar_menu_scroll', window.scrollY.toString());
    };
    document.addEventListener('astro:before-swap', handleBeforeSwap);

    const savedScroll = sessionStorage.getItem('nanaksar_menu_scroll');
    if (savedScroll) {
      const pos = parseInt(savedScroll, 10);
      if (!isNaN(pos) && pos > 0) {
        requestAnimationFrame(() => window.scrollTo(0, pos));
      }
    }

    return () => document.removeEventListener('astro:before-swap', handleBeforeSwap);
  }, []);

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
        <div className="bg-white p-4 rounded-2xl border border-[#0F0F0F]/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
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
                  ? 'bg-green-700 text-white border-green-700'
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
                  ? 'bg-[#965C00] text-white border-[#965C00]'
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
                  ? 'bg-[#0F0F0F] text-white'
                  : 'bg-white text-[#0F0F0F]/70 border border-[#0F0F0F]/10 hover:bg-[#0F0F0F]/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Capacity Indicator Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-[#0F0F0F]/60 mb-4 px-1">
          <span>Showing {Math.min(visibleCount, filteredItems.length)} of {filteredItems.length} dishes</span>
          {filteredItems.length > PAGE_CHUNK_SIZE && (
            <span className="text-[11px] text-[#0F0F0F]/40 hidden sm:inline">Smooth 60 FPS Progressive Windowing</span>
          )}
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
            {filteredItems.slice(0, visibleCount).map((item) => {
              const price = item.priceSingle || item.priceHalf || item.priceFull;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Fixed aspect-ratio image container (CLS = 0.00 guarantee) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181818]">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                      />
                      <div className="absolute top-2 left-2 flex gap-1 z-10">
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

        {/* Sentinel Anchor for Progressive Windowing of 250+ Items */}
        {visibleCount < filteredItems.length && (
          <div ref={sentinelRef} className="pt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK_SIZE, filteredItems.length))}
              className="px-6 py-2.5 rounded-xl border border-[#0F0F0F]/15 bg-white text-[#0F0F0F] font-display text-xs font-bold uppercase tracking-wider hover:border-[#D01B1B] transition shadow-sm"
            >
              Load More Recipes ({filteredItems.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
