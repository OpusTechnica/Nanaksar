import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { Search, ChevronDown, X, Menu, Utensils, ArrowRight, Check } from './ui/Icon';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { $cart, addToCart, updateCartQuantity, openCart } from '../data/cartStore';
import {
  CATEGORIES,
  SORT_OPTIONS,
  PRICE_TIERS,
  PAGE_CHUNK_SIZE,
  itemMatchesCategory,
  itemMatchesPrice,
  filterAndSortMenuItems,
} from './menu/MenuFilters';
import DishCard from './menu/DishCard';

export default function MenuExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [jainOnly, setJainOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_CHUNK_SIZE);

  const cart = useStore($cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // O(1) quantity lookup map to pass primitive quantities to memoized DishCard
  const cartQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const ci of cart) {
      map.set(ci.id, ci.quantity);
      map.set(`${ci.menuItemId}-${ci.portion}`, ci.quantity);
      map.set(ci.menuItemId, (map.get(ci.menuItemId) || 0) + ci.quantity);
    }
    return map;
  }, [cart]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const sortPopoverRef = useRef<HTMLDivElement | null>(null);
  const catalogRef = useRef<HTMLElement | null>(null);

  // Smoothly anchor to the top of the dish catalog to prevent footer snapping
  const scrollToCatalogTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    requestAnimationFrame(() => {
      if (catalogRef.current) {
        const headerOffset = window.innerWidth < 1024 ? 80 : 100;
        const targetY = Math.max(
          0,
          catalogRef.current.getBoundingClientRect().top + window.scrollY - headerOffset
        );
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
      }
    });
  }, []);

  const handleSelectCategory = useCallback(
    (catId: string) => {
      setSelectedCategory(catId);
      setIsMobileMenuOpen(false);
      scrollToCatalogTop();
    },
    [scrollToCatalogTop]
  );

  const handleSelectPriceTier = useCallback(
    (tierId: string) => {
      setPriceFilter(tierId);
      scrollToCatalogTop();
    },
    [scrollToCatalogTop]
  );

  const handleResetAll = useCallback(() => {
    setSelectedCategory('all');
    setJainOnly(false);
    setSearchQuery('');
    setDebouncedQuery('');
    setPriceFilter('all');
    setSortBy('recommended');
    scrollToCatalogTop();
  }, [scrollToCatalogTop]);

  // Debounce search query by 150ms to eliminate keystroke render thrashing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Dynamic Item Counts per category (prevents dead-end 0-item states)
  const getCategoryCount = useCallback(
    (catId: string) => {
      return MENU_ITEMS.filter((item) => {
        if (!itemMatchesCategory(item, catId)) return false;
        if (jainOnly && !item.isJainAvailable) return false;
        if (!itemMatchesPrice(item, priceFilter)) return false;
        return true;
      }).length;
    },
    [jainOnly, priceFilter]
  );

  // Outside click listener for Sort Popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (sortPopoverRef.current && !sortPopoverRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSortOpen(false);
    };

    if (isSortOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSortOpen]);

  // Memoized Filter and Sort Engine (only runs when actual filter criteria change)
  const filteredItems = useMemo(() => {
    return filterAndSortMenuItems(MENU_ITEMS, {
      selectedCategory,
      jainOnly,
      priceFilter,
      searchQuery: debouncedQuery,
      sortBy,
    });
  }, [selectedCategory, jainOnly, priceFilter, debouncedQuery, sortBy]);

  // Reset visible slice when filters change
  useEffect(() => {
    setVisibleCount(PAGE_CHUNK_SIZE);
  }, [selectedCategory, jainOnly, debouncedQuery, sortBy, priceFilter]);

  // Windowed progressive loading via IntersectionObserver
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

  // Stable callbacks for memoized DishCards
  const handleAddToCart = useCallback(
    (item: MenuItem, portion: 'single' | 'half' | 'full', diet: 'jain' | 'regular') => {
      addToCart(item, portion, diet, false);
    },
    []
  );

  const handleUpdateQty = useCallback((cartItemId: string, delta: number) => {
    updateCartQuantity(cartItemId, delta);
  }, []);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    jainOnly ||
    searchQuery.trim() !== '' ||
    priceFilter !== 'all' ||
    sortBy !== 'recommended';

  const currentCategoryLabel =
    CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Items';

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Chef's Recommendation";

  return (
    <section id="full-menu" className="pt-20 sm:pt-28 pb-20 sm:pb-28 bg-[#F7F4EB] text-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#D01B1B] block mb-1">
            AUTHENTIC SCANNED MENU DIRECTORY
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase text-[#0F0F0F] tracking-tight">
            Explore All Categories
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#0F0F0F]/70">
            From our highway bhattis to your table. 100% Pure Desi Ghee &amp; authentic Indore recipes.
          </p>
        </div>

        {/* 2-Column Catalog Grid: Left Sticky Sidebar (Desktop) + Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================= */}
          {/* DESKTOP LEFT SIDEBAR (lg:col-span-3 sticky) */}
          {/* ========================================= */}
          <aside className="hidden lg:flex lg:flex-col lg:col-span-3 sticky top-24 max-h-[calc(100dvh-7rem)] bg-white rounded-2xl border border-[#0F0F0F]/10 shadow-sm overflow-hidden">
            {/* Frozen Fixed Header */}
            <div className="shrink-0 flex items-center justify-between p-4 pb-3 border-b border-[#0F0F0F]/10 bg-white z-10">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#D01B1B]" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-[#0F0F0F]">
                  Menu Categories
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetAll}
                  className="text-[11px] font-mono font-bold text-[#D01B1B] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Scrollable Categories List */}
            <div className="flex-1 overflow-y-auto overscroll-contain sidebar-scrollbar p-3.5 space-y-1">
              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isSelected = selectedCategory === cat.id;
                const isDisabled = count === 0 && !isSelected;

                return (
                  <button
                    key={cat.id}
                    disabled={isDisabled}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F0F0F] text-white font-bold shadow-sm'
                        : isDisabled
                        ? 'text-[#0F0F0F]/25 cursor-not-allowed opacity-40'
                        : 'text-[#111111] font-semibold hover:bg-[#F7F4EB] hover:text-[#D01B1B]'
                    }`}
                  >
                    <span className="truncate pr-2 font-display text-[13px] tracking-wide">
                      {cat.label}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#E4A834] text-[#0F0F0F]'
                          : 'bg-[#0F0F0F]/8 text-[#0F0F0F] group-hover:bg-[#D01B1B]/15 group-hover:text-[#D01B1B]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pinned Bottom Price Filter */}
            <div className="shrink-0 p-4 border-t border-[#0F0F0F]/10 bg-white z-10">
              <span className="text-[11px] font-mono text-[#0F0F0F]/70 uppercase tracking-wider block mb-2 font-bold">
                Filter By Price
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleSelectPriceTier(tier.id)}
                    className={`px-2.5 py-2 rounded-lg text-center text-[11px] font-mono font-bold transition border cursor-pointer ${
                      priceFilter === tier.id
                        ? 'bg-[#D01B1B] text-white border-[#D01B1B] shadow-sm'
                        : 'bg-[#F7F4EB] text-[#0F0F0F] border-[#0F0F0F]/15 hover:border-[#0F0F0F]/30 hover:bg-[#EFECE1]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ========================================= */}
          {/* MAIN CONTENT AREA (lg:col-span-9)        */}
          {/* ========================================= */}
          <main ref={catalogRef} className="lg:col-span-9 w-full min-h-[700px] lg:min-h-[850px] scroll-mt-28">
            {/* Controls Bar: Search + Sort Popover + Jain Toggle */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#0F0F0F]/10 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#0F0F0F]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Dal, Paneer, Naan, Chaap..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F7F4EB] border border-[#0F0F0F]/10 focus:border-[#D01B1B] outline-none rounded-xl pl-10 pr-8 py-2.5 text-base md:text-xs text-[#0F0F0F] placeholder-[#0F0F0F]/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setDebouncedQuery('');
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-xs font-mono text-[#0F0F0F]/40 hover:text-[#0F0F0F]"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Right Controls: Sort Popover + Jain Toggle */}
                <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-start">
                  {/* Sort Popover */}
                  <div className="relative" ref={sortPopoverRef}>
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider bg-[#0F0F0F] text-white hover:bg-[#222222] transition min-h-[44px] shadow-sm cursor-pointer"
                    >
                      <span className="text-[#E4A834] hidden xs:inline">Sort:</span>
                      <span className="truncate max-w-[130px] sm:max-w-none">{currentSortLabel}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          isSortOpen ? 'rotate-180 text-[#E4A834]' : 'text-white/60'
                        }`}
                      />
                    </button>

                    {isSortOpen && (
                      <div
                        role="listbox"
                        className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] bg-[#0D0D0D] text-white rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)] p-2 z-50 animate-fadeIn"
                      >
                        <div className="px-3 py-2 border-b border-white/10 text-[10px] font-mono text-[#E4A834] uppercase tracking-widest font-bold flex items-center justify-between">
                          <span>Sort Dishes By</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E4A834]" />
                        </div>
                        <div className="pt-1.5 space-y-1">
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              role="option"
                              aria-selected={sortBy === opt.id}
                              onClick={() => {
                                setSortBy(opt.id);
                                setIsSortOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs text-left transition font-display tracking-wide min-h-[44px] cursor-pointer ${
                                sortBy === opt.id
                                  ? 'bg-[#141414] text-[#E4A834] font-bold border border-[#E4A834]/40 shadow-sm'
                                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#E4A834]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Jain Friendly Only Toggle */}
                  <button
                    type="button"
                    onClick={() => setJainOnly(!jainOnly)}
                    aria-pressed={jainOnly}
                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider min-h-[44px] transition-all duration-200 cursor-pointer shadow-2xs ${
                      jainOnly
                        ? 'bg-[#0F0F0F] text-white border border-[#E4A834] ring-1 ring-[#E4A834]/30 shadow-sm'
                        : 'bg-white text-[#0F0F0F] border border-[#0F0F0F]/15 hover:border-[#E4A834] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        jainOnly
                          ? 'bg-[#E4A834] ring-2 ring-[#E4A834]/30'
                          : 'bg-emerald-600 ring-2 ring-emerald-600/20'
                      }`}
                    />
                    <span>
                      {jainOnly ? (
                        <>
                          <span className="text-[#E4A834]">Jain</span> Friendly
                        </>
                      ) : (
                        'Jain Friendly'
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters & Dish Count Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#0F0F0F]/60 mb-4 px-1 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Showing <strong className="text-[#0F0F0F]">{filteredItems.length}</strong>{' '}
                  {filteredItems.length === 1 ? 'dish' : 'authentic dishes'}
                </span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#0F0F0F] text-white px-2.5 py-0.5 rounded-full text-[11px] font-display font-bold uppercase">
                    {currentCategoryLabel}
                    <button
                      onClick={() => handleSelectCategory('all')}
                      className="text-white/70 hover:text-white ml-0.5 w-7 h-7 inline-flex items-center justify-center rounded-full shrink-0 relative after:absolute after:-inset-2 after:content-[''] cursor-pointer"
                      aria-label="Remove filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {priceFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#D01B1B] text-white px-2.5 py-0.5 rounded-full text-[11px] font-display font-bold uppercase">
                    {PRICE_TIERS.find((t) => t.id === priceFilter)?.label}
                    <button
                      onClick={() => handleSelectPriceTier('all')}
                      className="text-white/70 hover:text-white ml-0.5 w-7 h-7 inline-flex items-center justify-center rounded-full shrink-0 relative after:absolute after:-inset-2 after:content-[''] cursor-pointer"
                      aria-label="Remove filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {jainOnly && (
                  <span className="inline-flex items-center gap-1.5 bg-[#0F0F0F] text-[#E4A834] border border-[#E4A834]/40 px-3 py-1 rounded-full text-[11px] font-display uppercase tracking-wider font-bold shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E4A834]" />
                    Jain Only
                    <button
                      onClick={() => setJainOnly(false)}
                      className="text-white/70 hover:text-white ml-0.5 w-5 h-5 inline-flex items-center justify-center rounded-full shrink-0 cursor-pointer"
                      aria-label="Remove filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetAll}
                  className="text-[#D01B1B] hover:underline font-bold text-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Catalog Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#0F0F0F]/10 max-w-lg mx-auto shadow-sm">
                <p className="font-display text-xl font-bold uppercase text-[#0F0F0F]">No Dishes Found</p>
                <p className="text-xs text-[#0F0F0F]/60 mt-1">
                  No dishes match the selected category, price, or dietary filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="mt-4 bg-[#D01B1B] text-white px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider hover:bg-[#B81414] transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredItems.slice(0, visibleCount).map((item) => {
                  const hasMultiplePortions = Boolean(item.priceHalf && item.priceFull);
                  const defaultPortion = item.priceHalf ? 'half' : (item.priceSingle ? 'single' : 'full');
                  const cartItemId = `${item.id}-${defaultPortion}-${jainOnly ? 'jain' : 'regular'}`;
                  const currentQty = cartQtyMap.get(item.id) || 0;

                  return (
                    <DishCard
                      key={item.id}
                      item={item}
                      currentQty={currentQty}
                      jainOnly={jainOnly}
                      cartItemId={cartItemId}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQty}
                    />
                  );
                })}
              </div>
            )}

            {/* Scroll Sentinel */}
            <div ref={sentinelRef} className="h-10" />
          </main>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE FLOATING "BROWSE MENU" TRIGGER & BOTTOM SHEET (< lg screens)       */}
        {/* ========================================================================= */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            bottom: cartCount > 0 ? 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' : 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          }}
          className="lg:hidden fixed z-30 right-4 bg-[#0D0D0D] text-white border border-[#E4A834]/40 px-4 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Browse Menu Categories"
        >
          <Menu className="w-4 h-4 text-[#E4A834]" />
          <span>Menu Categories</span>
          <span className="bg-[#E4A834] text-[#0D0D0D] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {CATEGORIES.length}
          </span>
        </button>

        {/* Mobile Menu Bottom Sheet Modal */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/80 animate-fadeIn">
            <div className="absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />

            <div className="relative z-10 w-full bg-[#0D0D0D] text-white rounded-t-3xl border-t border-white/15 max-h-[82dvh] overflow-y-auto p-5 pb-safe animate-slideUp">
              <div className="sticky top-0 z-20 pb-3 mb-4 bg-[#0D0D0D] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#E4A834]" />
                  <h3 className="font-display text-base font-bold uppercase text-white">
                    Select Menu Category
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
                  aria-label="Close menu sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price Filter Pills inside Sheet */}
              <div className="mb-4">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-2 font-bold">
                  Filter By Price:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {PRICE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => handleSelectPriceTier(tier.id)}
                      className={`py-3 px-2 rounded-xl text-center text-[10px] font-mono font-bold transition border min-h-[44px] cursor-pointer ${
                        priceFilter === tier.id
                          ? 'bg-[#D01B1B] text-white border-[#D01B1B]'
                          : 'bg-[#181818] text-white/70 border-white/10'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Options Grid */}
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const count = getCategoryCount(cat.id);
                  const isSelected = selectedCategory === cat.id;
                  const isDisabled = count === 0 && !isSelected;

                  return (
                    <button
                      key={cat.id}
                      disabled={isDisabled}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`p-3 rounded-xl text-left flex items-center justify-between transition border cursor-pointer ${
                        isSelected
                          ? 'bg-[#181818] border-[#E4A834] text-[#E4A834] ring-1 ring-[#E4A834]'
                          : isDisabled
                          ? 'bg-[#141414]/50 border-white/5 text-white/25 cursor-not-allowed'
                          : 'bg-[#141414] border-white/15 text-white font-medium hover:bg-white/10'
                      }`}
                    >
                      <span className="font-display text-xs font-bold uppercase tracking-wide truncate pr-1">
                        {cat.label}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#E4A834] text-black' : 'bg-white/15 text-white'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleResetAll();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 bg-[#D01B1B] text-white py-3 rounded-xl font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Floating Takeaway Cart Bar */}
        {cartCount > 0 && (
          <aside
            aria-label="Takeaway order cart summary"
            style={{
              bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
            }}
            className="fixed left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slideUp"
          >
            <button
              type="button"
              onClick={() => openCart()}
              className="w-full bg-[#0D0D0D] text-white border border-[#E4A834] px-4 py-3 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center justify-between hover:bg-[#181818] transition active:scale-98 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D01B1B] text-white flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                  {cartCount}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-wider block font-bold leading-none mb-0.5">
                    TAKEAWAY BASKET
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    ₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}/-
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] group-hover:translate-x-1 transition-transform">
                <span>VIEW CART</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </aside>
        )}
      </div>
    </section>
  );
}
