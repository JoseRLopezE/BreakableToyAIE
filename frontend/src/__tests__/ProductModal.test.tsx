import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ProductModal } from '../components/ProductModal';

const defaultProduct = {
  id: '',
  name: '',
  category: '',
  price: 0,
  expirationDate: '',
  stock: 0,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductModal', () => {
  it('renders and submits with valid data', () => {
    const onSave = vi.fn();
    const { getByRole, getByText } = render(
      <ProductModal isOpen={true} onClose={() => {}} onSave={onSave} product={undefined} categories={['Food']} />
    );
    fireEvent.change(getByRole('textbox', { name: /name/i }), { target: { value: 'Bread' } });
    // For react-select, use combobox
    fireEvent.change(getByRole('combobox', { name: /category/i }), { target: { value: 'Food' } });
    fireEvent.change(getByRole('spinbutton', { name: /price/i }), { target: { value: '2.5' } });
    fireEvent.change(getByRole('spinbutton', { name: /stock/i }), { target: { value: '10' } });
    fireEvent.click(getByText(/save/i));
    expect(onSave).toHaveBeenCalled();
  });

  it('calls onClose when closed', () => {
    const onClose = vi.fn();
    const { getByText } = render(
      <ProductModal isOpen={true} onClose={onClose} onSave={() => {}} product={defaultProduct} categories={['Food']} />
    );
    // Find the close button by its role or text
    fireEvent.click(getByText(/cancel/i));
    expect(onClose).toHaveBeenCalled();
  });
});
