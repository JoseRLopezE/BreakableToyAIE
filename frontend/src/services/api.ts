import axios from 'axios';
import { Product, Metrics } from '../types';

const API_URL = 'http://localhost:9090/api/products';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getMetrics = async (): Promise<Metrics> => {
  const response = await axios.get(`${API_URL}/metrics`);
  // Convert backend response to Metrics type expected by frontend
  const { categoryMetrics, overall } = response.data;
  return { ...categoryMetrics, overall };
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const markProductOutOfStock = async (id: string): Promise<void> => {
  await axios.post(`${API_URL}/products/${id}/outofstock`);
};

export const markProductInStock = async (id: string): Promise<void> => {
  await axios.put(`${API_URL}/products/${id}/instock`);
};