import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../services/api';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

vi.mock('../services/api');

const mockProducts = [
	{
		id: '1',
		name: 'Laptop',
		category: 'Electronics',
		price: 999.99,
		expirationDate: '2025-12-31',
		stock: 15,
		isAvailable: true,
		createdAt: new Date('2025-01-01T00:00:00.000Z'),
		updatedAt: new Date('2025-01-01T00:00:00.000Z'),
	},
	{
		id: '2',
		name: 'Milk',
		category: 'Food',
		price: 1.5,
		expirationDate: '2025-12-31',
		stock: 0,
		isAvailable: true,
		createdAt: new Date('2025-01-01T00:00:00.000Z'),
		updatedAt: new Date('2025-01-01T00:00:00.000Z'),
	},
];

const mockMetrics = {
	overall: { totalProducts: 15, totalValue: 14999.85, averagePrice: 999.99 },
	Electronics: { totalProducts: 15, totalValue: 14999.85, averagePrice: 999.99 },
	Food: { totalProducts: 0, totalValue: 0, averagePrice: 0 },
};

describe('App integration', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.spyOn(api, 'getProducts').mockResolvedValue([...mockProducts]);
		vi.spyOn(api, 'getMetrics').mockResolvedValue(mockMetrics);
		vi.spyOn(api, 'createProduct').mockImplementation(async (product: any) => ({ ...product, id: '3' }));
		vi.spyOn(api, 'updateProduct').mockImplementation(async (id: any, product: any) => ({ ...product, id }));
		vi.spyOn(api, 'deleteProduct').mockResolvedValue(undefined);
	});

	it('renders products and metrics from backend', async () => {
		render(<App />);
		await waitFor(() => {
			expect(screen.getByText('Laptop')).toBeInTheDocument();
			expect(screen.getByText('Milk')).toBeInTheDocument();
			expect(screen.getByText('Inventory Manager')).toBeInTheDocument();
			expect(screen.getByRole('columnheader', { name: /total products in stock/i })).toBeInTheDocument();
		});
	});

	it('can filter by search term', async () => {
		render(<App />);
		await waitFor(() => screen.getByText('Laptop'));
		fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'Milk' } });
		expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
		expect(screen.getByText('Milk')).toBeInTheDocument();
	});

	it('can add a new product', async () => {
		render(<App />);
		await waitFor(() => screen.getByText('Laptop'));
		fireEvent.click(screen.getByText('New Product'));
		fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Bread' } });
		fireEvent.change(screen.getByRole('combobox', { name: /category/i }), { target: { value: 'Food' } });
		fireEvent.change(screen.getByRole('spinbutton', { name: /price/i }), { target: { value: '2.5' } });
		fireEvent.change(screen.getByRole('spinbutton', { name: /stock/i }), { target: { value: '10' } });
		fireEvent.click(screen.getByText(/save/i));
		await waitFor(() => expect(api.createProduct).toHaveBeenCalled());
	});

	it('can delete a product', async () => {
		render(<App />);
		await waitFor(() => screen.getByText('Laptop'));
		window.confirm = vi.fn(() => true);
		fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
		await waitFor(() => expect(api.deleteProduct).toHaveBeenCalled());
	});
});
