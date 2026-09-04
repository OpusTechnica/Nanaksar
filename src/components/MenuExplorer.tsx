import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { Search, Plus, Minus, Check, ChevronDown, X, Menu, Utensils, ShoppingBag, ArrowRight } from './ui/Icon';
import { MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import { $cart, addToCart, updateCartQuantity, openCart } from '../data/cartStore';

const PAGE_CHUNK_SIZE = 18;

// Exact physical menu sections matching Menu.webp through Menu-3.webp
const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'dal', label: 'Dal' },
  { id: 'paneer', label: 'Paneer Main Course' },
  { id: 'sabjiya', label: 'Sabjiya' },
  { id: 'chaap', label: 'Dhaba Style Soya Chaap' },
  { id: 'tandoori-chaap', label: 'Tandoori Chaap' },
  { id: 'kofta', label: 'Kofta' },
  { id: 'roti', label: 'Roti' },
  { id: 'rice-pulao', label: 'Rice & Pulao' },
  { id: 'chinese-starter', label: 'Chinese Starter' },
  { id: 'tandoori-starter', label: 'Tandoori Starter' },
  { id: 'starter', label: 'Starter' },
  { id: 'soups', label: "Soup's" },
  { id: 'salad', label: 'Salad' },
  { id: 'sweets', label: 'Sweets' },
  { id: 'coldrinks', label: 'Coldrinks' },
  { id: 'combos', label: 'Thalis & Combos' },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: "Chef's Recommendation" },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Bestsellers & Popular' },
  { id: 'spicy', label: 'Spiciness: Mild to Spicy' },
];

const PRICE_TIERS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-150', label: 'Under ₹150' },
  { id: '150-250', label: '₹150 – ₹250' },
  { id: 'above-250', label: '₹250+' },
];

// Helper to check category affiliation
function itemMatchesCategory(item: MenuItem, catId: string): boolean {
  if (catId === 'all') return true;
  if (catId === 'roti') return item.category === 'roti' || item.category === 'breads';
  if (catId === 'rice-pulao') return item.category === 'rice-pulao' || item.category === 'rice';
  if (catId === 'sweets') return item.category === 'sweets' || item.category === 'desserts';
  return item.category === catId;
}

// Helper to check price tier affiliation
function itemMatchesPrice(item: MenuItem, tierId: string): boolean {
  if (tierId === 'all') return true;
  const p = item.priceSingle || item.priceHalf || item.priceFull || 0;
  if (tierId === 'under-150') return p < 150;
  if (tierId === '150-250') return p >= 150 && p <= 250;
  if (tierId === 'above-250') return p > 250;
  return true;
}

export default function MenuExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [jainOnly, setJainOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [selectedPortions, setSelectedPortions] = useState<Record<string, 'half' | 'full'>>({});
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_CHUNK_SIZE);

  const cart = useStore($cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const sortPopoverRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Item Counts per category (prevents dead-end 0-item states)
  const getCategoryCount = (catId: string) => {
    return MENU_ITEMS.filter((item) => {
      if (!itemMatchesCategory(item, catId)) return false;
      if (jainOnly && !item.isJainAvailable) return false;
      if (!itemMatchesPrice(item, priceFilter)) return false;
      return true;
    }).length;
  };

  // Outside click listener for Sort Popover (handles hybrid touch laptops & desktops)
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

  // Filter and Sort Engine
  const filteredItems = MENU_ITEMS.filter((item) => {
    if (!itemMatchesCategory(item, selectedCategory)) return false;
    if (jainOnly && !item.isJainAvailable) return false;
    if (!itemMatchesPrice(item, priceFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    const priceA = a.priceSingle || a.priceHalf || a.priceFull || 0;
    const priceB = b.priceSingle || b.priceHalf || b.priceFull || 0;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'popular') {
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    }
    if (sortBy === 'spicy') {
      const spiceOrder: Record<string, number> = { mild: 1, medium: 2, spicy: 3 };
      return (spiceOrder[a.spiceLevel] || 2) - (spiceOrder[b.spiceLevel] || 2);
    }
    // 'recommended' default: signatures first, then bestsellers
    if (a.isSignature && !b.isSignature) return -1;
    if (!a.isSignature && b.isSignature) return 1;
    if (a.isBestseller && !b.isBestseller) return -1;
    if (!a.isBestseller && b.isBestseller) return 1;
    return 0;
  });

  // Reset visible slice when filters change (< 16ms render loop)
  useEffect(() => {
    setVisibleCount(PAGE_CHUNK_SIZE);
  }, [selectedCategory, jainOnly, searchQuery, sortBy, priceFilter]);

  // Windowed progressive loading
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

  const handleAdd = (item: MenuItem) => {
    const portion = selectedPortions[item.id] || (item.priceHalf ? 'half' : (item.priceSingle ? 'single' : 'full'));
    const diet = jainOnly ? 'jain' : 'regular';
    addToCart(item, portion, diet, false);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const handleResetAll = () => {
    setSelectedCategory('all');
    setJainOnly(false);
    setSearchQuery('');
    setPriceFilter('all');
    setSortBy('recommended');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || jainOnly || searchQuery.trim() !== '' || priceFilter !== 'all' || sortBy !== 'recommended';

  const currentCategoryLabel =
    CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Items';

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Chef's Recommendation";

  return (
    <section id="full-menu" className="pt-20 sm:pt-28 pb-20 sm:pb-28 bg-[#F7F4EB] text-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Compact Hero Header (Zero Breadcrumb Noise) */}
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
            {/* Frozen Fixed Header (Never disappears on scroll) */}
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
                  className="text-[11px] font-mono font-bold text-[#D01B1B] hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Scrollable Categories List */}
            <div className="flex-1 overflow-y-auto overscroll-contain sidebar-scrollbar p-4 space-y-1">
              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isSelected = selectedCategory === cat.id;
                const isDisabled = count === 0 && !isSelected;

                return (
                  <button
                    key={cat.id}
                    disabled={isDisabled}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-display tracking-wider transition ${
                      isSelected
                        ? 'bg-[#0F0F0F] text-white font-bold shadow-sm'
                        : isDisabled
                        ? 'text-[#0F0F0F]/30 cursor-not-allowed'
                        : 'text-[#0F0F0F]/80 hover:bg-[#0F0F0F]/5 hover:text-[#0F0F0F]'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-[#F7F4EB] text-[#0F0F0F]/60'
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
              <span className="text-[10px] font-mono text-[#0F0F0F]/50 uppercase tracking-wider block mb-2 font-bold">
                Filter By Price
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setPriceFilter(tier.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-center text-[11px] font-mono font-bold transition border ${
                      priceFilter === tier.id
                        ? 'bg-[#D01B1B] text-white border-[#D01B1B]'
                        : 'bg-[#F7F4EB] text-[#0F0F0F]/70 border-[#0F0F0F]/10 hover:border-[#0F0F0F]/25'
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
          <main className="lg:col-span-9 w-full">

            {/* Controls Bar: Search + Sort Popover + Jain Toggle */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#0F0F0F]/10 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search Box (16px base on iOS to prevent canvas zoom) */}
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
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-xs font-mono text-[#0F0F0F]/40 hover:text-[#0F0F0F]"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Right Controls: Premium Sort Popover + Jain Toggle */}
                <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-start">
                  
                  {/* WAI-ARIA Compliant Sort Popover */}
                  <div className="relative" ref={sortPopoverRef}>
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider bg-[#0F0F0F] text-white hover:bg-[#222222] transition min-h-[44px] shadow-sm"
                    >
                      <span className="text-[#E4A834] hidden xs:inline">Sort:</span>
                      <span className="truncate max-w-[130px] sm:max-w-none">{currentSortLabel}</span>
                      <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-[#E4A834]' : 'text-white/60'}`} />
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
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs text-left transition font-display tracking-wide min-h-[44px] ${
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
                    className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition min-h-[44px] border ${
                      jainOnly
                        ? 'bg-green-700 text-white border-green-700 shadow-sm'
                        : 'bg-[#F7F4EB] text-green-900 border-green-600/30 hover:bg-green-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${jainOnly ? 'bg-white' : 'bg-green-600'}`}></span>
                    <span>Jain Friendly</span>
                  </button>

                </div>
              </div>
            </div>

            {/* Active Filters & Dish Count Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#0F0F0F]/60 mb-4 px-1 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Showing <strong className="text-[#0F0F0F]">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'dish' : 'authentic dishes'}
                </span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#0F0F0F] text-white px-2.5 py-0.5 rounded-full text-[11px] font-display font-bold uppercase">
                    {currentCategoryLabel}
                    <button onClick={() => setSelectedCategory('all')} className="text-white/70 hover:text-white ml-0.5 w-7 h-7 inline-flex items-center justify-center rounded-full shrink-0 relative after:absolute after:-inset-2 after:content-['']" aria-label="Remove filter"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {priceFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#D01B1B] text-white px-2.5 py-0.5 rounded-full text-[11px] font-display font-bold uppercase">
                    {PRICE_TIERS.find((t) => t.id === priceFilter)?.label}
                    <button onClick={() => setPriceFilter('all')} className="text-white/70 hover:text-white ml-0.5 w-7 h-7 inline-flex items-center justify-center rounded-full shrink-0 relative after:absolute after:-inset-2 after:content-['']" aria-label="Remove filter"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
                {jainOnly && (
                  <span className="inline-flex items-center gap-1 bg-green-700 text-white px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold">
                    Jain Only
                    <button onClick={() => setJainOnly(false)} className="text-white/70 hover:text-white ml-0.5 w-7 h-7 inline-flex items-center justify-center rounded-full shrink-0 relative after:absolute after:-inset-2 after:content-['']" aria-label="Remove filter"><X className="w-3.5 h-3.5" /></button>
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetAll}
                  className="text-[#D01B1B] hover:underline font-bold text-xs"
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
                  className="mt-4 bg-[#D01B1B] text-white px-5 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider hover:bg-[#B81414] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredItems.slice(0, visibleCount).map((item) => {
                    const hasMultiplePortions = Boolean(item.priceHalf && item.priceFull);
                    const chosenPortion = selectedPortions[item.id] || (item.priceHalf ? 'half' : (item.priceSingle ? 'single' : 'full'));
                    const displayPrice =
                      chosenPortion === 'half' && item.priceHalf
                        ? item.priceHalf
                        : chosenPortion === 'full' && item.priceFull
                        ? item.priceFull
                        : item.priceSingle || item.priceHalf || item.priceFull;

                    const cartItemId = `${item.id}-${chosenPortion}-${jainOnly ? 'jain' : 'regular'}`;
                    const existingCartItem = cart.find(
                      (ci) => ci.id === cartItemId || (ci.menuItemId === item.id && ci.portion === chosenPortion)
                    );
                    const currentQty = existingCartItem ? existingCartItem.quantity : 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition-all duration-200 flex flex-col group shadow-sm hover:shadow-md"
                      >
                        {/* Compact Luxury Aspect Image Frame */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181818] shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            width={700}
                            height={560}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                          />
                          <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                            <span className="bg-white text-green-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-green-600/30">
                              100% VEG
                            </span>
                            {item.isJainAvailable && (
                              <span className="bg-amber-100 text-[#965C00] font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-amber-300">
                                JAIN
                              </span>
                            )}
                          </div>
                          {item.isSignature ? (
                            <div className="absolute top-2.5 right-2.5 bg-[#D01B1B] text-white font-display text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                              SIGNATURE
                            </div>
                          ) : item.isBestseller ? (
                            <div className="absolute top-2.5 right-2.5 bg-[#965C00] text-white font-display text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                              BESTSELLER
                            </div>
                          ) : null}
                        </div>

                        {/* Snug Content & Pricing Details */}
                        <div className="p-4 flex flex-col flex-1 justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-[#D01B1B] uppercase tracking-wider font-bold block mb-1">
                              {item.categoryLabel}
                            </span>
                            <h2 className="font-display text-sm sm:text-base font-bold uppercase text-[#0F0F0F] leading-snug line-clamp-1">
                              {item.name}
                            </h2>
                            <p className="mt-1 text-xs text-[#0F0F0F]/65 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Portion Selector Pill if multiple sizes available */}
                            {hasMultiplePortions && (
                              <div className="flex items-center gap-1 mt-2 bg-[#F7F4EB] p-0.5 rounded-lg border border-[#0F0F0F]/10 w-fit">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPortions((prev) => ({ ...prev, [item.id]: 'half' }))}
                                  className={`px-3 py-2.5 rounded text-[10px] font-mono font-bold transition min-h-[44px] ${
                                    chosenPortion === 'half'
                                      ? 'bg-[#0F0F0F] text-white shadow-xs'
                                      : 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]'
                                  }`}
                                >
                                  Half ₹{item.priceHalf}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPortions((prev) => ({ ...prev, [item.id]: 'full' }))}
                                  className={`px-3 py-2.5 rounded text-[10px] font-mono font-bold transition min-h-[44px] ${
                                    chosenPortion === 'full'
                                      ? 'bg-[#0F0F0F] text-white shadow-xs'
                                      : 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]'
                                  }`}
                                >
                                  Full ₹{item.priceFull}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Compact Attached Bottom CTA with Stepper Support */}
                          <div className="pt-3 mt-3 border-t border-[#0F0F0F]/8 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-mono text-[#0F0F0F]/45 uppercase block leading-none mb-0.5">
                                {hasMultiplePortions ? `${chosenPortion.toUpperCase()} PORTION` : 'PRICE'}
                              </span>
                              <span className="font-mono text-base font-bold text-[#0F0F0F]">
                                ₹{displayPrice}/-
                              </span>
                            </div>

                            {currentQty === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleAdd(item)}
                                className="px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition flex items-center gap-1.5 min-h-[44px] bg-[#0F0F0F] hover:bg-[#D01B1B] text-white active:scale-95 shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>ADD</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-[#0F0F0F] rounded-xl p-1 border border-[#E4A834]/50 shadow-sm min-h-[44px]">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(existingCartItem!.id, -1)}
                                  className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#D01B1B] text-white transition active:scale-95"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-5 text-center font-mono text-xs font-bold text-white">
                                  {currentQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(existingCartItem!.id, 1)}
                                  className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#E4A834] hover:text-black text-white transition active:scale-95"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Smart Dhaba Cross-Sell Callout when isolated category has few items */}
                {selectedCategory !== 'all' && filteredItems.length <= 3 && (
                  <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>
                        <strong>Dhaba Meal-Building Pairing:</strong> Complete your {currentCategoryLabel} meal with hot clay-oven <em>Chur Chur Naan</em>, <em>Dal Makhani</em>, or chilled <em>Shahi Kheer</em>.
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="shrink-0 bg-[#0F0F0F] hover:bg-[#D01B1B] text-white px-4 py-2 rounded-xl font-display font-bold uppercase text-[11px] tracking-wider transition"
                    >
                      Browse Full Menu
                    </button>
                  </div>
                )}
              </>
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
          className="lg:hidden fixed z-30 right-4 bg-[#0D0D0D] text-white border border-[#E4A834]/40 px-4 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider active:scale-95 transition-all duration-300"
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
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
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
                      onClick={() => setPriceFilter(tier.id)}
                      className={`py-3 px-2 rounded-xl text-center text-[10px] font-mono font-bold transition border min-h-[44px] ${
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
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-3 rounded-xl text-left flex items-center justify-between transition border ${
                        isSelected
                          ? 'bg-[#181818] border-[#E4A834] text-[#E4A834] ring-1 ring-[#E4A834]'
                          : isDisabled
                          ? 'bg-[#141414]/50 border-white/5 text-white/25 cursor-not-allowed'
                          : 'bg-[#141414] border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-display text-xs font-bold uppercase truncate pr-1">
                        {cat.label}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#E4A834] text-black font-bold' : 'bg-white/10 text-white/60'
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
                  className="w-full mt-4 bg-[#D01B1B] text-white py-3 rounded-xl font-display text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        )}


        {/* Floating Takeaway Cart Bar (Swiggy / Zomato Pattern) */}
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
              className="w-full bg-[#0D0D0D] text-white border border-[#E4A834] px-4 py-3 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center justify-between hover:bg-[#181818] transition active:scale-98 group"
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
