import { describe, it, expect, vi, afterEach } from 'vitest';
import * as api from '../services/api';
import axios from 'axios';

vi.mock('axios');

// Helper to reset and mock axios methods
const mockAxiosGet = axios.get as unknown as ReturnType<typeof vi.fn>;
const mockAxiosPost = axios.post as unknown as ReturnType<typeof vi.fn>;
const mockAxiosPut = axios.put as unknown as ReturnType<typeof vi.fn>;
const mockAxiosDelete = axios.delete as unknown as ReturnType<typeof vi.fn>;

describe('api service', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('getProducts fetches products', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: [{ id: '1', name: 'Test' }] });
    const products = await api.getProducts();
    expect(products[0].name).toBe('Test');
  });

  it('getMetrics fetches metrics', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: { categoryMetrics: {}, overall: { totalProducts: 1 } } });
    const metrics = await api.getMetrics();
    expect(metrics.overall.totalProducts).toBe(1);
  });

  it('createProduct posts product', async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: { id: '2', name: 'New' } });
    const product = await api.createProduct({ name: 'New' });
    expect(product.id).toBe('2');
  });

  it('updateProduct puts product', async () => {
    mockAxiosPut.mockResolvedValueOnce({ data: { id: '1', name: 'Updated' } });
    const product = await api.updateProduct('1', { name: 'Updated' });
    expect(product.name).toBe('Updated');
  });

  it('deleteProduct deletes product', async () => {
    mockAxiosDelete.mockResolvedValueOnce({});
    await expect(api.deleteProduct('1')).resolves.toBeUndefined();
  });
});
