import React, { useState, memo } from 'react';
import { Plus, Minus } from '../ui/Icon';
import type { MenuItem } from '../../data/restaurantData';

interface DishCardProps {
  item: MenuItem;
  currentQty: number;
  jainOnly: boolean;
  cartItemId: string;
  onAddToCart: (item: MenuItem, portion: 'single' | 'half' | 'full', diet: 'jain' | 'regular') => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
}

function DishCardComponent({
  item,
  currentQty,
  jainOnly,
  cartItemId,
  onAddToCart,
  onUpdateQuantity,
}: DishCardProps) {
  const hasMultiplePortions = Boolean(item.priceHalf && item.priceFull);
  const [portion, setPortion] = useState<'single' | 'half' | 'full'>(() => {
    if (item.priceHalf) return 'half';
    if (item.priceSingle) return 'single';
    return 'full';
  });

  const displayPrice =
    portion === 'half' && item.priceHalf
      ? item.priceHalf
      : portion === 'full' && item.priceFull
      ? item.priceFull
      : item.priceSingle || item.priceHalf || item.priceFull;

  const handleAdd = () => {
    const diet = jainOnly ? 'jain' : 'regular';
    onAddToCart(item, portion, diet);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#0F0F0F]/10 hover:border-[#D01B1B] transition-all duration-200 flex flex-col group shadow-sm hover:shadow-md">
      {/* Compact Luxury Aspect Image Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181818] shrink-0">
        <img
          src={item.image}
          alt={item.name}
          width={700}
          height={560}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
          <span className="bg-white text-green-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-green-600/30">
            100% VEG
          </span>
          {item.isJainAvailable && (
            <span className="bg-amber-100 text-[#965C00] font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-amber-300">
              JAIN
            </span>
          )}
        </div>
        {item.isSignature ? (
          <div className="absolute top-2.5 right-2.5 bg-[#D01B1B] text-white font-display text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            SIGNATURE
          </div>
        ) : item.isBestseller ? (
          <div className="absolute top-2.5 right-2.5 bg-[#965C00] text-white font-display text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
            BESTSELLER
          </div>
        ) : null}
      </div>

      {/* Snug Content & Pricing Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#D01B1B] uppercase tracking-wider font-bold block mb-1">
            {item.categoryLabel}
          </span>
          <h2 className="font-display text-sm sm:text-base font-bold uppercase text-[#0F0F0F] leading-snug line-clamp-1">
            {item.name}
          </h2>
          <p className="mt-1 text-xs text-[#0F0F0F]/65 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Portion Selector Pill if multiple sizes available */}
          {hasMultiplePortions && (
            <div className="inline-flex items-center gap-1 mt-2.5 bg-[#F7F4EB] p-0.5 rounded-lg border border-[#0F0F0F]/10 w-fit">
              <button
                type="button"
                onClick={() => setPortion('half')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                  portion === 'half'
                    ? 'bg-[#0F0F0F] text-white shadow-xs'
                    : 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]'
                }`}
              >
                Half ₹{item.priceHalf}
              </button>
              <button
                type="button"
                onClick={() => setPortion('full')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                  portion === 'full'
                    ? 'bg-[#0F0F0F] text-white shadow-xs'
                    : 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]'
                }`}
              >
                Full ₹{item.priceFull}
              </button>
            </div>
          )}
        </div>

        {/* Compact Attached Bottom CTA with Stepper Support */}
        <div className="pt-3 mt-3 border-t border-[#0F0F0F]/8 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#0F0F0F]/45 uppercase block leading-none mb-0.5">
              {hasMultiplePortions ? `${portion.toUpperCase()} PORTION` : 'PRICE'}
            </span>
            <span className="font-mono text-base font-bold text-[#0F0F0F]">
              ₹{displayPrice}/-
            </span>
          </div>

          {currentQty === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="relative overflow-hidden h-9 w-[100px] rounded-xl bg-[#0F0F0F] border border-[#0F0F0F] text-white flex items-center cursor-pointer group/btn shadow-xs transition-all duration-300 active:scale-95"
              aria-label={`Add ${item.name} to tray`}
            >
              <span className="font-display font-bold text-xs uppercase tracking-wider pl-3 transition-all duration-300 ease-out group-hover/btn:opacity-0 group-hover/btn:-translate-x-2">
                ADD
              </span>
              <span className="absolute right-0 top-0 bottom-0 w-8 h-full bg-[#D01B1B] flex items-center justify-center transition-all duration-300 ease-out group-hover/btn:w-full group-hover/btn:bg-[#B81414]">
                <Plus className="w-3.5 h-3.5 text-white transition-transform duration-300 ease-out group-hover/btn:scale-110" />
              </span>
            </button>
          ) : (
            <div className="h-9 w-[100px] flex items-center justify-between bg-[#0F0F0F] rounded-xl p-1 border border-[#E4A834]/40 shadow-xs">
              <button
                type="button"
                onClick={() => onUpdateQuantity(cartItemId, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#D01B1B] text-white transition active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-mono text-xs font-bold text-white">
                {currentQty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(cartItemId, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#E4A834] hover:text-black text-white transition active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const DishCard = memo(DishCardComponent);
export default DishCard;
