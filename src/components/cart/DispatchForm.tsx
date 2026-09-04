import React from 'react';
import { MapPin, AlertTriangle, WhatsAppIcon } from '../ui/Icon';
import type { CartSummary } from '../../data/cartStore';
import type { OUTLETS } from '../../data/restaurantData';

interface DispatchFormProps {
  selectedOutletId: string;
  outlets: typeof OUTLETS;
  currentOutlet: (typeof OUTLETS)[0];
  pendingOutletSwitch: string | null;
  onRequestOutletSwitch: (id: string) => void;
  onConfirmOutletSwitch: () => void;
  onCancelOutletSwitch: () => void;
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
  pendingOutletSwitch,
  onRequestOutletSwitch,
  onConfirmOutletSwitch,
  onCancelOutletSwitch,
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
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834]">
              1. Select Pickup Branch:
            </label>
            <div className="flex items-center gap-1 text-[10px] font-mono text-white/60">
              <MapPin className="w-3 h-3 text-[#E4A834]" />
              <span>Ready in 20-25m</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {outlets.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onRequestOutletSwitch(o.id)}
                className={`px-3 py-2.5 rounded-xl border text-center transition font-display text-xs font-bold uppercase tracking-wider min-h-[44px] flex items-center justify-center cursor-pointer ${
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
              Switching your takeaway branch to{' '}
              <strong className="text-white">
                {outlets.find((o) => o.id === pendingOutletSwitch)?.name}
              </strong>{' '}
              will reset your tray items. Do you want to proceed?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onConfirmOutletSwitch}
                className="px-3.5 py-2 rounded-xl bg-[#D01B1B] hover:bg-[#B81414] text-white font-display text-xs font-bold uppercase tracking-wider transition min-h-[44px] active:scale-95 cursor-pointer"
              >
                Yes, Switch Branch
              </button>
              <button
                type="button"
                onClick={onCancelOutletSwitch}
                className="px-3.5 py-2 rounded-xl bg-[#121212] border border-white/15 text-white/80 hover:text-white font-display text-xs uppercase tracking-wider transition min-h-[44px] active:scale-95 cursor-pointer"
              >
                Cancel &amp; Stay Here
              </button>
            </div>
          </div>
        )}

        {/* 2. Contact Information Form (Saved in localStorage) */}
        <form id="dispatch-form" onSubmit={onSubmitCheckout} className="space-y-4">
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
                  onChange={(e) => onNameChange(e.target.value)}
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
                  onChange={(e) => onPhoneChange(e.target.value)}
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
                  onChange={(e) => onNotesChange(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-xs text-white placeholder-white/40 font-medium"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onToggleNoteInput(true)}
                className="text-[11px] text-white/50 hover:text-[#E4A834] font-mono flex items-center gap-1 transition cursor-pointer"
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
          className="w-full flex items-center justify-center gap-2.5 bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition min-h-[46px] border border-white/10 shadow-lg cursor-pointer"
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
  );
}
