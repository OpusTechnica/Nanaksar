import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { X, Calendar, Clock, Users, MapPin, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { $isReservationOpen, $reservationOutletId } from '../data/cartStore';
import { OUTLETS, BRAND_INFO } from '../data/restaurantData';

export default function TableReservationModal() {
  const isOpen = useStore($isReservationOpen);
  const selectedOutletId = useStore($reservationOutletId);

  const [outletId, setOutletId] = useState(selectedOutletId);
  const [partySize, setPartySize] = useState('3-4');
  const [reservationDate, setReservationDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Dinner (7:30 PM - 9:30 PM)');
  const [dietaryType, setDietaryType] = useState('Regular Pure Veg');
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

    // Build WhatsApp Reservation Dispatch Message
    let text = `*NANAKSAR DHABA INDORE • TABLE RESERVATION*\n`;
    text += `?? *Branch:* ${currentOutlet.name} (${currentOutlet.subtitle})\n`;
    text += `?? *Booking Ref:* #${ref}\n`;
    text += `-------------------------\n`;
    text += `?? *Date:* ${reservationDate}\n`;
    text += `? *Slot:* ${timeSlot}\n`;
    text += `?? *Guests:* ${partySize} Guests\n`;
    text += `?? *Dietary Note:* ${dietaryType}\n`;
    text += `?? *Primary Contact:* ${name} (${phone})\n`;
    text += `-------------------------\n`;
    text += `?? *Table Hold Policy:* Held for 15 mins from reserved time, then released to walk-ins.\n\n`;
    text += `_Please reply with 'CONFIRMED' to lock seating._`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${currentOutlet.whatsappPhone}?text=${encoded}`;

    setConfirmed(true);

    // Open WhatsApp ticket in new window
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
      {/* Click Outside */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Adaptive Container: Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="relative z-10 w-full md:max-w-2xl bg-[#181818] text-white rounded-t-3xl md:rounded-2xl max-h-[90dvh] overflow-y-auto border border-white/10 pb-safe">
        
        {/* Header (Solid Obsidian) */}
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
          /* Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-950/80 text-green-400 border border-green-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-display text-2xl font-bold uppercase text-white">
              Reservation Pass Generated!
            </h4>
            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
              Your booking ticket for <strong className="text-white">{partySize} guests</strong> at <strong className="text-[#E4A834]">{currentOutlet.name}</strong> has been routed to the outlet manager.
            </p>
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs max-w-sm mx-auto text-left space-y-1 text-white/80">
              <p><span className="text-[#E4A834]">Booking Ref:</span> #{bookingRef}</p>
              <p><span className="text-[#E4A834]">Date:</span> {reservationDate}</p>
              <p><span className="text-[#E4A834]">Slot:</span> {timeSlot}</p>
              <p><span className="text-[#E4A834]">Outlet:</span> {currentOutlet.address}</p>
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
          /* Structured Form View */
          <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 space-y-5">
            
            {/* 1. Branch Selector Chips (5 Outlets) */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2">
                1. Select Indore Outlet:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OUTLETS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOutletId(o.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between min-h-[48px] ${
                      outletId === o.id
                        ? 'bg-[#E4A834]/15 border-[#E4A834] text-white'
                        : 'bg-[#202020] border-white/10 text-white/70 hover:border-white/25'
                    }`}
                  >
                    <span className="font-display text-xs font-bold uppercase tracking-wide">
                      {o.name}
                    </span>
                    <span className="text-[10px] text-white/50 line-clamp-1">{o.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Party Size Selector */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-2">
                2. Select Party Size:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: '2', label: '2 Guests', subtitle: 'Pair Table' },
                  { value: '3-4', label: '3-4 Guests', subtitle: 'Family Table' },
                  { value: '5-8', label: '5-8 Guests', subtitle: 'Large Group' },
                  { value: '9+', label: '9+ Guests', subtitle: 'Sewa Banquet' },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPartySize(p.value)}
                    className={`p-2.5 rounded-xl border text-center transition min-h-[48px] ${
                      partySize === p.value
                        ? 'bg-[#D01B1B]/20 border-[#D01B1B] text-white'
                        : 'bg-[#202020] border-white/10 text-white/70 hover:border-white/25'
                    }`}
                  >
                    <span className="font-display text-xs font-bold uppercase block">{p.label}</span>
                    <span className="text-[10px] text-white/50">{p.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Date & Meal Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5">
                  3. Reservation Date:
                </label>
                <input
                  type="date"
                  required
                  value={reservationDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full bg-[#202020] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5">
                  4. Preferred Time Slot:
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#202020] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-sm text-white font-medium"
                >
                  <option>Lunch (12:30 PM • 3:30 PM)</option>
                  <option>Dinner (7:30 PM - 9:30 PM)</option>
                  <option>Late Night Highway Halt (9:30 PM • 11:30 PM)</option>
                </select>
              </div>
            </div>

            {/* 4. Dietary Tag (Responsive 1-col on Mobile, 3-col on SM) */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5">
                5. Kitchen Dietary Preference:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Regular Pure Veg', label: 'Pure Veg', desc: 'Standard Pure Veg Kitchen' },
                  { id: 'Jain Friendly (No Onion/Garlic/Root)', label: 'Jain Friendly', desc: 'Zero Onion/Garlic/Kandmool' },
                  { id: 'Swaminarayan Pure', label: 'Swaminarayan', desc: 'Strict Satvik Preparation' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietaryType(d.id)}
                    className={`p-2.5 rounded-xl border text-center transition min-h-[44px] ${
                      dietaryType === d.id
                        ? 'bg-green-950/80 border-green-600 text-white'
                        : 'bg-[#202020] border-white/10 text-white/70 hover:border-white/25'
                    }`}
                  >
                    <span className="font-display text-xs font-bold block">{d.label}</span>
                    <span className="text-[10px] text-white/50">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-white/80 mb-1">
                  Primary Contact Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#202020] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-sm text-white placeholder-white/40"
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
                  placeholder="e.g. +91 98260 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#202020] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3.5 py-2.5 text-base md:text-sm text-white placeholder-white/40"
                />
              </div>
            </div>

            {/* 15-Minute Policy Alert */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-start gap-2.5 text-xs text-white/70">
              <AlertCircle className="w-4 h-4 text-[#E4A834] shrink-0 mt-0.5" />
              <p>
                <strong className="text-white font-medium">15-Minute Table Hold Rule:</strong> In the spirit of dhaba sewa, tables are held for 15 minutes past reserved time before being offered to waiting walk-in guests.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#D01B1B] hover:bg-[#B81414] text-white font-display font-bold uppercase tracking-wider text-sm py-4 rounded-xl transition flex items-center justify-center gap-2 min-h-[48px]"
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
