import  { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminProductForm from './AdminProductForm';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../api';

interface TranslatedField {
  en: string;
  mr: string;
  _id?: string;
}

interface Product {
  _id?: string;
  name: TranslatedField;
  price: number;
  discountedPrice: number;  // Changed to just number
  category: string;
  image: string;
  description: TranslatedField;
  benefits: TranslatedField[];
  createdAt?: string;
}

export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ search, sortBy, sortOrder, page, limit: 5 });
      setProducts(res?.data?.data?.products || []);
      setTotalPages(res?.data?.data?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalPages(1);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [search, sortBy, sortOrder, page]);

  const handleSubmit = async (productDataFromForm: Product) => {
    try {
      if (editingProduct && editingProduct._id) {
        await updateProduct(editingProduct._id, productDataFromForm);
      } else {
        await createProduct(productDataFromForm);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts(); // ✅ always refetch fresh list
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (confirm(`Are you sure you want to delete this product (${id})?`)) {
      try {
        await deleteProduct(id);
        fetchProducts(); // ✅ after delete, refetch
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const currentLang = i18n.language === 'mr' ? 'mr' : 'en';

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {editingProduct ? t('admin.products.edit') : t('admin.products.addNew')}
        </h2>
        <AdminProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('admin.products.title')}</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('admin.products.addNew')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={t('admin.products.search') || 'Search...'}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="createdAt">{t('admin.products.sort.newest')}</option>
          <option value="price">{t('admin.products.sort.price')}</option>
          <option value="name.en">{t('admin.products.sort.name')} (EN)</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as 'asc' | 'desc');
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.fields.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.fields.category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.fields.price')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.fields.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name?.[currentLang] || product.name?.en || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(`products.categories.${product.category}`, { defaultValue: product.category })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{product.discountedPrice || product.price}
                    {product.discountedPrice && product.discountedPrice < product.price && (
                      <span className="text-sm text-gray-400 line-through ml-2">₹{product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  {t('admin.products.noProducts')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}