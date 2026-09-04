import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Check } from './Icon';

interface LuxurySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export function LuxurySelect({ label, value, onChange, options, icon }: LuxurySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDismiss = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleDismiss);
    return () => document.removeEventListener('pointerdown', handleDismiss);
  }, []);

  const currentOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#121212] hover:bg-[#181818] border rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4A834] ${
          isOpen ? 'border-[#E4A834] ring-1 ring-[#E4A834]' : 'border-white/15'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="text-[#E4A834] shrink-0">{icon}</span>}
          <span className="truncate text-white font-medium">{currentOption.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#E4A834] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0A0A0A] border border-[#E4A834]/50 rounded-xl shadow-[0_15px_45px_rgba(0,0,0,0.95)] z-50 py-1.5 overflow-hidden animate-fadeIn">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-3 text-xs transition-all flex items-center justify-between min-h-[44px] ${
                  isSelected
                    ? 'bg-[#D01B1B]/25 text-[#E4A834] font-bold border-l-2 border-[#E4A834]'
                    : 'text-white/80 hover:bg-[#E4A834]/15 hover:text-[#E4A834] hover:pl-4.5'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#E4A834] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface LuxuryDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string;
}

export function LuxuryDatePicker({ label, value, onChange, minDate }: LuxuryDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ? new Date(minDate + 'T00:00:00') : today;
  min.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleDismiss = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleDismiss);
    return () => document.removeEventListener('pointerdown', handleDismiss);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const days: { day: number; dateStr: string; isPast: boolean; isSelected: boolean }[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(i).padStart(2, '0');
    const fullDateStr = `${viewYear}-${mStr}-${dStr}`;
    const dateObj = new Date(viewYear, viewMonth, i);
    dateObj.setHours(0, 0, 0, 0);

    const isPast = dateObj < min;
    const isSelected = fullDateStr === value;

    days.push({ day: i, dateStr: fullDateStr, isPast, isSelected });
  }

  const formatDisplay = (dStr: string) => {
    if (!dStr) return 'Select Date';
    const d = new Date(dStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const setShortcutDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${dt}`;
    onChange(formatted);
    setViewYear(y);
    setViewMonth(d.getMonth());
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#E4A834] mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#121212] hover:bg-[#181818] border rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E4A834] ${
          isOpen ? 'border-[#E4A834] ring-1 ring-[#E4A834]' : 'border-white/15'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 text-[#E4A834] shrink-0" />
          <span className="font-mono text-white font-medium">{formatDisplay(value)}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#E4A834] transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-[258px] max-w-[calc(100vw-2rem)] bg-[#0A0A0A] border border-[#E4A834]/50 rounded-2xl p-3 shadow-[0_15px_50px_rgba(0,0,0,0.95)] z-50 animate-fadeIn">
          
          {/* Header: Month & Chevrons */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#E4A834]">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#E4A834]/20 text-white hover:text-[#E4A834] transition"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#E4A834]/20 text-white hover:text-[#E4A834] transition"
                aria-label="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-display font-bold text-[#E4A834]/70 uppercase mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="w-11 h-11" />
            ))}

            {days.map((item) => (
              <button
                key={item.dateStr}
                type="button"
                disabled={item.isPast}
                onClick={() => {
                  onChange(item.dateStr);
                  setIsOpen(false);
                }}
                className={`w-11 h-11 rounded-lg text-[11px] font-mono font-medium flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-[#E4A834] ${
                  item.isSelected
                    ? 'bg-[#D01B1B] text-white font-bold ring-1 ring-[#E4A834] scale-105'
                    : item.isPast
                    ? 'text-white/20 cursor-not-allowed'
                    : 'text-white hover:bg-[#E4A834]/20 hover:text-[#E4A834]'
                }`}
                aria-disabled={item.isPast}
              >
                {item.day}
              </button>
            ))}
          </div>

          {/* Quick Shortcuts: Today / Tomorrow */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setShortcutDate(0)}
                className="text-[#E4A834] hover:underline min-h-[44px] px-2"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setShortcutDate(1)}
                className="text-white/70 hover:text-white hover:underline min-h-[44px] px-2"
              >
                Tomorrow
              </button>
          </div>

        </div>
      )}
    </div>
  );
}
