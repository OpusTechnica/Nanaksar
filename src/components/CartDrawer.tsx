import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { X, Plus, Minus, Trash2, MapPin, AlertTriangle, TrayIcon, WhatsAppIcon } from './ui/Icon';
import {
  $cart,
  $isCartOpen,
  $selectedOutletId,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  switchOutlet,
  getCartSummary,
  buildWhatsAppOrderUrl,
  closeCart,
} from '../data/cartStore';
import { OUTLETS, BRAND_INFO } from '../data/restaurantData';

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const selectedOutletId = useStore($selectedOutletId);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingOutletSwitch, setPendingOutletSwitch] = useState<string | null>(null);

  const summary = getCartSummary();
  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  // Escape key handler for dialog accessibility
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

  const handleCheckout = (e: React.FormEvent) => {
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
      aria-labelledby="cart-popover-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/90 animate-fadeIn p-0 md:p-4"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Popover Card Shell: Exact Parity with TableReservationModal - Natural Scrollable Stream */}
      <div className="relative z-10 w-full md:max-w-xl bg-[#0F0F0F] text-[#F7F4EB] rounded-t-3xl md:rounded-2xl max-h-[90dvh] overflow-y-auto border border-white/15 pb-safe sidebar-scrollbar">
        
        {/* ========================================================================= */}
        {/* 1. STICKY TOP HEADER LOCKUP (Always Visible with Running Grand Total)      */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-20 p-4 sm:p-5 border-b border-white/10 bg-[#0F0F0F] flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#E4A834]/40 text-[#E4A834] flex items-center justify-center shrink-0">
              <TrayIcon className="w-5 h-5 text-[#E4A834]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-widest block font-bold">
                NANAKSAR TAKEAWAY ORDER
              </span>
              <h2 id="cart-popover-title" className="font-display text-base sm:text-lg font-bold uppercase text-white tracking-wide flex items-center gap-1.5 flex-wrap">
                <span>Your Takeaway Tray</span>
                {summary.itemCount > 0 && (
                  <span className="text-[#E4A834] font-mono font-bold text-sm sm:text-base">
                    ({summary.itemCount}) • ₹{summary.grandTotal}/-
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {summary.items.length > 0 && !showClearConfirm && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-[11px] font-mono font-bold text-white/60 hover:text-red-400 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-red-500/30 transition flex items-center gap-1.5 active:scale-95"
                aria-label="Clear all items from tray"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline uppercase">Clear</span>
              </button>
            )}

            <button
              onClick={closeCart}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#181818] border border-white/15 text-white hover:bg-white/10 transition active:scale-95"
              aria-label="Close cart tray"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SCROLLABLE CONTENT BODY: Spacious Dishes + Unfreezed Natural Flow      */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Outlet Selection Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834]">
                1. Pickup Branch (5 Indore Locations):
              </label>
              <div className="flex items-center gap-1 text-[10px] font-mono text-white/60">
                <MapPin className="w-3 h-3 text-[#E4A834]" />
                <span>Est. 20-25m</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {OUTLETS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => handleRequestOutletSwitch(o.id)}
                  className={`px-3 py-1.5 rounded-xl border text-center transition font-display text-xs font-bold uppercase tracking-wider ${
                    selectedOutletId === o.id
                      ? 'bg-[#181818] border-[#E4A834] text-[#E4A834] ring-1 ring-[#E4A834]'
                      : 'bg-[#121212] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {o.name}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Alert: Clear Tray Confirmation */}
          {showClearConfirm && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 rounded-xl bg-[#181818] border border-red-500/40 text-left animate-fadeIn"
            >
              <div className="flex items-center gap-2 text-red-400 font-display text-xs font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Clear Takeaway Tray?</span>
              </div>
              <p className="text-xs text-white/75 mb-3 font-sans leading-relaxed">
                Remove all {summary.itemCount} items from your takeaway order? This action cannot be undone.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#D01B1B] hover:bg-[#B81414] text-white font-display text-xs font-bold uppercase tracking-wider transition min-h-[40px] active:scale-95"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#121212] border border-white/15 text-white/80 hover:text-white font-display text-xs uppercase tracking-wider transition min-h-[40px] active:scale-95"
                >
                  Cancel &amp; Keep Items
                </button>
              </div>
            </div>
          )}

          {/* Inline Alert: Outlet Switch Confirmation */}
          {pendingOutletSwitch && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 rounded-xl bg-[#181818] border border-[#E4A834]/40 text-left animate-fadeIn"
            >
              <div className="flex items-center gap-2 text-[#E4A834] font-display text-xs font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-[#E4A834] shrink-0" />
                <span>Switching Takeaway Outlet</span>
              </div>
              <p className="text-xs text-white/75 mb-3 font-sans leading-relaxed">
                Switching your takeaway branch to <strong className="text-white">{OUTLETS.find(o => o.id === pendingOutletSwitch)?.name}</strong> will reset your current tray items. Do you want to proceed?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmOutletSwitch}
                  className="px-3.5 py-2 rounded-xl bg-[#D01B1B] hover:bg-[#B81414] text-white font-display text-xs font-bold uppercase tracking-wider transition min-h-[40px] active:scale-95"
                >
                  Yes, Switch Branch
                </button>
                <button
                  type="button"
                  onClick={() => setPendingOutletSwitch(null)}
                  className="px-3.5 py-2 rounded-xl bg-[#121212] border border-white/15 text-white/80 hover:text-white font-display text-xs uppercase tracking-wider transition min-h-[40px] active:scale-95"
                >
                  Cancel &amp; Stay Here
                </button>
              </div>
            </div>
          )}

          {/* Tray Dishes Section (High Visibility, Full Natural Breathing Room) */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2.5">
              2. Review Selected Dishes ({summary.itemCount}):
            </label>

            {summary.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[#141414] border border-white/10 text-white/50 min-h-[220px]">
                <div className="w-14 h-14 rounded-2xl bg-[#181818] border border-white/15 flex items-center justify-center mb-3 text-[#E4A834]">
                  <TrayIcon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                  Your Takeaway Tray is Empty
                </h3>
                <p className="font-editorial italic text-xs text-[#E4A834]/80 mt-1">
                  "{BRAND_INFO.motto}"
                </p>
                <p className="text-xs mt-2 max-w-xs text-white/60 leading-relaxed font-sans">
                  Browse slow-simmered 24-hour Dal Makhani, hand-crushed Chur Chur Naan, and authentic Indori gravies.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-4 bg-[#D01B1B] hover:bg-[#B81414] text-white px-5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition active:scale-95 border border-white/10"
                >
                  Explore Authentic Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#181818] p-3.5 sm:p-4 rounded-2xl border border-white/10 hover:border-[#E4A834]/30 transition shadow-sm space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-bold text-white uppercase tracking-wide leading-snug">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-[#E4A834] bg-[#E4A834]/10 px-2 py-0.5 rounded border border-[#E4A834]/20">
                            {item.portionLabel} • ₹{item.price}
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

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-red-400 rounded-lg hover:bg-white/5 transition shrink-0"
                        title="Remove item"
                        aria-label={`Remove ${item.name} from tray`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stepper with >= 40px Tap Target & Line Item Subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center bg-[#121212] rounded-xl border border-white/15 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-[#D01B1B] text-white transition active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-400" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-[#E4A834] hover:text-black text-white transition active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-base font-bold text-white">
                        ₹{item.price * item.quantity}/-
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Checkout Form Section (Natural Flow Directly Under Items) */}
          {summary.items.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-white/10">
              
              {/* Receipt Breakdown Card */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2">
                  3. Bill Summary:
                </label>
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono">
                  <div className="flex items-center justify-between text-white/70 text-[11px]">
                    <span>Items Subtotal ({summary.itemCount} items)</span>
                    <span>₹{summary.subtotal}/-</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70 text-[11px]">
                    <span>Desi Ghee Purity Packaging</span>
                    <span>₹{summary.packagingTotal}/-</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70 text-[11px]">
                    <span>GST (5% F&amp;B Standard)</span>
                    <span>₹{summary.gst}/-</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="font-display font-bold uppercase tracking-wider text-white text-xs">
                      Grand Total (Pickup):
                    </span>
                    <span className="font-mono text-xl font-bold text-[#E4A834]">
                      ₹{summary.grandTotal}/-
                    </span>
                  </div>
                </div>
              </div>

              {/* Diner Contact Form */}
              <form onSubmit={handleCheckout} className="space-y-3">
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2">
                    4. Contact Details:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#121212] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        inputMode="tel"
                        required
                        placeholder="WhatsApp Mobile No. *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#121212] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 font-mono font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Cooking Note Input */}
                {showNoteInput ? (
                  <div className="animate-fadeIn">
                    <input
                      type="text"
                      placeholder="e.g. Extra onions & green chilies, less spicy, prepare for 8:30 PM"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-[#121212] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 font-medium"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNoteInput(true)}
                    className="text-[11px] text-white/50 hover:text-[#E4A834] font-mono flex items-center gap-1 transition"
                  >
                    <span>+ Add cooking / pickup note (optional)</span>
                  </button>
                )}

                {/* Flagship Tandoori Crimson WhatsApp Order Dispatch Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition min-h-[46px] border border-white/10 shadow-lg"
                >
                  <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center p-0.5 shrink-0">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Send Takeaway Order via WhatsApp</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1">
                <span>Takeaway Counter Pickup • {currentOutlet.name}</span>
                <span className="text-[#E4A834]">100% Shuddh Desi Ghee</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
