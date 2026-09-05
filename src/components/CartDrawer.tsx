import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import {
  X,
  Trash2,
  AlertTriangle,
  TrayIcon,
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
  updateCartItemPortion,
} from '../data/cartStore';
import { OUTLETS, BRAND_INFO, MENU_ITEMS, type MenuItem } from '../data/restaurantData';
import TrayItem from './cart/TrayItem';
import DispatchForm from './cart/DispatchForm';

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

  // Remember Diner Contact in localStorage
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
      setStage('review');
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Stable action callbacks for TrayItem
  const handleUpdateQty = useCallback((id: string, delta: number) => {
    updateCartQuantity(id, delta);
  }, []);

  const handleRemove = useCallback((id: string) => {
    removeFromCart(id);
  }, []);

  const handlePortionChange = useCallback((id: string, portion: 'half' | 'full', menuItem?: MenuItem) => {
    updateCartItemPortion(id, portion, menuItem);
  }, []);

  if (!isOpen) return null;

  const handleRequestOutletSwitch = (newId: string) => {
    if (newId === selectedOutletId) return;
    switchOutlet(newId);
  };

  const handleQuickAddAccompaniment = (itemDef: (typeof POPULAR_ACCOMPANIMENTS)[0]) => {
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
      thumbImage: itemDef.image,
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

      {/* Royal Highway Billfold (Right Slide-Out Sheet / Mobile) */}
      <div className="relative z-10 w-full md:w-[490px] h-full max-h-[94dvh] md:max-h-full self-end md:self-auto bg-[#F7F4EB] text-[#0F0F0F] rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-[#E4A834]/30 flex flex-col pb-safe overflow-hidden animate-drawer-mobile md:animate-drawer-desktop shadow-[-20px_0_50px_rgba(0,0,0,0.45)]">
        {/* HEADER: Deep Obsidian with Brass Accent Band */}
        <div className="p-4 sm:p-5 border-b border-[#E4A834]/25 bg-[#0F0F0F] text-white flex items-center justify-between shrink-0 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E4A834] to-transparent opacity-60" />
          {stage === 'review' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#E4A834]/40 text-[#E4A834] flex items-center justify-center shrink-0 shadow-xs">
                <TrayIcon className="w-5 h-5 text-[#E4A834]" />
              </div>
              <div>
                <span className="text-[10px] font-display text-[#E4A834] uppercase tracking-widest block font-bold">
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
                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#E4A834]/50 text-white/80 hover:text-[#E4A834] flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 group cursor-pointer"
                aria-label="Return to tray review"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              </button>
              <div>
                <span className="text-[10px] font-display text-[#E4A834] uppercase tracking-widest block font-bold">
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
                className="h-10 px-3 rounded-xl bg-white/[0.06] hover:bg-red-500/15 border border-white/15 hover:border-red-500/40 text-white/70 hover:text-red-300 transition-all duration-200 flex items-center gap-2 active:scale-95 text-[11px] font-display font-bold uppercase tracking-wider group shrink-0 cursor-pointer"
                aria-label="Clear all items from tray"
              >
                <Trash2 className="w-3.5 h-3.5 text-white/50 group-hover:text-red-400 transition-colors" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={closeCart}
              className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 hover:border-[#E4A834]/40 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 group shrink-0 cursor-pointer"
              aria-label="Close takeaway tray"
            >
              <X className="w-4 h-4 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* INLINE ALERT: Clear Tray Confirmation */}
        {showClearConfirm && (
          <div
            role="alert"
            aria-live="polite"
            className="mx-4 sm:mx-5 my-3 p-3.5 rounded-xl bg-white border border-red-200 text-left animate-fadeIn shrink-0 shadow-xs"
          >
            <div className="flex items-center gap-2 text-[#D01B1B] font-display text-xs font-bold uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4 text-[#D01B1B] shrink-0" />
              <span>Reset Takeaway Tray?</span>
            </div>
            <p className="text-xs text-[#0F0F0F]/70 mb-3 font-sans leading-relaxed">
              Remove all {summary.itemCount} items from your tray? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#D01B1B] hover:bg-[#B81414] text-white font-display text-xs font-bold uppercase tracking-wider transition min-h-[40px] active:scale-95 cursor-pointer"
              >
                Yes, Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-2 rounded-xl bg-[#F7F4EB] border border-[#0F0F0F]/15 text-[#0F0F0F]/80 hover:text-[#0F0F0F] font-display text-xs uppercase tracking-wider transition min-h-[40px] active:scale-95 cursor-pointer"
              >
                Cancel &amp; Keep Items
              </button>
            </div>
          </div>
        )}

        {/* STAGE 1: Feast Review */}
        {stage === 'review' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sidebar-scrollbar">
              {summary.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#0F0F0F]/60 min-h-[340px]">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#E4A834]/30 flex items-center justify-center mb-4 text-[#965C00] shadow-xs">
                    <TrayIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0F0F0F] uppercase tracking-wider">
                    Your Takeaway Tray is Empty
                  </h3>
                  <p className="font-editorial italic text-sm text-[#965C00] mt-1">
                    "{BRAND_INFO.motto}"
                  </p>
                  <p className="text-xs mt-2 max-w-xs text-[#0F0F0F]/65 leading-relaxed font-sans">
                    Browse our slow-simmered 24-hour Dal Makhani, hand-crushed Chur Chur Naan, and Malwa heritage curries.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 bg-[#0F0F0F] hover:bg-[#D01B1B] text-white px-6 py-3 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 border border-[#0F0F0F] cursor-pointer shadow-xs"
                  >
                    Explore Authentic Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Dish Cards List via memoized TrayItem */}
                  <div className="space-y-3">
                    {summary.items.map((item) => {
                      const menuItem = menuDictionary.get(item.menuItemId);
                      return (
                        <TrayItem
                          key={item.id}
                          item={item}
                          menuItem={menuItem}
                          quantity={item.quantity}
                          onUpdateQuantity={handleUpdateQty}
                          onRemove={handleRemove}
                          onUpdatePortion={handlePortionChange}
                        />
                      );
                    })}
                  </div>

                  {/* Highway Billfold Guest Check / Receipt */}
                  <div className="pt-2">
                    <div className="rounded-2xl bg-white border border-[#E4A834]/30 p-4 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#0F0F0F]/8">
                        <div>
                          <span className="text-[10px] font-sans uppercase tracking-widest text-[#965C00] font-bold block">
                            ESTIMATED LEDGER
                          </span>
                          <span className="font-display text-sm font-bold uppercase text-[#0F0F0F]">
                            Takeaway Docket ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'})
                          </span>
                        </div>
                        <span className="font-sans text-base font-bold text-[#0F0F0F]">
                          ₹{summary.grandTotal}/-
                        </span>
                      </div>

                      <div className="space-y-2 font-sans text-xs text-[#0F0F0F]/80">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#0F0F0F]/70">Items Subtotal</span>
                          <span className="text-[#0F0F0F] font-semibold">₹{summary.subtotal}/-</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#0F0F0F]/70">Desi Ghee Purity Packaging</span>
                          <span className="text-[#0F0F0F] font-semibold">₹{summary.packagingTotal}/-</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#0F0F0F]/70">GST (5% F&amp;B Standard)</span>
                          <span className="text-[#0F0F0F] font-semibold">₹{summary.gst}/-</span>
                        </div>
                        <div className="pt-2.5 border-t border-dashed border-[#C89B53]/40 flex items-center justify-between text-[#0F0F0F] font-bold text-sm">
                          <span className="font-display uppercase tracking-wide">Net Payable</span>
                          <span className="font-sans text-base font-bold text-[#D01B1B]">₹{summary.grandTotal}/-</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Accompaniments ("Complete Your Feast") - Positioned Below Billing */}
                  <div className="pt-2 pb-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans uppercase tracking-wider text-[#965C00] font-bold">
                        Complete Your Feast (1-Tap Add):
                      </span>
                      <span className="text-[10px] font-sans text-[#0F0F0F]/50 font-medium">Desi Ghee Breads</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {POPULAR_ACCOMPANIMENTS.map((acc) => {
                        const isJustAdded = addedAccompaniment === acc.id;
                        return (
                          <div
                            key={acc.id}
                            className="p-2.5 rounded-2xl bg-white border border-[#E4A834]/25 flex flex-col justify-between gap-2.5 hover:border-[#E4A834]/60 transition-all duration-200 shadow-xs group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-11 h-11 shrink-0 rounded-xl bg-[#F7F4EB] border border-[#E4A834]/30 overflow-hidden relative flex items-center justify-center shadow-xs">
                                <TrayIcon className="absolute w-4 h-4 text-[#E4A834]/30" />
                                <img
                                  src={acc.image}
                                  alt={acc.name}
                                  loading="eager"
                                  decoding="async"
                                  width={44}
                                  height={44}
                                  className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-display text-xs font-bold text-[#0F0F0F] uppercase truncate">
                                  {acc.name}
                                </h5>
                                <span className="text-xs font-sans text-[#0F0F0F] font-bold block">
                                  ₹{acc.price}/-
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleQuickAddAccompaniment(acc)}
                              className={`w-full py-2 px-2 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1 min-h-[38px] cursor-pointer ${
                                isJustAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#F7F4EB] border border-[#0F0F0F]/10 text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white'
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
                </>
              )}
            </div>

            {/* Stage 1 Docked Footer */}
            {summary.items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#E4A834]/30 bg-[#0F0F0F] text-white shrink-0 flex items-center justify-between gap-4 shadow-lg">
                <div className="leading-tight">
                  <span className="text-[10px] font-sans uppercase text-[#E4A834] block font-bold tracking-wider">
                    GRAND TOTAL
                  </span>
                  <span className="font-sans text-xl font-bold text-white">
                    ₹{summary.grandTotal}/-
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToDispatch}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-all duration-200 shadow-md cursor-pointer group"
                >
                  <span>Select Pickup &amp; Dispatch</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STAGE 2: Dispatch Form (Plain conditional component) */}
        {stage === 'dispatch' && (
          <DispatchForm
            selectedOutletId={selectedOutletId}
            outlets={OUTLETS}
            currentOutlet={currentOutlet}
            onRequestOutletSwitch={handleRequestOutletSwitch}
            customerName={customerName}
            customerPhone={customerPhone}
            orderNotes={orderNotes}
            showNoteInput={showNoteInput}
            summary={summary}
            onNameChange={handleNameChange}
            onPhoneChange={handlePhoneChange}
            onNotesChange={setOrderNotes}
            onToggleNoteInput={setShowNoteInput}
            onSubmitCheckout={handleFinalCheckout}
          />
        )}
      </div>
    </div>
  );
}
