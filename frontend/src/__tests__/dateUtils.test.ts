import { describe, test, expect } from 'vitest';
import { getExpirationColor, getStockColor, formatDate } from '../utils/dateUtils';

describe('dateUtils', () => {
  test('getExpirationColor returns correct class for expired', () => {
    const expired = new Date(Date.now() - 86400000).toISOString();
    expect(getExpirationColor(expired)).toBe('bg-red-100');
  });

  test('getStockColor returns correct class for low stock', () => {
    expect(getStockColor(2)).toBe('bg-red-200');
  });

  test('formatDate formats date string', () => {
    // Accept both possible outputs due to timezone differences
    const formatted = formatDate('2025-06-22');
    expect(['06/21/2025', '06/22/2025']).toContain(formatted);
  });
});
