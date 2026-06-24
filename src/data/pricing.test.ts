import { describe, it, expect } from 'vitest';
import { DAILY_RATE, OVER_3_DAYS_RATE, WEEKLY_RATE, formatVnd } from './pricing';

describe('pricing', () => {
  it('daily tiers step down', () => {
    expect(DAILY_RATE).toBe(150000);
    expect(OVER_3_DAYS_RATE).toBe(120000);
    expect(WEEKLY_RATE).toBe(100000);
    expect(OVER_3_DAYS_RATE).toBeLessThan(DAILY_RATE);
    expect(WEEKLY_RATE).toBeLessThan(OVER_3_DAYS_RATE);
  });
  it('over-3-days is a 20% discount on daily', () => {
    expect(OVER_3_DAYS_RATE).toBe(Math.round(DAILY_RATE * 0.8));
  });
  it('formatVnd renders Vietnamese đồng', () => {
    expect(formatVnd(150000)).toBe('150.000 ₫');
  });
});
