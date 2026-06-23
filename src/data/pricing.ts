import type { BikeId } from './fleet';

export type Period = 'daily' | 'weekly' | 'monthly';

/**
 * Illustrative pricing in Vietnamese đồng. The live store does not publish
 * rates publicly, so these are realistic placeholders — see README.
 */
export const PRICING: Record<BikeId, Record<Period, number>> = {
  'evo-200-lite': { daily: 150000, weekly: 850000, monthly: 2800000 },
  'feliz-s': { daily: 180000, weekly: 1000000, monthly: 3200000 },
  theon: { daily: 220000, weekly: 1250000, monthly: 3900000 },
};

export const getPrice = (id: BikeId, period: Period): number => PRICING[id][period];

/** Flat daily tiers shown on the pricing page. */
export const DAILY_RATE = 150000; // 1–3 days
export const LONG_STAY_RATE = 100000; // more than 3 days

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(amount)} ₫`;
}
