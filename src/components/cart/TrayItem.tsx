import React, { memo } from 'react';
import { Plus, Minus, Trash2, TrayIcon } from '../ui/Icon';
import type { CartItem } from '../../data/cartStore';
import type { MenuItem } from '../../data/restaurantData';

interface TrayItemProps {
  item: CartItem;
  menuItem?: MenuItem;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onUpdatePortion: (id: string, portion: 'half' | 'full', menuItem?: MenuItem) => void;
}

function TrayItemComponent({
  item,
  menuItem,
  quantity,
  onUpdateQuantity,
  onRemove,
  onUpdatePortion,
}: TrayItemProps) {
  const thumbUrl = menuItem?.thumbImage || menuItem?.image || '/assets/menu/thumbs/dal-makhani.webp';
  const hasMultiplePortions = Boolean(menuItem?.priceHalf && menuItem?.priceFull);

  return (
    <div className="bg-[#181818] p-3.5 sm:p-4 rounded-2xl border border-white/10 hover:border-[#E4A834]/30 transition shadow-sm flex flex-col gap-3">
      {/* ROW 1: 60px Fixed Thumbnail + Title/Badges + 44px Touch Trash */}
      <div className="flex items-start gap-3 w-full">
        {/* 60px Fixed Thumbnail with Branded Skeleton Fallback */}
        <div className="w-[60px] h-[60px] shrink-0 rounded-xl bg-[#121212] border border-white/10 overflow-hidden relative flex items-center justify-center">
          <TrayIcon className="absolute w-6 h-6 text-[#E4A834]/20" />
          <img
            src={thumbUrl}
            alt={item.name}
            loading="eager"
            decoding="async"
            width={60}
            height={60}
            className="relative z-10 w-full h-full object-cover"
          />
        </div>

        {/* Title & Badges */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wide leading-snug line-clamp-2">
            {item.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {hasMultiplePortions ? (
              <div className="inline-flex items-center bg-[#101010] p-0.5 rounded-lg border border-white/15 shadow-xs">
                <button
                  type="button"
                  onClick={() => onUpdatePortion(item.id, 'half', menuItem)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    item.portion === 'half'
                      ? 'bg-[#E4A834] text-[#0F0F0F] shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-label={`Switch ${item.name} to Half portion`}
                >
                  Half ₹{menuItem?.priceHalf}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePortion(item.id, 'full', menuItem)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    item.portion === 'full' || item.portion === 'single'
                      ? 'bg-[#E4A834] text-[#0F0F0F] shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-label={`Switch ${item.name} to Full portion`}
                >
                  Full ₹{menuItem?.priceFull}
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold text-[#E4A834] bg-[#E4A834]/10 px-2 py-0.5 rounded border border-[#E4A834]/20">
                {item.portionLabel}
              </span>
            )}
            {item.isJain && (
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
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

        {/* 44px Touch Target Trash */}
        <button
          onClick={() => onRemove(item.id)}
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/40 hover:text-red-400 rounded-xl hover:bg-white/5 transition -mt-1 -mr-1 shrink-0 active:scale-95 cursor-pointer"
          title="Remove item"
          aria-label={`Remove ${item.name} from tray`}
        >
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* ROW 2: 44px Stepper & Line Subtotal */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
        <div className="flex items-center bg-[#121212] rounded-xl border border-white/15 overflow-hidden h-11">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="w-11 h-full min-w-[44px] flex items-center justify-center hover:bg-[#D01B1B] text-white transition active:scale-95 cursor-pointer"
            aria-label="Decrease quantity"
          >
            {quantity === 1 ? <Trash2 className="w-4 h-4 text-red-400" /> : <Minus className="w-4 h-4" />}
          </button>
          <span className="w-8 text-center font-mono text-xs font-bold text-white">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-11 h-full min-w-[44px] flex items-center justify-center hover:bg-[#E4A834] hover:text-black text-white transition active:scale-95 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Line Item Subtotal */}
        <span className="font-mono text-base sm:text-lg font-bold text-[#E4A834]">
          ₹{item.price * quantity}/-
        </span>
      </div>
    </div>
  );
}

export const TrayItem = memo(TrayItemComponent);
export default TrayItem;
