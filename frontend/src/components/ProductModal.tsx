import React, { useEffect, useState, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import { X } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product?: Product;
  categories: string[];
  loading?: boolean;
}

export function ProductModal({ isOpen, onClose, onSave, product, categories, loading }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    expirationDate: '',
    isAvailable: true,
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        expirationDate: '',
        isAvailable: true,
      });
    }
  }, [product]);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (selectedOption: any) => {
    setFormData({ ...formData, category: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white border-9 border-gray-400 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close Modal">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="product-name"
              type="text"
              required
              ref={nameInputRef}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Product Name"
            />
          </div>
          <div>
            <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">Category</label>
            <CreatableSelect
              inputId="product-category"
              isClearable
              value={categoryOptions.find(option => option.value === formData.category)}
              onChange={handleCategoryChange}
              options={categoryOptions}
              className="mt-1"
              placeholder="Select or type to create"
              aria-label="Product Category"
            />
          </div>
          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              id="product-price"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Product Price"
            />
          </div>
          <div>
            <label htmlFor="product-expiration" className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <input
              id="product-expiration"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Product Expiration Date"
            />
          </div>
          <div>
            <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              id="product-stock"
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              aria-label="Product Stock"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}