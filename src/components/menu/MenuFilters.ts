import type { MenuItem } from '../../data/restaurantData';

export const PAGE_CHUNK_SIZE = 18;

// Exact physical menu sections matching Menu.webp through Menu-3.webp
export const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'dal', label: 'Dal' },
  { id: 'paneer', label: 'Paneer Main Course' },
  { id: 'sabjiya', label: 'Sabjiya' },
  { id: 'chaap', label: 'Dhaba Style Soya Chaap' },
  { id: 'tandoori-chaap', label: 'Tandoori Chaap' },
  { id: 'kofta', label: 'Kofta' },
  { id: 'roti', label: 'Roti' },
  { id: 'rice-pulao', label: 'Rice & Pulao' },
  { id: 'chinese-starter', label: 'Chinese Starter' },
  { id: 'tandoori-starter', label: 'Tandoori Starter' },
  { id: 'starter', label: 'Starter' },
  { id: 'soups', label: "Soup's" },
  { id: 'salad', label: 'Salad' },
  { id: 'sweets', label: 'Sweets' },
  { id: 'coldrinks', label: 'Coldrinks' },
  { id: 'combos', label: 'Thalis & Combos' },
] as const;

export const SORT_OPTIONS = [
  { id: 'recommended', label: "Chef's Recommendation" },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Bestsellers & Popular' },
  { id: 'spicy', label: 'Spiciness: Mild to Spicy' },
] as const;

export const PRICE_TIERS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-150', label: 'Under ₹150' },
  { id: '150-250', label: '₹150 – ₹250' },
  { id: 'above-250', label: '₹250+' },
] as const;

// Helper to check category affiliation
export function itemMatchesCategory(item: MenuItem, catId: string): boolean {
  if (catId === 'all') return true;
  if (catId === 'roti') return item.category === 'roti' || item.category === 'breads';
  if (catId === 'rice-pulao') return item.category === 'rice-pulao' || item.category === 'rice';
  if (catId === 'sweets') return item.category === 'sweets' || item.category === 'desserts';
  return item.category === catId;
}

// Helper to check price tier affiliation
export function itemMatchesPrice(item: MenuItem, tierId: string): boolean {
  if (tierId === 'all') return true;
  const p = item.priceSingle || item.priceHalf || item.priceFull || 0;
  if (tierId === 'under-150') return p < 150;
  if (tierId === '150-250') return p >= 150 && p <= 250;
  if (tierId === 'above-250') return p > 250;
  return true;
}

export interface FilterCriteria {
  selectedCategory: string;
  jainOnly: boolean;
  priceFilter: string;
  searchQuery: string;
  sortBy: string;
}

// Pure filter and sort calculation
export function filterAndSortMenuItems(items: MenuItem[], criteria: FilterCriteria): MenuItem[] {
  const { selectedCategory, jainOnly, priceFilter, searchQuery, sortBy } = criteria;
  const trimmedQuery = searchQuery.trim().toLowerCase();

  return items
    .filter((item) => {
      if (!itemMatchesCategory(item, selectedCategory)) return false;
      if (jainOnly && !item.isJainAvailable) return false;
      if (!itemMatchesPrice(item, priceFilter)) return false;
      if (trimmedQuery) {
        return (
          item.name.toLowerCase().includes(trimmedQuery) ||
          item.description.toLowerCase().includes(trimmedQuery) ||
          item.categoryLabel.toLowerCase().includes(trimmedQuery)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.priceSingle || a.priceHalf || a.priceFull || 0;
      const priceB = b.priceSingle || b.priceHalf || b.priceFull || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'popular') {
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        return 0;
      }
      if (sortBy === 'spicy') {
        const spiceOrder: Record<string, number> = { mild: 1, medium: 2, spicy: 3 };
        return (spiceOrder[a.spiceLevel] || 2) - (spiceOrder[b.spiceLevel] || 2);
      }
      // 'recommended' default: signatures first, then bestsellers
      if (a.isSignature && !b.isSignature) return -1;
      if (!a.isSignature && b.isSignature) return 1;
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
}
