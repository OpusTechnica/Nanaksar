import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { OUTLETS, type Outlet } from '../data/restaurantData';

// ponytail: sticky-stack via already-installed `motion` (no gsap). One motion idea only:
// covered cards sink (scale + dim) while deck edges cascade. No glass, no glow, no gradients.

function StackCard({
  outlet,
  index,
  total,
  progress,
}: {
  outlet: Outlet;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const depth = total - 1 - index;
  // Deeper sink for cards buried under the deck - pure GPU composited scale
  const scale = useTransform(progress, [start, 1], [1, 1 - depth * 0.06]);
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      className="sticky pb-8 sm:pb-10"
      style={{ top: `calc(88px + ${index * 16}px)`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale }}
        className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 relative overflow-hidden bg-white transition-colors ${
          outlet.isFlagship
            ? 'border-2 border-[#E4A834]/60 shadow-[0_4px_24px_rgba(228,168,52,0.08)]'
            : 'border border-[#0F0F0F]/12 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
        }`}
      >
        {outlet.isFlagship && (
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#E4A834]/10 pointer-events-none" aria-hidden="true" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          <div className="lg:col-span-8 space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-mono font-bold text-[#0F0F0F]/40 tracking-widest">
                {num} / {String(total).padStart(2, '0')}
              </span>
              <span
                className={`text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                  outlet.isFlagship
                    ? 'bg-[#E4A834]/20 text-[#842F06] border-[#E4A834]/50'
                    : outlet.isNew
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-[#F7F4EB] text-[#842F06] border-[#965C00]/20'
                }`}
              >
                <svg className="w-3 h-3 shrink-0 inline-block mr-1 -mt-0.5" aria-hidden="true">
                  <use href="/assets/icons.svg#star-solid" />
                </svg>
                {outlet.tag}
              </span>
              <span className="text-[10px] font-mono text-green-700 font-bold inline-flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                OPEN UNTIL 3:00 AM
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#0F0F0F] leading-tight">
              {outlet.name} — <span className="text-[#842F06]">{outlet.subtitle}</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#0F0F0F]/75 font-sans leading-relaxed max-w-2xl">
              <strong className="text-[#0F0F0F]">Address:</strong> {outlet.address}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-[#0F0F0F]/70 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E4A834]" />
                <span>
                  Daily Hours: <strong>{outlet.timings}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E4A834]" />
                <span>
                  Phone: <strong>{outlet.phone}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
            <a
              href={outlet.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0F0F0F] hover:bg-[#D01B1B] text-white text-xs font-display font-bold uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-200 shadow-md min-h-[44px] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 text-[#E4A834]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <use href="/assets/icons.svg#map-pin" />
              </svg>
              <span>{outlet.isFlagship ? 'Get Flagship Directions' : 'Get Directions'}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <use href="/assets/icons.svg#arrow-right" />
              </svg>
            </a>

            <a
              href={`tel:${outlet.phone.replace(/\s/g, '')}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F7F4EB] text-[#0F0F0F] text-xs font-display font-bold uppercase tracking-wider py-3 px-5 rounded-xl border border-[#0F0F0F]/15 transition min-h-[44px]"
            >
              <svg className="w-3.5 h-3.5 text-[#D01B1B]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <use href="/assets/icons.svg#phone" />
              </svg>
              <span>Call {outlet.name} Outlet</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OutletsStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  if (reduceMotion) {
    return (
      <div className="space-y-4 sm:space-y-5">
        {OUTLETS.map((outlet) => (
          <div
            key={outlet.id}
            className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 bg-white ${
              outlet.isFlagship
                ? 'border-2 border-[#E4A834]/60'
                : 'border border-[#0F0F0F]/12'
            }`}
          >
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#0F0F0F]">
              {outlet.name} — <span className="text-[#842F06]">{outlet.subtitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#0F0F0F]/75 mt-2">{outlet.address}</p>
            <div className="flex flex-wrap gap-2.5 mt-4">
              <a
                href={outlet.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white text-xs font-display font-bold uppercase tracking-wider py-3 px-5 rounded-xl min-h-[44px]"
              >
                Get Directions
              </a>
              <a
                href={`tel:${outlet.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 bg-white text-[#0F0F0F] text-xs font-display font-bold uppercase tracking-wider py-3 px-5 rounded-xl border border-[#0F0F0F]/15 min-h-[44px]"
              >
                Call {outlet.name}
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <p className="text-center text-[10px] font-mono tracking-[0.25em] text-[#965C00] uppercase mb-6 sm:mb-8" aria-hidden="true">
        Scroll — five hearths, one journey
      </p>
      {OUTLETS.map((outlet, i) => (
        <StackCard key={outlet.id} outlet={outlet} index={i} total={OUTLETS.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
