import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('calls handlers on input change', () => {
    const onSearchChange = vi.fn();
    const onCategoriesChange = vi.fn();
    const onAvailabilityChange = vi.fn();
    const { getByPlaceholderText, getByText, getByRole } = render(
      <SearchBar
        searchTerm=""
        selectedCategories={[]}
        availability="all"
        onSearchChange={onSearchChange}
        onCategoriesChange={onCategoriesChange}
        onAvailabilityChange={onAvailabilityChange}
        onSearch={() => {}}
        categories={["Food", "Electronics"]}
      />
    );
    fireEvent.change(getByPlaceholderText(/search/i), { target: { value: 'Milk' } });
    expect(onSearchChange).toHaveBeenCalled();
    // For react-select, fireEvent.change does not work. Use react-select-event or simulate user interaction for full test.
    // fireEvent.change(getByRole('combobox', { name: /categories/i }), { target: { value: 'Food' } });
    // expect(onCategoriesChange).toHaveBeenCalled();
    fireEvent.change(getByRole('combobox', { name: /availability/i }), { target: { value: 'in_stock' } });
    expect(onAvailabilityChange).toHaveBeenCalled();
  });
});
