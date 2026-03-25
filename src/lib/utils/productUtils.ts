import type { PriceListItem } from '@/types';

export function calculateAfterDiscountPrice(
  unitPrice: number,
  discountType: 'Percentage' | 'Fixed',
  discount: string
): number {
  const discountValue = parseFloat(discount) || 0;
  if (discountType === 'Percentage') {
    const discounted = unitPrice - (unitPrice * discountValue) / 100;
    return Math.round(discounted * 100) / 100;
  }
  const discounted = unitPrice - discountValue;
  return Math.round(Math.max(0, discounted) * 100) / 100;
}

export function getPriceRange(pricelist?: PriceListItem[]): string {
  if (!pricelist || pricelist.length === 0) return '—';
  const activePrices = pricelist.filter((p) => p.status === 'active').map((p) => p.afterDiscountPrice);
  if (activePrices.length === 0) return '—';
  const min = Math.min(...activePrices);
  const max = Math.max(...activePrices);
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validatePriceList(pricelist: PriceListItem[]): string | null {
  for (const item of pricelist) {
    if (!item.unitSize.trim()) return 'Unit size is required for all price entries';
    if (item.unitPrice <= 0) return 'Unit price must be greater than 0';
    const discount = parseFloat(item.discount);
    if (isNaN(discount) || discount < 0) return 'Discount must be a non-negative number';
    if (item.discountType === 'Percentage' && discount > 100)
      return 'Percentage discount cannot exceed 100';
  }
  return null;
}
