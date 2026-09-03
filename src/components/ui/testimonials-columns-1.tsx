import React from "react";

export interface TestimonialItem {
  text: string;
  image?: string;
  name: string;
  role: string;
  branch?: string;
  rating?: number;
  initials?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  const duration = props.duration || 45;

  return (
    <div className={`marquee-group relative overflow-hidden select-none ${props.className || ''}`}>
      {/* Silky 60fps hardware-composited vertical track with instant pause on hover */}
      <div
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
        className="marquee-track flex flex-col gap-6 pb-6"
      >
        {/* Set 1 */}
        {props.testimonials.map((item, i) => (
          <div
            className="p-6 sm:p-7 rounded-2xl bg-white border border-[#0F0F0F]/10 shadow-sm hover:shadow-md hover:border-[#E4A834]/50 transition-all duration-200 max-w-sm w-full flex flex-col justify-between shrink-0"
            key={`t1-${i}`}
          >
            <div>
              {/* 5-Star Rating */}
              <div className="flex items-center gap-1 text-[#D01B1B] text-xs mb-3">
                {"★".repeat(item.rating || 5)}
              </div>

              {/* Editorial Quote */}
              <p className="font-editorial italic text-sm sm:text-base text-[#0F0F0F]/85 leading-relaxed">
                "{item.text}"
              </p>
            </div>

            {/* Author Lockup */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#0F0F0F]/8">
              {item.image ? (
                <img
                  width={40}
                  height={40}
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover border border-[#E4A834]/30"
                  loading="lazy"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#D01B1B]/10 text-[#D01B1B] border border-[#D01B1B]/20 font-display font-bold text-xs flex items-center justify-center shrink-0">
                  {item.initials || item.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="font-display text-xs sm:text-sm font-bold uppercase text-[#0F0F0F] tracking-wide truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-[#0F0F0F]/55 font-mono truncate">
                  {item.role} {item.branch && `• ${item.branch}`}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Set 2 (Identical Clone for 100% Mathematically Seamless Infinite Loop) */}
        {props.testimonials.map((item, i) => (
          <div
            className="p-6 sm:p-7 rounded-2xl bg-white border border-[#0F0F0F]/10 shadow-sm hover:shadow-md hover:border-[#E4A834]/50 transition-all duration-200 max-w-sm w-full flex flex-col justify-between shrink-0"
            key={`t2-${i}`}
            aria-hidden="true"
          >
            <div>
              {/* 5-Star Rating */}
              <div className="flex items-center gap-1 text-[#D01B1B] text-xs mb-3">
                {"★".repeat(item.rating || 5)}
              </div>

              {/* Editorial Quote */}
              <p className="font-editorial italic text-sm sm:text-base text-[#0F0F0F]/85 leading-relaxed">
                "{item.text}"
              </p>
            </div>

            {/* Author Lockup */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#0F0F0F]/8">
              {item.image ? (
                <img
                  width={40}
                  height={40}
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover border border-[#E4A834]/30"
                  loading="lazy"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#D01B1B]/10 text-[#D01B1B] border border-[#D01B1B]/20 font-display font-bold text-xs flex items-center justify-center shrink-0">
                  {item.initials || item.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="font-display text-xs sm:text-sm font-bold uppercase text-[#0F0F0F] tracking-wide truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-[#0F0F0F]/55 font-mono truncate">
                  {item.role} {item.branch && `• ${item.branch}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
