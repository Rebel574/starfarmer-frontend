import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ShoppingCart, Search, Plus, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../api';

// Interface remains the same
interface Product {
  _id: string;
  name: { en: string; mr: string; _id?: string };
  description: { en: string; mr: string; _id?: string };
  benefits: { en: string; mr: string; _id?: string }[];
  price: number;
  discountedPrice: number;
  image: string;
  category: string;
  createdAt?: string;
  __v?: number;
}

export default function ProductList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { isAdmin, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect and fetchProducts remain the same
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      // Added optional chaining for safety
      const productsData = response?.data?.data?.products;
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        setError('');
      } else {
        console.error("Products data is not an array:", productsData);
        setProducts([]);
        setError(t('products.errorParse')); // Use translation
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(t('products.errorLoad')); // Use translation
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // handleAddToCart remains the same
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent navigating to product details when clicking button
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    addItem({ ...product, price: product.discountedPrice }); // Use discounted price
  };

  // categories and filteredProducts logic remains the same
  const categories = ['all', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const currentLang = i18n.language as 'en' | 'mr';
    // Robust check for name/description existence and language fallback
    const productName = product.name?.[currentLang] || product.name?.en || '';
    const productDescription = product.description?.[currentLang] || product.description?.en || '';

    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          productDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading state remains the same
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('products.loading')}</p>
      </div>
    );
  }

  // Error state remains the same
  if (error) {
    return (
      <div className="text-center text-red-600 py-20">
        <p>{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('products.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"> {/* Adjusted padding */}
      {/* Filter and Search Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('products.title')}</h2>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.products.addNew')}
            </button>
          )}
        </div>

        {/* Search and Category Dropdown */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Search Input */}
          <div className="relative flex-grow"> {/* Use flex-grow to take available space */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm" // Reduced text size slightly
            />
          </div>

          {/* Category Select */}
          <div className="w-full md:w-auto md:min-w-[180px]"> {/* Allow shrinking but set a min-width */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg focus:ring-green-500 focus:border-green-500 text-sm" // Reduced text size slightly
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {/* Capitalize first letter for display */}
                  {t(`products.categories.${category}`, category.charAt(0).toUpperCase() + category.slice(1))}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
        </div>
      ) : (
        // Responsive Grid Layout: 1 col default, 2 cols on sm, 3 cols on lg
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap */}
          {filteredProducts.map((product) => {
            const currentLang = i18n.language as 'en' | 'mr';
            const displayName = product.name?.[currentLang] || product.name?.en || t('products.noName'); // Use translation
            const displayDescription = product.description?.[currentLang] || product.description?.en || t('products.noDescription'); // Use translation

            return (
              // Add 'group' class for hover effects on children (like image scale)
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-shadow duration-200 hover:shadow-lg"
              >
                {/* Clickable Area (Image and Text Content) */}
                <div
                  className="cursor-pointer flex-grow" // Use flex-grow to push button to bottom
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {/* Image Container with Aspect Ratio */}
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={product.image || '/placeholder-image.png'} // Add a fallback placeholder
                      alt={displayName}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      // Add basic error handling for images
                      onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
                    />
                  </div>
                  {/* Text Content */}
                  <div className="p-4"> {/* Adjusted padding */}
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight"> {/* Adjusted size */}
                        {displayName}
                      </h3>
                      {/* Category Badge */}
                      <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap"> {/* Adjusted size/padding */}
                        {t(`products.categories.${product.category}`, product.category)}
                      </span>
                    </div>
                    {/* Description with Line Clamp */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3"> {/* Adjusted size & clamp */}
                      {displayDescription}
                    </p>
                  </div>
                </div>

                {/* Price and Add to Cart Button Area */}
                <div className="px-4 pb-4 mt-auto"> {/* Ensure this section is at the bottom */}
                  <div className="flex flex-wrap items-end justify-between gap-2 mb-3"> {/* Use items-end */}
                    {/* Price Details */}
                    <div>
                      <span className="text-lg md:text-xl text-gray-900 font-bold mr-2"> {/* Adjusted size */}
                        ₹{product.discountedPrice}
                      </span>
                      {product.discountedPrice < product.price && ( // Only show original price if there's a discount
                        <span className="text-sm text-gray-500 line-through mr-2">
                          ₹{product.price}
                        </span>
                      )}
                      {/* Optional: Show discount percentage or amount */}
                       {product.discountedPrice < product.price && (
                         <span className="text-green-600 text-xs font-medium">
                           ({Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% off)
                         </span>
                       )}
                    </div>
                  </div>
                  {/* Add to Cart Button */}
                  <button
                      onClick={(e) => handleAddToCart(e, product)}
                      // Make button full width on small screens for easier tapping
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      {isAuthenticated ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {t('products.addToCart')}
                        </>
                      ) : (
                        <>
                           {/* Suggest login instead of showing cart icon */}
                          <LogIn className="h-4 w-4 mr-2" />
                           {t('products.loginToAdd')} {/* Changed text */}
                        </>
                      )}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}