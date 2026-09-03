import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { X, Plus, Minus, Trash2, Send, ShoppingBag, MapPin, AlertTriangle } from './ui/Icon';
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
} from '../data/cartStore';
import { OUTLETS } from '../data/restaurantData';

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const cart = useStore($cart);
  const selectedOutletId = useStore($selectedOutletId);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [branchSwitchWarning, setBranchSwitchWarning] = useState<string | null>(null);

  const summary = getCartSummary();
  const currentOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  if (!isOpen) return null;

  const handleOutletChange = (newId: string) => {
    if (newId === selectedOutletId) return;
    if (cart.length > 0) {
      if (confirm('Switching outlets will reset your current cart. Do you want to proceed?')) {
        switchOutlet(newId);
        setBranchSwitchWarning(null);
      }
    } else {
      switchOutlet(newId);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.items.length === 0) return;
    const url = buildWhatsAppOrderUrl(customerName, customerPhone, orderNotes);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={() => $isCartOpen.set(false)} />

      {/* Slide-out Drawer (Responsive Bottom-Sheet on Mobile, Right Drawer on Desktop) */}
      <div className="relative z-10 w-full max-w-md bg-[#181818] text-white flex flex-col h-full border-l border-white/10">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0F0F0F]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D01B1B]/15 text-[#D01B1B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                Takeaway Order Cart
              </h2>
              <p className="text-[11px] text-[#E4A834] font-mono">
                {summary.itemCount} item{summary.itemCount !== 1 ? 's' : ''} in cart
              </p>
            </div>
          </div>
          <button
            onClick={() => $isCartOpen.set(false)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white/80 hover:text-white"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outlet Selector Bar (Mandatory Branch Lock-in) */}
        <div className="p-3 sm:p-4 bg-[#121212] border-b border-white/10">
          <label className="flex items-center gap-1.5 text-[11px] font-display uppercase tracking-wider text-[#E4A834] mb-1.5 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Select Takeaway Pickup Outlet:</span>
          </label>
          <select
            value={selectedOutletId}
            onChange={(e) => handleOutletChange(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-white/15 focus:border-[#E4A834] outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white font-medium transition"
          >
            {OUTLETS.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name} • {outlet.subtitle}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-white/50 mt-1 font-mono">
            {currentOutlet.address}
          </p>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {summary.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/50">
              <ShoppingBag className="w-14 h-14 mb-3 text-white/20" />
              <p className="font-display text-lg font-bold text-white/80 uppercase">Your Cart is Empty</p>
              <p className="text-xs mt-1 max-w-xs font-sans">
                Browse our Crown Signatures or Bestsellers to add authentic highway flavors to your order.
              </p>
            </div>
          ) : (
            summary.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#202020] p-3.5 rounded-xl border border-white/10 flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wide">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-[#E4A834] font-medium">
                        {item.portionLabel} • ₹{item.price}
                      </span>
                      {item.isJain && (
                        <span className="text-[9px] font-bold text-green-400 bg-green-950/80 px-1.5 py-0.5 rounded border border-green-800">
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
                    className="text-white/40 hover:text-red-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stepper and Price */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 bg-[#141414] rounded-lg p-1 border border-white/10">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-mono text-sm font-bold text-white">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Form & Summary */}
        {summary.items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121212] pb-safe">
            {/* Bill Breakdown */}
            <div className="space-y-1.5 text-xs text-white/70 mb-3.5 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{summary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Parcel Packaging Fee</span>
                <span>₹{summary.packagingTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5% CGST+SGST)</span>
                <span>₹{summary.gst}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#E4A834] pt-1.5 border-t border-white/10">
                <span>Grand Total</span>
                <span>₹{summary.grandTotal}</span>
              </div>
            </div>

            {/* Quick Customer Details */}
            <form onSubmit={handleCheckout} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#E4A834] outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-white/40"
                />
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#E4A834] outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-white/40"
                />
              </div>

              <input
                type="text"
                placeholder="Special Cooking / Pickup Note (Optional)"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#E4A834] outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-white/40"
              />

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Order to Outlet via WhatsApp</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
