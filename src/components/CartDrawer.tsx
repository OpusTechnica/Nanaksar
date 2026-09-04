import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  AlertTriangle,
  TrayIcon,
  WhatsAppIcon,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
} from './ui/Icon';
import {
  $cart,
  $isCartOpen,
  $selectedOutletId,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  switchOutlet,
  getCartSummary,
  buildWhatsAppOrderUrl,
  closeCart,
} from '../data/cartStore';
import { OUTLETS, BRAND_INFO, MENU_ITEMS, type MenuItem } from '../data/restaurantData';

// Curated Popular Accompaniments for 1-Tap Quick Addition
const POPULAR_ACCOMPANIMENTS = [
  {
    id: 'chur-chur-naan',
    name: 'Clay-Oven Chur Chur Naan',
    portion: 'single' as const,
    portionLabel: '1 Pc (Desi Ghee Hand-Crushed)',
    price: 50,
    image: '/assets/menu/thumbs/chur-chur-naan.webp',
  },
  {
    id: 'shahi-kheer',
    name: 'Malwa Shahi Kheer',
    portion: 'half' as const,
    portionLabel: 'Half (Rich Almond & Pistachio)',
    price: 110,
    image: '/assets/menu/thumbs/shahi-kheer.webp',
  },
];

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const selectedOutletId = useStore($selectedOutletId);

  // Memoized O(1) Menu Dictionary for Zero-Lag Image & Details Resolution
  const menuDictionary = useMemo(() => {
    return new Map(MENU_ITEMS.map((item) => [item.id, item]));
  }, []);

  // Two-Stage Progressive Flow: 'review' (Feast Focus) -> 'dispatch' (Pickup & WhatsApp)
  const [stage, setStage] = useState<'review' | 'dispatch'>('review');

  // Remember Diner Contact in localStorage (Frictionless repeat visits)
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nanaksar_diner_name') || '';
    }
    return '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nanaksar_diner_phone') || '';
    }
    return '';
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingOutletSwitch, setPendingOutletSwitch] = useState<string | null>(null);
  const [addedAccompaniment, setAddedAccompaniment] = useState<string | null>(null);

  const summary = getCartSummary();
  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  // Save Diner Contact to localStorage on change
  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nanaksar_diner_name', val);
    }
  };

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nanaksar_diner_phone', val);
    }
  };

  // Escape key handler & Scroll Lock for Dialog Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowClearConfirm(false);
      setPendingOutletSwitch(null);
      setStage('review');
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestOutletSwitch = (newId: string) => {
    if (newId === selectedOutletId) return;
    if (cart.length > 0) {
      setPendingOutletSwitch(newId);
    } else {
      switchOutlet(newId);
    }
  };

  const handleConfirmOutletSwitch = () => {
    if (pendingOutletSwitch) {
      switchOutlet(pendingOutletSwitch);
      setPendingOutletSwitch(null);
    }
  };

  const handleQuickAddAccompaniment = (itemDef: typeof POPULAR_ACCOMPANIMENTS[0]) => {
    const fullItem = MENU_ITEMS.find((m) => m.id === itemDef.id) || {
      id: itemDef.id,
      name: itemDef.name,
      description: itemDef.portionLabel,
      category: 'roti',
      categoryLabel: 'Accompaniment',
      priceSingle: itemDef.price,
      isVegetarian: true,
      isJainAvailable: true,
      spiceLevel: 'mild' as const,
      image: '/assets/menu/chur-chur-naan.webp',
      packagingFee: 10,
    };

    addToCart(fullItem as MenuItem, itemDef.portion, 'regular', false);
    setAddedAccompaniment(itemDef.id);
    setTimeout(() => setAddedAccompaniment(null), 1500);
  };

  const handleProceedToDispatch = () => {
    if (summary.items.length === 0) return;
    setStage('dispatch');
  };

  const handleFinalCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.items.length === 0) return;

    const fullNote = orderNotes.trim() ? `Diner Note: ${orderNotes.trim()}` : '';
    const url = buildWhatsAppOrderUrl(customerName, customerPhone, fullNote);
    window.open(url, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tray-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-none animate-fadeIn"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* ========================================================================= */}
      {/* ARCHETYPE 1: THE ROYAL HIGHWAY BILLFOLD (Right Slide-Out Sheet / Mobile)  */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 w-full md:w-[480px] h-full max-h-[94dvh] md:max-h-full self-end md:self-auto bg-[#0F0F0F] text-[#F7F4EB] rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-white/15 flex flex-col pb-safe overflow-hidden animate-drawer-mobile md:animate-drawer-desktop shadow-[-20px_0_50px_rgba(0,0,0,0.85)]"
      >
        
        {/* ========================================================================= */}
        {/* HEADER: DYNAMIC BASED ON STAGE (Stage 1 vs Stage 2)                      */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0F0F0F] flex items-center justify-between shrink-0">
          {stage === 'review' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#E4A834]/40 text-[#E4A834] flex items-center justify-center shrink-0">
                <TrayIcon className="w-5 h-5 text-[#E4A834]" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-widest block font-bold">
                  NANAKSAR TAKEAWAY TRAY
                </span>
                <h2 id="tray-title" className="font-display text-base sm:text-lg font-bold uppercase text-white tracking-wide">
                  Review Your Feast {summary.itemCount > 0 && `(${summary.itemCount})`}
                </h2>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStage('review')}
                className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-[#E4A834]/40 text-white/70 hover:text-[#E4A834] flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 group"
                aria-label="Return to tray review"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              </button>
              <div>
                <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-widest block font-bold">
                  STEP 2 OF 2 • COLLECTION
                </span>
                <h2 id="tray-title" className="font-display text-base sm:text-lg font-bold uppercase text-white tracking-wide">
                  Pickup &amp; WhatsApp Dispatch
                </h2>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {stage === 'review' && summary.items.length > 0 && !showClearConfirm && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-300 transition-all duration-200 flex items-center gap-2 active:scale-95 text-[11px] font-mono font-bold uppercase tracking-wider group shrink-0"
                aria-label="Clear all items from tray"
              >
                <Trash2 className="w-3.5 h-3.5 text-white/40 group-hover:text-red-400 transition-colors" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={closeCart}
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 group shrink-0"
              aria-label="Close takeaway tray"
            >
              <X className="w-4 h-4 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INLINE ALERT: CLEAR TRAY CONFIRMATION                                    */}
        {/* ========================================================================= */}
        {showClearConfirm && (
          <div
            role="alert"
            aria-live="polite"
            className="mx-4 sm:mx-5 my-3 p-3.5 rounded-xl bg-[#181818] border border-red-500/40 text-left animate-fadeIn shrink-0"
          >
            <div className="flex items-center gap-2 text-red-400 font-display text-xs font-bold uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Clear Takeaway Tray?</span>
            </div>
            <p className="text-xs text-white/75 mb-3 font-sans leading-relaxed">
              Remove all {summary.itemCount} items from your tray? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#D01B1B] hover:bg-[#B81414] text-white font-display text-xs font-bold uppercase tracking-wider transition min-h-[44px] active:scale-95"
              >
                Yes, Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-2 rounded-xl bg-[#121212] border border-white/15 text-white/80 hover:text-white font-display text-xs uppercase tracking-wider transition min-h-[44px] active:scale-95"
              >
                Cancel &amp; Keep Items
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1: 100% FEAST REVIEW (Dishes + Quick Breads + Collapsible Bill)     */}
        {/* ========================================================================= */}
        {stage === 'review' && (
          <>
            {/* Scrollable Dish Items Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sidebar-scrollbar">
              
              {summary.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-white/50 min-h-[300px]">
                  <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-white/15 flex items-center justify-center mb-4 text-[#E4A834]">
                    <TrayIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                    Your Takeaway Tray is Empty
                  </h3>
                  <p className="font-editorial italic text-sm text-[#E4A834]/80 mt-1">
                    "{BRAND_INFO.motto}"
                  </p>
                  <p className="text-xs mt-2 max-w-xs text-white/60 leading-relaxed font-sans">
                    Browse our slow-simmered 24-hour Dal Makhani, hand-crushed Chur Chur Naan, and Malwa heritage curries.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 bg-[#D01B1B] hover:bg-[#B81414] text-white px-6 py-3 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition active:scale-95 border border-white/10"
                  >
                    Explore Authentic Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Dish Cards List */}
                  <div className="space-y-3">
                    {summary.items.map((item) => {
                      const menuItem = menuDictionary.get(item.menuItemId);
                      const imageUrl = menuItem?.image || '/assets/menu/dal-makhani.webp';

                      return (
                        <div
                          key={item.id}
                          className="bg-[#181818] p-3.5 sm:p-4 rounded-2xl border border-white/10 hover:border-[#E4A834]/30 transition shadow-sm flex flex-col gap-3"
                        >
                          {/* ROW 1: 60px Fixed Thumbnail + Title/Badges + 44px Touch Trash */}
                          <div className="flex items-start gap-3 w-full">
                            {/* 60px Fixed Thumbnail with Branded Skeleton Fallback */}
                            <div className="w-[60px] h-[60px] shrink-0 rounded-xl bg-[#121212] border border-white/10 overflow-hidden relative flex items-center justify-center">
                              <TrayIcon className="absolute w-6 h-6 text-[#E4A834]/20" />
                              {(() => {
                                const thumbUrl = imageUrl ? imageUrl.replace('/assets/menu/', '/assets/menu/thumbs/').replace(/\.png$/, '.webp') : '';
                                return (
                                  <img
                                    src={thumbUrl || imageUrl}
                                    alt={item.name}
                                    loading="eager"
                                    decoding="async"
                                    width={60}
                                    height={60}
                                    className="relative z-10 w-full h-full object-cover"
                                    onError={(e) => {
                                      if (imageUrl && e.currentTarget.src !== imageUrl) {
                                        e.currentTarget.src = imageUrl;
                                      } else {
                                        e.currentTarget.style.display = 'none';
                                      }
                                    }}
                                  />
                                );
                              })()}
                            </div>

                            {/* Title & Badges */}
                            <div className="flex-1 min-w-0 pt-0.5">
                              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wide leading-snug line-clamp-2">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="text-[10px] font-mono font-bold text-[#E4A834] bg-[#E4A834]/10 px-2 py-0.5 rounded border border-[#E4A834]/20">
                                  {item.portionLabel}
                                </span>
                                {item.isJain && (
                                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                                    JAIN PREP
                                  </span>
                                )}
                                {item.isSwaminarayan && (
                                  <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                                    SWAMINARAYAN
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* 44px Touch Target Trash */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/40 hover:text-red-400 rounded-xl hover:bg-white/5 transition -mt-1 -mr-1 shrink-0 active:scale-95"
                              title="Remove item"
                              aria-label={`Remove ${item.name} from tray`}
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>

                          {/* ROW 2: 44px Stepper & Line Subtotal (Full Card Width) */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                            {/* 44px Ergonomic Stepper */}
                            <div className="flex items-center bg-[#121212] rounded-xl border border-white/15 overflow-hidden h-11">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="w-11 h-full min-w-[44px] flex items-center justify-center hover:bg-[#D01B1B] text-white transition active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
                              </button>
                              <span className="w-8 text-center font-mono text-xs font-bold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="w-11 h-full min-w-[44px] flex items-center justify-center hover:bg-[#E4A834] hover:text-black text-white transition active:scale-95"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Line Item Subtotal */}
                            <span className="font-mono text-base sm:text-lg font-bold text-[#E4A834]">
                              ₹{item.price * item.quantity}/-
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ========================================================================= */}
                  {/* 1-TAP ACCOMPANIMENT NUDGES ("Complete Your Dawat")                        */}
                  {/* ========================================================================= */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E4A834] font-bold">
                        Complete Your Feast (1-Tap Add):
                      </span>
                      <span className="text-[10px] font-mono text-white/40">Desi Ghee Breads</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {POPULAR_ACCOMPANIMENTS.map((acc) => {
                        const isJustAdded = addedAccompaniment === acc.id;
                        return (
                          <div
                            key={acc.id}
                            className="p-2.5 rounded-xl bg-[#141414] border border-white/10 flex flex-col justify-between gap-2.5 hover:border-[#E4A834]/30 transition"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#181818] border border-white/10 overflow-hidden relative flex items-center justify-center">
                                <TrayIcon className="absolute w-4 h-4 text-[#E4A834]/20" />
                                <img
                                  src={acc.image}
                                  alt={acc.name}
                                  loading="eager"
                                  decoding="async"
                                  width={40}
                                  height={40}
                                  className="relative z-10 w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-display text-xs font-bold text-white uppercase truncate">
                                  {acc.name}
                                </h5>
                                <span className="text-[10px] font-mono text-[#E4A834] font-bold block">
                                  ₹{acc.price}/-
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleQuickAddAccompaniment(acc)}
                              className={`w-full py-2.5 px-2 rounded-lg font-display text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1 min-h-[44px] ${
                                isJustAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#181818] border border-white/15 text-white hover:border-[#E4A834] hover:text-[#E4A834]'
                              }`}
                            >
                              {isJustAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <span>+ Add to Tray</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* COLLAPSIBLE BILL SUMMARY RECEIPT                                          */}
                  {/* ========================================================================= */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBillDetails(!showBillDetails)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono text-white/80 hover:border-white/20 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">Total Estimated Bill</span>
                        <span className="text-[10px] text-white/50">({summary.itemCount} items)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#E4A834]">₹{summary.grandTotal}/-</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-white/50 transition-transform ${
                            showBillDetails ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {showBillDetails && (
                      <div className="mt-1.5 p-3 rounded-xl bg-[#121212] border border-white/5 space-y-1.5 font-mono text-[11px] animate-fadeIn">
                        <div className="flex items-center justify-between text-white/70">
                          <span>Items Subtotal</span>
                          <span>₹{summary.subtotal}/-</span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>Desi Ghee Purity Packaging</span>
                          <span>₹{summary.packagingTotal}/-</span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>GST (5% F&amp;B Standard)</span>
                          <span>₹{summary.gst}/-</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-white font-bold text-xs">
                          <span>Net Payable</span>
                          <span className="text-[#E4A834]">₹{summary.grandTotal}/-</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* STAGE 1 DOCKED FOOTER: 1-Tap Proceed to Collection */}
            {summary.items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0F0F0F] shrink-0 flex items-center justify-between gap-3">
                <div className="leading-tight">
                  <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">
                    GRAND TOTAL
                  </span>
                  <span className="font-mono text-xl font-bold text-[#E4A834]">
                    ₹{summary.grandTotal}/-
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToDispatch}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 px-4 rounded-xl transition shadow-lg"
                >
                  <span>Select Pickup &amp; Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: PICKUP & WHATSAPP DISPATCH (Outlet Chips + Saved Contact Info)   */}
        {/* ========================================================================= */}
        {stage === 'dispatch' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 sidebar-scrollbar">
              
              {/* 1. Branch Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834]">
                    1. Select Pickup Branch:
                  </label>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-white/60">
                    <MapPin className="w-3 h-3 text-[#E4A834]" />
                    <span>Ready in 20-25m</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {OUTLETS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => handleRequestOutletSwitch(o.id)}
                      className={`px-3 py-2.5 rounded-xl border text-center transition font-display text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center justify-center ${
                        selectedOutletId === o.id
                          ? 'bg-[#E4A834]/15 border-[#E4A834] text-[#E4A834]'
                          : 'bg-[#121212] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {o.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inline Switch Confirmation */}
              {pendingOutletSwitch && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-3.5 rounded-xl bg-[#181818] border border-[#E4A834]/40 text-left animate-fadeIn"
                >
                  <div className="flex items-center gap-2 text-[#E4A834] font-display text-xs font-bold uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-4 h-4 text-[#E4A834] shrink-0" />
                    <span>Switching Pickup Outlet</span>
                  </div>
                  <p className="text-xs text-white/75 mb-3 font-sans leading-relaxed">
                    Switching your takeaway branch to <strong className="text-white">{OUTLETS.find(o => o.id === pendingOutletSwitch)?.name}</strong> will reset your tray items. Do you want to proceed?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmOutletSwitch}
                      className="px-3.5 py-2 rounded-xl bg-[#D01B1B] hover:bg-[#B81414] text-white font-display text-xs font-bold uppercase tracking-wider transition min-h-[44px] active:scale-95"
                    >
                      Yes, Switch Branch
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingOutletSwitch(null)}
                      className="px-3.5 py-2 rounded-xl bg-[#121212] border border-white/15 text-white/80 hover:text-white font-display text-xs uppercase tracking-wider transition min-h-[44px] active:scale-95"
                    >
                      Cancel &amp; Stay Here
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Contact Information Form (Saved in localStorage) */}
              <form id="dispatch-form" onSubmit={handleFinalCheckout} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834]">
                      2. Diner Contact:
                    </label>
                    {customerName && (
                      <span className="text-[10px] font-mono text-emerald-400">✓ Remembered on this device</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={customerName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-white placeholder-white/40 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        inputMode="tel"
                        required
                        placeholder="WhatsApp Mobile No. *"
                        value={customerPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-white placeholder-white/40 font-mono font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Cooking Note Input */}
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2">
                    3. Cooking / Pickup Note (Optional):
                  </label>
                  {showNoteInput ? (
                    <div className="animate-fadeIn">
                      <input
                        type="text"
                        placeholder="e.g. Extra napkins, less spicy, prepare for 8:30 PM"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-white placeholder-white/40 font-medium"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowNoteInput(true)}
                      className="text-[11px] text-white/50 hover:text-[#E4A834] font-mono flex items-center gap-1 transition"
                    >
                      <span>+ Add cooking instruction or pickup time</span>
                    </button>
                  )}
                </div>

                {/* Order Review Docket */}
                <div className="p-3.5 rounded-xl bg-[#141414] border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-white/70 text-[11px]">
                    <span>Pickup Branch</span>
                    <span className="text-white font-bold">{currentOutlet.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70 text-[11px]">
                    <span>Tray Contents</span>
                    <span className="text-white">{summary.itemCount} items</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-white font-bold">
                    <span className="font-display uppercase tracking-wider">Total Payable on Pickup</span>
                    <span className="text-[#E4A834] text-base">₹{summary.grandTotal}/-</span>
                  </div>
                </div>

                {/* Purity Assurance Seal */}
                <div className="p-3 rounded-xl bg-[#121212] border border-white/5 flex items-center gap-2.5 text-[11px] text-white/70 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span>100% Shuddh Desi Ghee • Prepared Fresh on Highway Bhatti</span>
                </div>
              </form>
            </div>

            {/* STAGE 2 DOCKED FOOTER: Direct WhatsApp Dispatch */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0F0F0F] shrink-0 space-y-2">
              <button
                type="submit"
                form="dispatch-form"
                className="w-full flex items-center justify-center gap-2.5 bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition min-h-[46px] border border-white/10 shadow-lg"
              >
                <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center p-0.5 shrink-0">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                </span>
                <span>Send Takeaway Order via WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-0.5">
                <span>Direct Branch Manager Connection</span>
                <span className="text-[#E4A834]">15-Min Table/Tray Hold</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
