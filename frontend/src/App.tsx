import { useState, useEffect } from 'react';
import { ArrowUpDown, Edit, Trash } from 'lucide-react';
import { Product, SortConfig, Availability, Metrics as MetricsType } from './types';
import { SearchBar } from './components/SearchBar';
import { Metrics } from './components/Metrics';
import { getExpirationColor, getStockColor, formatDate } from './utils/dateUtils';
import { ProductModal } from './components/ProductModal';
import { getProducts, getMetrics, createProduct, updateProduct, deleteProduct } from './services/api';

const ITEMS_PER_PAGE = 10;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<MetricsType>({
    overall: { totalProducts: 0, totalValue: 0, averagePrice: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchMetrics();
  }, []);

  const fetchProducts = async () => {
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      // Extract unique categories from products
      const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    }
  };

  const fetchMetrics = async () => {
    setError(null);
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load metrics. Please try again.');
    }
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setError(null);
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSelectedProducts((prev) => prev.filter((productId) => productId !== id));
      } catch (err) {
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    const now = new Date();
    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(editingProduct.id, { ...productData, updatedAt: now });
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
      } else {
        const newProduct = await createProduct({ ...productData, createdAt: now, updatedAt: now });
        setProducts((prev) => [...prev, newProduct]);
        if (!categories.includes(newProduct.category)) {
          setCategories((prev) => [...prev, newProduct.category]);
        }
      }
      setIsModalOpen(false);
      setEditingProduct(undefined);
    } catch (err) {
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, stock: checked ? 0 : 10 };
      }
      return product;
    });
    setProducts(updatedProducts);
    setSelectedProducts((prev) =>
      checked ? [...prev, id] : prev.filter(productId => productId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    const updatedProducts = products.map((product) => ({
      ...product,
      stock: checked ? 0 : 10,
    }));
    setProducts(updatedProducts);
    setSelectedProducts(checked ? filteredProducts.map(p => p.id) : []);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => 
      selectedCategories.length === 0 || selectedCategories.includes(product.category)
    )
    .filter((product) => {
      if (availability === 'in_stock') return product.stock > 0;
      if (availability === 'out_of_stock') return product.stock === 0;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      return aValue < bValue ? -direction : direction;
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Inventory Manager</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        <SearchBar
          searchTerm={searchTerm}
          selectedCategories={selectedCategories}
          availability={availability}
          onSearchChange={setSearchTerm}
          onCategoriesChange={setSelectedCategories}
          onAvailabilityChange={setAvailability}
          onSearch={() => {}}
          categories={categories}
        />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <button
              onClick={() => {
                setEditingProduct(undefined);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              New Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Name
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Category
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Price
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      onClick={() => handleSort('expirationDate')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Expiration Date
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      onClick={() => handleSort('stock')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Stock
                      <ArrowUpDown size={16} />
                    </button>
                  </th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`border-b hover:bg-gray-50`}
                  >
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className={`px-4 py-2 ${product.stock === 0 ? 'line-through' : ''}`}>
                      {product.name}
                    </td>
                    <td className={`px-4 py-2 ${product.stock === 0 ? 'line-through' : ''}`}>
                      {product.category}
                    </td>
                    <td className={`px-4 py-2 ${product.stock === 0 ? 'line-through' : ''}`}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td className={`px-4 py-2 ${getExpirationColor(product.expirationDate)}`}>
                      {formatDate(product.expirationDate || '') || 'N/A'}
                    </td>
                    <td className={`px-4 py-2 ${getStockColor(product.stock)}`}>
                      {product.stock}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          aria-label="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          aria-label="Delete"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>

        <Metrics metrics={metrics} />

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
          onSave={handleSave}
          product={editingProduct}
          categories={categories}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;