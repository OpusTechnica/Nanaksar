import React from 'react';

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
  | 'star'
  | 'flame';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name?: IconName;
  size?: number | string;
  className?: string;
}

export function Icon({ name, size = 20, className = 'w-5 h-5', ...props }: IconProps) {
  if (!name) return null;
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
      {...props}
    >
      <use href={`/assets/icons.svg#${name}`} />
    </svg>
  );
}

// Dedicated Zero-Overhead Direct Components for 100% Type-Safe Drop-In Replacements
export const ShoppingBag = (props: IconProps) => <Icon name="shopping-bag" {...props} />;
export const Utensils = (props: IconProps) => <Icon name="utensils" {...props} />;
export const Menu = (props: IconProps) => <Icon name="menu" {...props} />;
export const X = (props: IconProps) => <Icon name="x" {...props} />;
export const Plus = (props: IconProps) => <Icon name="plus" {...props} />;
export const Minus = (props: IconProps) => <Icon name="minus" {...props} />;
export const Trash2 = (props: IconProps) => <Icon name="trash-2" {...props} />;
export const Send = (props: IconProps) => <Icon name="send" {...props} />;
export const MapPin = (props: IconProps) => <Icon name="map-pin" {...props} />;
export const AlertTriangle = (props: IconProps) => <Icon name="alert-triangle" {...props} />;
export const Calendar = (props: IconProps) => <Icon name="calendar" {...props} />;
export const Clock = (props: IconProps) => <Icon name="clock" {...props} />;
export const CheckCircle = (props: IconProps) => <Icon name="check-circle" {...props} />;
export const AlertCircle = (props: IconProps) => <Icon name="alert-circle" {...props} />;
export const ChevronDown = (props: IconProps) => <Icon name="chevron-down" {...props} />;
export const ChevronLeft = (props: IconProps) => <Icon name="chevron-left" {...props} />;
export const ChevronRight = (props: IconProps) => <Icon name="chevron-right" {...props} />;
export const Search = (props: IconProps) => <Icon name="search" {...props} />;
export const Check = (props: IconProps) => <Icon name="check" {...props} />;
export const ArrowRight = (props: IconProps) => <Icon name="arrow-right" {...props} />;
export const Star = (props: IconProps) => <Icon name="star" {...props} />;
export const Flame = (props: IconProps) => <Icon name="flame" {...props} />;
