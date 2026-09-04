import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import { OUTLETS, type MenuItem } from './restaurantData';

export interface CartItem {
  id: string; // e.g. 'dal-makhani-full-jain'
  menuItemId: string;
  name: string;
  portion: 'half' | 'full' | 'single';
  portionLabel: string;
  price: number;
  quantity: number;
  isJain: boolean;
  isSwaminarayan: boolean;
  packagingFee: number;
}

// Persistent Cart Store in localStorage
export const $cart = persistentAtom<CartItem[]>('nanaksar_cart_v1', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Persistent Selected Outlet Store
export const $selectedOutletId = persistentAtom<string>('nanaksar_outlet_v1', 'dewas-naka');

// UI State Atoms (In-Memory)
export const $isCartOpen = atom<boolean>(false);
export const $isReservationOpen = atom<boolean>(false);
export const $reservationOutletId = atom<string>('dewas-naka');

// Cart Operations
export function addToCart(
  item: MenuItem,
  portion: 'half' | 'full' | 'single',
  dietaryChoice: 'regular' | 'jain' | 'swaminarayan' = 'regular',
  shouldOpenDrawer: boolean = false
) {
  let price = item.priceSingle || item.priceFull || 0;
  let portionLabel = 'Standard';

  if (portion === 'half' && item.priceHalf) {
    price = item.priceHalf;
    portionLabel = 'Half';
  } else if (portion === 'full' && item.priceFull) {
    price = item.priceFull;
    portionLabel = 'Full';
  } else if (portion === 'single' && item.priceSingle) {
    price = item.priceSingle;
    portionLabel = 'Per Piece / Meal';
  }

  const isJain = dietaryChoice === 'jain';
  const isSwaminarayan = dietaryChoice === 'swaminarayan';
  const cartItemId = `${item.id}-${portion}-${dietaryChoice}`;

  const current = $cart.get();
  const existingIndex = current.findIndex((ci) => ci.id === cartItemId);

  if (existingIndex > -1) {
    const updated = [...current];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + 1,
    };
    $cart.set(updated);
  } else {
    $cart.set([
      ...current,
      {
        id: cartItemId,
        menuItemId: item.id,
        name: item.name,
        portion,
        portionLabel,
        price,
        quantity: 1,
        isJain,
        isSwaminarayan,
        packagingFee: item.packagingFee || 15,
      },
    ]);
  }

  if (shouldOpenDrawer) {
    $isCartOpen.set(true);
  }
}

export function openCart() {
  $isCartOpen.set(true);
}

export function closeCart() {
  $isCartOpen.set(false);
}

export function updateCartQuantity(cartItemId: string, delta: number) {
  const current = $cart.get();
  const updated = current
    .map((item) => {
      if (item.id === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean) as CartItem[];

  $cart.set(updated);
}

export function removeFromCart(cartItemId: string) {
  $cart.set($cart.get().filter((item) => item.id !== cartItemId));
}

export function updateCartItemPortion(
  cartItemId: string,
  newPortion: 'half' | 'full',
  menuItem?: MenuItem
) {
  const current = $cart.get();
  const existingItemIndex = current.findIndex((item) => item.id === cartItemId);
  if (existingItemIndex === -1) return;

  const currentItem = current[existingItemIndex];
  if (currentItem.portion === newPortion) return;

  const dietaryTag = currentItem.isJain ? 'jain' : currentItem.isSwaminarayan ? 'swaminarayan' : 'regular';
  const targetCartItemId = `${currentItem.menuItemId}-${newPortion}-${dietaryTag}`;

  let newPrice = currentItem.price;
  if (menuItem) {
    if (newPortion === 'half' && menuItem.priceHalf) {
      newPrice = menuItem.priceHalf;
    } else if (newPortion === 'full' && menuItem.priceFull) {
      newPrice = menuItem.priceFull;
    }
  }

  const targetExistingIndex = current.findIndex((item) => item.id === targetCartItemId);

  if (targetExistingIndex > -1 && targetExistingIndex !== existingItemIndex) {
    const updated = current
      .map((item, idx) => {
        if (idx === targetExistingIndex) {
          return {
            ...item,
            quantity: item.quantity + currentItem.quantity,
          };
        }
        if (idx === existingItemIndex) {
          return null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    $cart.set(updated);
  } else {
    const updated = [...current];
    updated[existingItemIndex] = {
      ...currentItem,
      id: targetCartItemId,
      portion: newPortion,
      portionLabel: newPortion === 'half' ? 'Half' : 'Full',
      price: newPrice,
    };
    $cart.set(updated);
  }
}

export function clearCart() {
  $cart.set([]);
}

export function switchOutlet(newOutletId: string): boolean {
  const current = $cart.get();
  if (current.length > 0 && $selectedOutletId.get() !== newOutletId) {
    clearCart();
  }
  $selectedOutletId.set(newOutletId);
  return true;
}

// Calculate Cart Totals
export function getCartSummary() {
  const items = $cart.get();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const packagingTotal = items.reduce((sum, item) => sum + item.packagingFee * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + packagingTotal + gst;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal,
    packagingTotal,
    gst,
    grandTotal,
    itemCount,
  };
}

// Generate WhatsApp Deep Link formatted message
export function buildWhatsAppOrderUrl(customerName: string, customerPhone: string, notes: string = ''): string {
  const summary = getCartSummary();
  const outlet = OUTLETS.find((o) => o.id === $selectedOutletId.get()) || OUTLETS[0];
  const orderRef = `NK-${Math.floor(1000 + Math.random() * 9000)}`;

  let text = `*NANAKSAR DHABA INDORE - TAKEAWAY ORDER*\n`;
  text += `*Outlet:* ${outlet.name} (${outlet.subtitle})\n`;
  text += `*Order Ref:* #${orderRef}\n`;
  text += `-------------------------\n`;

  summary.items.forEach((item) => {
    let dietTag = '';
    if (item.isJain) dietTag = ' [*** JAIN PREP - NO ONION/GARLIC ***]';
    if (item.isSwaminarayan) dietTag = ' [*** SWAMINARAYAN PREP ***]';
    text += `- ${item.quantity}x ${item.name} (${item.portionLabel}) - Rs. ${item.price * item.quantity}${dietTag}\n`;
  });

  text += `-------------------------\n`;
  text += `Subtotal: Rs. ${summary.subtotal}\n`;
  text += `Packaging Fee: Rs. ${summary.packagingTotal}\n`;
  text += `GST (5%): Rs. ${summary.gst}\n`;
  text += `*GRAND TOTAL: Rs. ${summary.grandTotal}*\n`;
  text += `-------------------------\n`;
  text += `*Customer:* ${customerName || 'Diner'}\n`;
  if (customerPhone) text += `*Phone:* ${customerPhone}\n`;
  if (notes) text += `*Notes:* ${notes}\n`;
  text += `*Est. Pickup:* 25-30 Mins (Takeaway Counter)\n\n`;
  text += `_Sent via Nanaksar Dhaba Official App_`;

  const encoded = encodeURIComponent(text);
  const phone = outlet.whatsappPhone;

  return `https://wa.me/${phone}?text=${encoded}`;
}
