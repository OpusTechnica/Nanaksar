import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { X, Calendar, Clock, Utensils, CheckCircle, AlertCircle } from './ui/Icon';
import { $isReservationOpen, $reservationOutletId } from '../data/cartStore';
import { OUTLETS, BRAND_INFO } from '../data/restaurantData';
import { LuxurySelect, LuxuryDatePicker } from './ui/LuxuryControls';

const TIME_SLOT_OPTIONS = [
  { value: 'Lunch (12:30 PM • 3:30 PM)', label: 'Lunch (12:30 PM – 3:30 PM)' },
  { value: 'Dinner (7:30 PM - 9:30 PM)', label: 'Dinner (7:30 PM – 9:30 PM)' },
  { value: 'Late Night Highway Halt (9:30 PM • 11:30 PM)', label: 'Late Night Highway (9:30 PM – 11:30 PM)' },
];

const DIETARY_OPTIONS = [
  { value: 'Regular Pure Veg', label: '100% Shuddh Pure Veg' },
  { value: 'Jain Friendly (No Onion/Garlic/Root)', label: 'Jain Friendly (No Root/Onion/Garlic)' },
  { value: 'Swaminarayan Pure', label: 'Swaminarayan Satvik Prep' },
];

export default function TableReservationModal() {
  const isOpen = useStore($isReservationOpen);
  const selectedOutletId = useStore($reservationOutletId);

  const [outletId, setOutletId] = useState(selectedOutletId);
  const [partySize, setPartySize] = useState('3-4');
  const [reservationDate, setReservationDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOT_OPTIONS[1].value);
  const [dietaryType, setDietaryType] = useState(DIETARY_OPTIONS[0].value);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const currentOutlet = OUTLETS.find((o) => o.id === outletId) || OUTLETS[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);

    let text = `*NANAKSAR DHABA INDORE • TABLE RESERVATION*\n`;
    text += `📍 *Branch:* ${currentOutlet.name} (${currentOutlet.subtitle})\n`;
    text += `🎫 *Booking Ref:* #${ref}\n`;
    text += `-------------------------\n`;
    text += `📅 *Date:* ${reservationDate}\n`;
    text += `⏰ *Slot:* ${timeSlot}\n`;
    text += `👥 *Guests:* ${partySize} Guests\n`;
    text += `🌱 *Dietary Note:* ${dietaryType}\n`;
    text += `👤 *Primary Contact:* ${name} (${phone})\n`;
    text += `-------------------------\n`;
    text += `ℹ️ *Table Hold Policy:* Held for 15 mins from reserved time, then released to walk-ins.\n\n`;
    text += `_Please reply with 'CONFIRMED' to lock seating._`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${currentOutlet.whatsappPhone}?text=${encoded}`;

    setConfirmed(true);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  const handleClose = () => {
    setConfirmed(false);
    $isReservationOpen.set(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 animate-fadeIn p-0 md:p-4"
    >
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative z-10 w-full md:max-w-xl bg-[#181818] text-white rounded-t-3xl md:rounded-2xl max-h-[90dvh] overflow-y-auto border border-white/10 pb-safe">
        
        <div className="sticky top-0 z-20 p-4 sm:p-5 border-b border-white/10 bg-[#0F0F0F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E4A834]/15 text-[#E4A834] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#E4A834] uppercase tracking-widest block font-bold">
                SEWA TABLE RESERVATION
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white">
                Book Your Family Table
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-950/80 text-green-400 border border-green-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-display text-2xl font-bold uppercase text-white">
              Reservation Pass Generated!
            </h4>
            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
              Your booking ticket for <strong className="text-white">{partySize} guests</strong> at <strong className="text-[#E4A834]">{currentOutlet.name}</strong> has been routed to the outlet manager.
            </p>
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs max-w-sm mx-auto text-left space-y-1 text-white/80">
              <p><span className="text-[#E4A834]">Booking Ref:</span> #{bookingRef}</p>
              <p><span className="text-[#E4A834]">Date:</span> {reservationDate} ({timeSlot})</p>
              <p><span className="text-[#E4A834]">Outlet:</span> {currentOutlet.name}</p>
              <p><span className="text-[#E4A834]">Contact:</span> {name} ({phone})</p>
            </div>
            <p className="text-[11px] text-amber-400/90 font-medium">
              • Tables are held for 15 minutes from reservation time before being released to walk-in guests.
            </p>
            <button
              onClick={handleClose}
              className="bg-[#D01B1B] hover:bg-[#B81414] text-white px-8 py-3 rounded-xl font-display font-bold uppercase tracking-wider text-xs"
            >
              Done &amp; Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 space-y-4">
            
            {/* 1. Branch Selector Chips */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2">
                1. Select Indore Outlet:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {OUTLETS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOutletId(o.id)}
                    className={`px-3 py-2 rounded-xl border text-center transition font-display text-xs font-bold uppercase tracking-wider ${
                      outletId === o.id
                        ? 'bg-[#E4A834]/20 border-[#E4A834] text-white ring-1 ring-[#E4A834]'
                        : 'bg-[#202020] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Party Size & Custom Date Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5">
                  2. Party Size:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { value: '2', label: '2' },
                    { value: '3-4', label: '3-4' },
                    { value: '5-8', label: '5-8' },
                    { value: '9+', label: '9+' },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPartySize(p.value)}
                      className={`py-2 px-1 rounded-xl border text-center font-display text-xs font-bold transition ${
                        partySize === p.value
                          ? 'bg-[#D01B1B] border-[#D01B1B] text-white'
                          : 'bg-[#202020] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <LuxuryDatePicker
                label="3. Reservation Date:"
                value={reservationDate}
                onChange={setReservationDate}
              />
            </div>

            {/* 3. Custom Luxury Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <LuxurySelect
                label="4. Time Slot:"
                value={timeSlot}
                onChange={setTimeSlot}
                options={TIME_SLOT_OPTIONS}
                icon={<Clock className="w-3.5 h-3.5" />}
              />

              <LuxurySelect
                label="5. Dietary Prep:"
                value={dietaryType}
                onChange={setDietaryType}
                options={DIETARY_OPTIONS}
                icon={<Utensils className="w-3.5 h-3.5" />}
              />
            </div>

            {/* 4. Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-white/80 mb-1">
                  Contact Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#202020] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2 text-base md:text-xs text-white placeholder-white/40"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-white/80 mb-1">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="e.g. 98260 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#202020] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2 text-base md:text-xs text-white placeholder-white/40"
                />
              </div>
            </div>

            {/* 15-Minute Policy Alert */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 text-xs text-white/70">
              <AlertCircle className="w-3.5 h-3.5 text-[#E4A834] shrink-0" />
              <span>Tables held for 15 mins past reserved time.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 min-h-[46px] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E4A834]"
            >
              <span>CONFIRM RESERVATION &amp; SEND PASS</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
