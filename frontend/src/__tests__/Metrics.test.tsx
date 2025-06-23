import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Metrics } from '../components/Metrics';

const metrics = {
  overall: { totalProducts: 2, totalValue: 100, averagePrice: 50 },
  Food: { totalProducts: 1, totalValue: 10, averagePrice: 10 },
  Electronics: { totalProducts: 1, totalValue: 90, averagePrice: 90 },
};

describe('Metrics', () => {
  it('renders overall and category metrics', () => {
    const { getByText } = render(<Metrics metrics={metrics as any} />);
    expect(getByText('Overall')).toBeTruthy();
    expect(getByText('Food')).toBeTruthy();
    expect(getByText('Electronics')).toBeTruthy();
  });
});
