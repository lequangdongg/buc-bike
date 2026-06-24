/**
 * Flat daily rental tiers in Vietnamese đồng. The live store does not publish
 * rates publicly, so these are realistic placeholders — see README.
 */
export const DAILY_RATE = 150000; // 1–3 days
export const OVER_3_DAYS_RATE = 120000; // more than 3 days (−20%)
export const WEEKLY_RATE = 100000; // 1 week or more
// Monthly: contact us (no fixed published rate).

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(amount)} ₫`;
}
