import { describe, it, expect } from 'vitest';
import { DAILY_RATE, OVER_3_DAYS_RATE, WEEKLY_RATE, formatVnd } from './pricing';

describe('pricing', () => {
  it('daily tiers step down', () => {
    expect(DAILY_RATE).toBe(150000); // 1–2 days
    expect(OVER_3_DAYS_RATE).toBe(130000); // from 3 days
    expect(WEEKLY_RATE).toBe(100000); // 1 week or more
    expect(OVER_3_DAYS_RATE).toBeLessThan(DAILY_RATE);
    expect(WEEKLY_RATE).toBeLessThan(OVER_3_DAYS_RATE);
  });
  it('formatVnd renders Vietnamese đồng', () => {
    expect(formatVnd(150000)).toBe('150.000 ₫');
  });
});
