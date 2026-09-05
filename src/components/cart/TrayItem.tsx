import React, { memo } from 'react';
import { Plus, Minus, X, TrayIcon } from '../ui/Icon';
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
    <div className="bg-white p-4 rounded-2xl border border-[#E4A834]/30 hover:border-[#E4A834]/60 transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3 group">
      {/* ROW 1: 68px Food Thumbnail + Details (Title, Portion, Badges) + Subtle Dismiss */}
      <div className="flex items-start gap-3.5 w-full">
        {/* 68px Fixed Thumbnail with Branded Skeleton Fallback */}
        <div className="w-[68px] h-[68px] shrink-0 rounded-xl bg-[#F7F4EB] border border-[#E4A834]/30 overflow-hidden relative flex items-center justify-center shadow-xs">
          <TrayIcon className="absolute w-6 h-6 text-[#E4A834]/30" />
          <img
            src={thumbUrl}
            alt={item.name}
            loading="eager"
            decoding="async"
            width={68}
            height={68}
            className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Title, Badges & Portion Selector */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display text-sm font-bold text-[#0F0F0F] uppercase tracking-wide leading-snug line-clamp-2">
              {item.name}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-[#0F0F0F]/30 hover:text-[#D01B1B] hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
              title="Remove item"
              aria-label={`Remove ${item.name} from tray`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {hasMultiplePortions ? (
              <div className="inline-flex items-center bg-[#F7F4EB] p-0.5 rounded-lg border border-[#E4A834]/30 shadow-xs">
                <button
                  type="button"
                  onClick={() => onUpdatePortion(item.id, 'half', menuItem)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    item.portion === 'half'
                      ? 'bg-[#0F0F0F] text-[#E4A834] shadow-xs'
                      : 'text-[#0F0F0F]/65 hover:text-[#0F0F0F]'
                  }`}
                  aria-label={`Switch ${item.name} to Half portion`}
                >
                  Half • ₹{menuItem?.priceHalf}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePortion(item.id, 'full', menuItem)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    item.portion === 'full' || item.portion === 'single'
                      ? 'bg-[#0F0F0F] text-[#E4A834] shadow-xs'
                      : 'text-[#0F0F0F]/65 hover:text-[#0F0F0F]'
                  }`}
                  aria-label={`Switch ${item.name} to Full portion`}
                >
                  Full • ₹{menuItem?.priceFull}
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-sans font-bold text-[#965C00] bg-[#E4A834]/15 px-2.5 py-1 rounded-md border border-[#E4A834]/30">
                {item.portionLabel}
              </span>
            )}
            {item.isJain && (
              <span className="text-[9px] font-bold text-[#15803D] bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                JAIN PREP
              </span>
            )}
            {item.isSwaminarayan && (
              <span className="text-[9px] font-bold text-[#965C00] bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                SWAMINARAYAN
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: Tactile Stepper on Left & Price Display on Right */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#0F0F0F]/8">
        <div className="flex items-center bg-[#F7F4EB] rounded-xl border border-[#0F0F0F]/12 overflow-hidden h-9 shadow-xs">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="w-9 h-full flex items-center justify-center hover:bg-[#D01B1B] hover:text-white text-[#0F0F0F]/80 transition active:scale-95 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-sans text-xs font-bold text-[#0F0F0F]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-9 h-full flex items-center justify-center hover:bg-[#0F0F0F] hover:text-white text-[#0F0F0F]/80 transition active:scale-95 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Item Subtotal */}
        <div className="text-right">
          <span className="font-sans text-base sm:text-lg font-bold text-[#0F0F0F] tracking-tight">
            ₹{item.price * quantity}/-
          </span>
          {quantity > 1 && (
            <span className="text-[10px] font-sans text-[#0F0F0F]/50 block leading-none mt-0.5">
              ₹{item.price} each
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const TrayItem = memo(TrayItemComponent);
export default TrayItem;
