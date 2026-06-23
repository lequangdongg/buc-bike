import { describe, it, expect } from 'vitest';
import { PRICING, getPrice, formatVnd } from './pricing';

describe('pricing', () => {
  it('has a row per bike', () => {
    expect(Object.keys(PRICING)).toEqual(['evo-200-lite', 'feliz-s', 'theon']);
  });
  it('getPrice returns the right cell', () => {
    expect(getPrice('theon', 'monthly')).toBe(3900000);
  });
  it('formatVnd renders Vietnamese đồng', () => {
    expect(formatVnd(150000)).toBe('150.000 ₫');
  });
});
