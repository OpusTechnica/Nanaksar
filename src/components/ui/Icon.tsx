import React from 'react';

const BASE_URL: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL) ||
  '/';
const NORMALIZED_BASE = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
export const SPRITE_URL = `${NORMALIZED_BASE}assets/icons.svg`;

export type IconName =
  | 'shopping-bag'
  | 'utensils'
  | 'menu'
  | 'x'
  | 'plus'
  | 'minus'
  | 'trash-2'
  | 'send'
  | 'map-pin'
  | 'alert-triangle'
  | 'calendar'
  | 'clock'
  | 'check-circle'
  | 'alert-circle'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'search'
  | 'check'
  | 'arrow-right'
  | 'arrow-left'
  | 'star'
  | 'star-solid'
  | 'flame'
  | 'veg-seal'
  | 'tandoor-mark'
  | 'phone';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  title?: string;
}

/**
 * Nanak Heritage Icon — single-source sprite consumer.
 *
 * Color map (binding):
 * - Line icons inherit currentColor from one of three approved contexts:
 *   1. body text (cream/charcoal), 2. gold #E4A834 on #0F0F0F, 3. dark amber #965C00 on cream.
 * - Veg seal container must set text-[#15803D]. Crimson #D01B1B is NEVER an icon stroke.
 */
export function Icon({ name, size = 20, className = 'w-5 h-5', title, ...props }: IconProps) {
  const labelProps = props['aria-label'] ?? props['aria-labelledby'];
  const decorative = !title && !labelProps;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {/* @ts-expect-error — xlinkHref retained for legacy WebViews alongside href */}
      <use href={`${SPRITE_URL}#${name}`} xlinkHref={`${SPRITE_URL}#${name}`} />
    </svg>
  );
}

// Dedicated Zero-Overhead Direct Components for 100% Type-Safe Drop-In Replacements
export const ShoppingBag = (props: Omit<IconProps, 'name'>) => <Icon name="shopping-bag" {...props} />;
export const Utensils = (props: Omit<IconProps, 'name'>) => <Icon name="utensils" {...props} />;
export const Menu = (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />;
export const X = (props: Omit<IconProps, 'name'>) => <Icon name="x" {...props} />;
export const Plus = (props: Omit<IconProps, 'name'>) => <Icon name="plus" {...props} />;
export const Minus = (props: Omit<IconProps, 'name'>) => <Icon name="minus" {...props} />;
export const Trash2 = (props: Omit<IconProps, 'name'>) => <Icon name="trash-2" {...props} />;
export const Send = (props: Omit<IconProps, 'name'>) => <Icon name="send" {...props} />;
export const MapPin = (props: Omit<IconProps, 'name'>) => <Icon name="map-pin" {...props} />;
export const AlertTriangle = (props: Omit<IconProps, 'name'>) => <Icon name="alert-triangle" {...props} />;
export const Calendar = (props: Omit<IconProps, 'name'>) => <Icon name="calendar" {...props} />;
export const Clock = (props: Omit<IconProps, 'name'>) => <Icon name="clock" {...props} />;
export const CheckCircle = (props: Omit<IconProps, 'name'>) => <Icon name="check-circle" {...props} />;
export const AlertCircle = (props: Omit<IconProps, 'name'>) => <Icon name="alert-circle" {...props} />;
export const ChevronDown = (props: Omit<IconProps, 'name'>) => <Icon name="chevron-down" {...props} />;
export const ChevronLeft = (props: Omit<IconProps, 'name'>) => <Icon name="chevron-left" {...props} />;
export const ChevronRight = (props: Omit<IconProps, 'name'>) => <Icon name="chevron-right" {...props} />;
export const Search = (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />;
export const Check = (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />;
export const ArrowRight = (props: Omit<IconProps, 'name'>) => <Icon name="arrow-right" {...props} />;
export const ArrowLeft = (props: Omit<IconProps, 'name'>) => <Icon name="arrow-left" {...props} />;
export const Star = (props: Omit<IconProps, 'name'>) => <Icon name="star" {...props} />;
export const StarSolid = (props: Omit<IconProps, 'name'>) => <Icon name="star-solid" {...props} />;
export const Flame = (props: Omit<IconProps, 'name'>) => <Icon name="flame" {...props} />;
export const VegSeal = (props: Omit<IconProps, 'name'>) => <Icon name="veg-seal" {...props} />;
export const TandoorMark = (props: Omit<IconProps, 'name'>) => <Icon name="tandoor-mark" {...props} />;
export const Phone = (props: Omit<IconProps, 'name'>) => <Icon name="phone" {...props} />;

// Tailored High-Precision Vector Icons (Brand Aligned)
export function WhatsAppIcon({ className = 'w-5 h-5', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}

export function TrayIcon({ className = 'w-5 h-5', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <path d="M3 17h18" />
      <path d="M5 17a7 7 0 0 1 14 0" />
      <path d="M12 7V5" />
      <circle cx="12" cy="4" r="1" />
      <path d="M4 20h16" />
    </svg>
  );
}
