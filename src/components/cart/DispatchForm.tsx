import React from 'react';
import { MapPin, WhatsAppIcon } from '../ui/Icon';
import type { CartSummary } from '../../data/cartStore';
import type { OUTLETS } from '../../data/restaurantData';

interface DispatchFormProps {
  selectedOutletId: string;
  outlets: typeof OUTLETS;
  currentOutlet: (typeof OUTLETS)[0];
  onRequestOutletSwitch: (id: string) => void;
  customerName: string;
  customerPhone: string;
  orderNotes: string;
  showNoteInput: boolean;
  summary: CartSummary;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onNotesChange: (val: string) => void;
  onToggleNoteInput: (val: boolean) => void;
  onSubmitCheckout: (e: React.FormEvent) => void;
}

export default function DispatchForm({
  selectedOutletId,
  outlets,
  currentOutlet,
  onRequestOutletSwitch,
  customerName,
  customerPhone,
  orderNotes,
  showNoteInput,
  summary,
  onNameChange,
  onPhoneChange,
  onNotesChange,
  onToggleNoteInput,
  onSubmitCheckout,
}: DispatchFormProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 sidebar-scrollbar">
        {/* 1. Branch Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#0F0F0F]">
              1. Select Pickup Branch:
            </label>
            <div className="flex items-center gap-1 text-[10px] font-sans font-medium text-[#0F0F0F]/60">
              <MapPin className="w-3 h-3 text-[#965C00]" />
              <span>Ready in 20-25m</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {outlets.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onRequestOutletSwitch(o.id)}
                className={`px-3 py-2 rounded-xl border text-center transition-all duration-200 font-display text-xs font-bold uppercase tracking-wider min-h-[40px] flex items-center justify-center cursor-pointer ${
                  selectedOutletId === o.id
                    ? 'bg-[#0F0F0F] border-[#0F0F0F] text-[#E4A834] shadow-xs'
                    : 'bg-white border-[#0F0F0F]/15 text-[#0F0F0F]/70 hover:border-[#0F0F0F]/30 hover:text-[#0F0F0F]'
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Contact Information Form (Saved in localStorage) */}
        <form id="dispatch-form" onSubmit={onSubmitCheckout} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#0F0F0F]">
                2. Diner Contact:
              </label>
              {customerName && (
                <span className="text-[10px] font-sans text-emerald-600 font-bold">✓ Remembered on this device</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={customerName}
                  onChange={(e) => onNameChange(e.target.value)}
                  className="w-full bg-white border border-[#0F0F0F]/15 focus:border-[#E4A834] focus:ring-1 focus:ring-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-[#0F0F0F] placeholder-[#0F0F0F]/40 font-medium shadow-2xs"
                />
              </div>
              <div>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="WhatsApp Mobile No. *"
                  value={customerPhone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="w-full bg-white border border-[#0F0F0F]/15 focus:border-[#E4A834] focus:ring-1 focus:ring-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-[#0F0F0F] placeholder-[#0F0F0F]/40 font-sans font-medium shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Cooking Note Input */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#0F0F0F] mb-2">
              3. Cooking / Pickup Note (Optional):
            </label>
            {showNoteInput ? (
              <div className="animate-fadeIn">
                <input
                  type="text"
                  placeholder="e.g. Extra napkins, less spicy, prepare for 8:30 PM"
                  value={orderNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  className="w-full bg-white border border-[#0F0F0F]/15 focus:border-[#E4A834] focus:ring-1 focus:ring-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-[#0F0F0F] placeholder-[#0F0F0F]/40 font-medium shadow-2xs"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onToggleNoteInput(true)}
                className="text-[11px] text-[#0F0F0F]/60 hover:text-[#965C00] font-sans font-medium flex items-center gap-1 transition cursor-pointer"
              >
                <span>+ Add cooking instruction or pickup time</span>
              </button>
            )}
          </div>

          {/* Order Review Docket */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4A834]/30 space-y-2 text-xs font-sans shadow-xs">
            <div className="flex items-center justify-between text-[#0F0F0F]/70 text-[11px]">
              <span>Pickup Branch</span>
              <span className="text-[#0F0F0F] font-bold">{currentOutlet.name}</span>
            </div>
            <div className="flex items-center justify-between text-[#0F0F0F]/70 text-[11px]">
              <span>Tray Contents</span>
              <span className="text-[#0F0F0F]">{summary.itemCount} items</span>
            </div>
            <div className="pt-2 border-t border-dashed border-[#C89B53]/40 flex items-center justify-between text-[#0F0F0F] font-bold">
              <span className="font-display uppercase tracking-wider">Total Payable on Pickup</span>
              <span className="text-[#D01B1B] text-base font-sans font-bold">₹{summary.grandTotal}/-</span>
            </div>
          </div>

          {/* Purity Assurance Seal */}
          <div className="p-3 rounded-xl bg-white border border-[#0F0F0F]/8 flex items-center gap-2.5 text-[11px] text-[#0F0F0F]/75 font-sans shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>100% Shuddh Desi Ghee • Prepared Fresh on Highway Bhatti</span>
          </div>
        </form>
      </div>

      {/* STAGE 2 DOCKED FOOTER: Direct WhatsApp Dispatch */}
      <div className="p-4 sm:p-5 border-t border-[#E4A834]/30 bg-[#0F0F0F] text-white shrink-0 space-y-2">
        <button
          type="submit"
          form="dispatch-form"
          className="w-full flex items-center justify-center gap-2.5 bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition min-h-[46px] border border-white/10 shadow-lg cursor-pointer"
        >
          <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center p-0.5 shrink-0">
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
          </span>
          <span>Send Takeaway Order via WhatsApp</span>
        </button>

        <div className="flex items-center justify-between text-[10px] font-sans font-medium text-white/50 pt-0.5">
          <span>Direct Branch Manager Connection</span>
          <span className="text-[#E4A834]">15-Min Table/Tray Hold</span>
        </div>
      </div>
    </>
  );
}
