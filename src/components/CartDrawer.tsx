import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { X, Plus, Minus, Trash2, Send, ShoppingBag, MapPin } from './ui/Icon';
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
import { OUTLETS } from '../data/restaurantData';

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const selectedOutletId = useStore($selectedOutletId);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const summary = getCartSummary();
  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  if (!isOpen) return null;

  const handleOutletChange = (newId: string) => {
    if (newId === selectedOutletId) return;
    if (cart.length > 0) {
      if (confirm('Switching takeaway outlets will reset your current cart. Do you want to proceed?')) {
        switchOutlet(newId);
      }
    } else {
      switchOutlet(newId);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.items.length === 0) return;

    const fullNote = orderNotes ? `Diner Note: ${orderNotes}` : '';
    const url = buildWhatsAppOrderUrl(customerName, customerPhone, fullNote);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Slide-out Drawer: Solid Polished Obsidian Shell */}
      <div className="relative z-10 w-full max-w-md bg-[#0D0D0D] text-[#F7F4EB] flex flex-col h-full border-l border-white/15 shadow-[-24px_0_60px_rgba(0,0,0,0.95)]">
        
        {/* Compact Luxury Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0D0D0D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#E4A834]/40 text-[#E4A834] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-widest block font-bold">
                NANAKSAR TAKEAWAY
              </span>
              <h2 className="font-display text-base sm:text-lg font-bold uppercase text-white tracking-wide">
                Order Summary ({summary.itemCount})
              </h2>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#141414] border border-white/15 text-white hover:bg-white/10 transition active:scale-95"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist 1-Line Outlet Bar (Saves 80px of vertical space) */}
        <div className="px-4 py-2.5 bg-[#121212] border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-white/80 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#E4A834] shrink-0" />
            <span className="text-[10px] font-mono uppercase text-[#E4A834] font-bold shrink-0">Pickup:</span>
            <select
              value={selectedOutletId}
              onChange={(e) => handleOutletChange(e.target.value)}
              className="bg-transparent text-xs font-display font-bold uppercase text-white outline-none cursor-pointer truncate max-w-[200px]"
            >
              {OUTLETS.map((outlet) => (
                <option key={outlet.id} value={outlet.id} className="bg-[#141414] text-white">
                  {outlet.name} ({outlet.subtitle})
                </option>
              ))}
            </select>
          </div>
          <span className="text-[10px] font-mono text-white/40 shrink-0">Est. 20-25m</span>
        </div>

        {/* Cart Items List: Maximum Vertical Room for Order Details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sidebar-scrollbar">
          {summary.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
              <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center mb-4 text-[#E4A834]/40">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-display text-base font-bold text-white uppercase tracking-wider">
                Your Cart is Empty
              </p>
              <p className="text-xs mt-1.5 max-w-xs text-white/60 leading-relaxed font-sans">
                Browse our slow-simmered Dal Makhani, hand-crushed Chur Chur Naan, and Indori gravies.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-5 bg-[#D01B1B] hover:bg-[#B81414] text-white px-5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition active:scale-95 shadow-sm"
              >
                Browse Authentic Menu
              </button>
            </div>
          ) : (
            summary.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#141414] p-3.5 rounded-2xl border border-white/10 hover:border-[#E4A834]/30 transition shadow-sm space-y-2.5"
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
                        <span className="text-[9px] font-bold text-green-400 bg-green-950/80 px-1.5 py-0.5 rounded border border-green-800">
                          JAIN
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
                    className="text-white/40 hover:text-[#D01B1B] p-1 rounded-lg hover:bg-white/5 transition shrink-0"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stepper and Line Item Price */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 bg-[#0D0D0D] rounded-xl p-1 border border-white/15">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#D01B1B] text-white transition active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-400" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#E4A834] hover:text-black text-white transition active:scale-95"
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
            ))
          )}
        </div>

        {/* Streamlined Checkout Footer: Fast, Clean, Space-Saving */}
        {summary.items.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-[#0D0D0D] pb-safe shrink-0 space-y-3">
            {/* Clean Total Summary Bar */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block font-bold leading-none mb-0.5">
                  Grand Total (incl. taxes &amp; packing)
                </span>
                <span className="text-xs text-white/70 font-mono">
                  {summary.itemCount} items from {currentOutlet.name}
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-[#E4A834]">
                ₹{summary.grandTotal}/-
              </span>
            </div>

            {/* Frictionless 2-Field Contact Form */}
            <form onSubmit={handleCheckout} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 font-medium"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="WhatsApp No. *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 font-mono font-medium"
                />
              </div>

              {showNoteInput ? (
                <input
                  type="text"
                  placeholder="Packaging / Cooking Note (Optional)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 font-medium animate-fadeIn"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNoteInput(true)}
                  className="text-[11px] text-white/40 hover:text-[#E4A834] font-mono flex items-center gap-1 transition"
                >
                  <span>+ Add cooking / pickup note (optional)</span>
                </button>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3 rounded-xl transition shadow-lg active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Order via WhatsApp</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-0.5">
              <span>Takeaway Counter Pickup</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) clearCart();
                }}
                className="hover:text-red-400 underline"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
