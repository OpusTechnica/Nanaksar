import React, { useState } from 'react';
import { CheckCircle, Clock, Utensils } from './ui/Icon';
import { OUTLETS } from '../data/restaurantData';
import { LuxurySelect, LuxuryDatePicker } from './ui/LuxuryControls';

const TIME_SLOT_OPTIONS = [
  { value: 'Lunch (12:30 PM • 3:30 PM)', label: 'Lunch (12:30 PM – 3:30 PM)' },
  { value: 'Dinner (7:30 PM - 9:30 PM)', label: 'Dinner (7:30 PM – 9:30 PM)' },
  { value: 'Late Night Highway (9:30 PM • 11:30 PM)', label: 'Late Night (9:30 PM – 11:30 PM)' },
  { value: 'Midnight Hearth (11:30 PM • 2:00 AM)', label: 'Midnight (11:30 PM – 2:00 AM)' },
];

const DIETARY_OPTIONS = [
  { value: '100% Shuddh Pure Veg', label: '100% Shuddh Pure Veg' },
  { value: 'Jain Friendly (No Root/Onion/Garlic)', label: 'Jain Friendly (No Root/Onion/Garlic)' },
  { value: 'Swaminarayan Satvik', label: 'Swaminarayan Satvik Prep' },
];

export default function BookTableInlineForm() {
  const [outletId, setOutletId] = useState(OUTLETS[0].id);
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

  const currentOutlet = OUTLETS.find((o) => o.id === outletId) || OUTLETS[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);

    // Build WhatsApp Reservation Dispatch Message
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

  const handleReset = () => {
    setConfirmed(false);
    setName('');
    setPhone('');
  };

  if (confirmed) {
    return (
      <div className="bg-[#0D0D0D] rounded-2xl border border-[#E4A834]/40 p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-green-950/80 text-green-400 border border-green-700 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h4 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
          Reservation Pass Generated!
        </h4>
        <p className="text-xs text-white/70 max-w-md mx-auto">
          Your table for <strong className="text-white">{partySize} guests</strong> at <strong className="text-[#E4A834]">{currentOutlet.name}</strong> has been routed via WhatsApp.
        </p>
        <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs max-w-sm mx-auto text-left space-y-1.5 text-white/85">
          <p><span className="text-[#E4A834]">Ref:</span> #{bookingRef}</p>
          <p><span className="text-[#E4A834]">Date:</span> {reservationDate} ({timeSlot})</p>
          <p><span className="text-[#E4A834]">Outlet:</span> {currentOutlet.name}</p>
          <p><span className="text-[#E4A834]">Contact:</span> {name} ({phone})</p>
        </div>
        <p className="text-xs text-[#E4A834] font-display font-medium tracking-wide flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4A834]"></span>
          <span>Tables held for 15 minutes past reserved time before release.</span>
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white px-6 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider text-xs transition"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleBookingSubmit} className="bg-[#0D0D0D] rounded-2xl border border-white/15 p-3.5 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl">
      
      {/* 1. Select Indore Outlet (Sleek Horizontal Scroll on Mobile, Wrapped on Desktop) */}
      <div>
        <label className="block text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5 sm:mb-2">
          1. Select Indore Branch:
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap">
          {OUTLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOutletId(o.id)}
              className={`whitespace-nowrap shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-center transition font-display text-xs font-bold uppercase tracking-wider min-h-[38px] sm:min-h-[44px] ${
                outletId === o.id
                  ? 'bg-[#E4A834]/15 border-[#E4A834] text-[#E4A834]'
                  : 'bg-[#121212] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Party Size & Custom Luxury Date Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Party Size */}
        <div>
          <label className="block text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1 sm:mb-1.5">
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
                  className={`py-1.5 sm:py-2 px-1 rounded-xl border text-center font-display text-xs font-bold transition min-h-[38px] sm:min-h-[44px] ${
                  partySize === p.value
                    ? 'bg-[#D01B1B]/20 border-[#D01B1B] text-white'
                    : 'bg-[#121212] border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Luxury Date Picker */}
        <LuxuryDatePicker
          label="3. Reservation Date:"
          value={reservationDate}
          onChange={setReservationDate}
        />
      </div>

      {/* 3. Time Slot & Dietary Prep (Custom Luxury Popover Selects) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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

      {/* 4. Contact Name & WhatsApp Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-0.5 sm:pt-1">
        <div>
          <label className="block text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-white/80 mb-1">
            Contact Name:
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Gurpreet Singh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-base md:text-xs text-white placeholder-white/40 min-h-[40px] sm:min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-white/80 mb-1">
            WhatsApp Mobile:
          </label>
          <input
            type="tel"
            inputMode="tel"
            required
            placeholder="e.g. 98260 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#121212] border border-white/15 focus:border-[#E4A834] outline-none rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-base md:text-xs text-white placeholder-white/40 min-h-[40px] sm:min-h-[44px]"
          />
        </div>
      </div>

      {/* Policy Reassurance & Submit Button */}
      <div className="pt-1 space-y-2">
        <button
          type="submit"
          className="w-full bg-[#D01B1B] hover:bg-[#B81414] active:scale-[0.98] text-white font-display font-bold uppercase tracking-wider text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl transition flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[46px] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E4A834]"
        >
          <span>CONFIRM TABLE &amp; GENERATE PASS</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><use href="/assets/icons.svg#arrow-right"/></svg>
        </button>

        <p className="text-[11px] sm:text-xs text-center text-white/70 font-display tracking-wide flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4A834]"></span>
          <span>Tables are held for 15 mins past reserved time</span>
        </p>
      </div>

    </form>
  );
}
