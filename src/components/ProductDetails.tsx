import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Minus, ShoppingCart , LogIn} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getProduct } from '../api';
import { Product } from '@/common/types';
import { useAuthStore } from '../store/authStore';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentLang = i18n.language as 'en' | 'mr';

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await getProduct(productId);
      const productData = response.data?.data?.product;
      if (productData && typeof productData === 'object') {
        setProduct(productData);
        setError('');
      } else {
        setError('Failed to load product details');
        setProduct(null);
      }
    } catch  {
      setError('Failed to load product details');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // const handleAddToCart = () => {
  //   if (product) {
  //     const itemToAdd = {
  //       ...product,
  //       discountedPrice: product.discountedPrice ?? product.price,
  //     };
  //     for (let i = 0; i < quantity; i++) {
  //       addItem(itemToAdd);
  //     }
  //   }
  // };
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
      e.stopPropagation(); // Prevent navigating to product details when clicking button
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      if (product) {
        const itemToAdd = {
          ...product,
          discountedPrice: product.discountedPrice ?? product.price,
        };
        for (let i = 0; i < quantity; i++) {
          addItem(itemToAdd);
        }
      }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Product not found'}</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const displayName = product.name?.[currentLang] || product.name?.en || 'No Name';
  const displayDescription = product.description?.[currentLang] || product.description?.en || 'No Description';

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountAmount = hasDiscount ? product.price - product.discountedPrice! : 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountedPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={product.image}
            alt={displayName}
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{displayName}</h1>

          {/* Price Section */}
          <div className="mb-6 space-y-1">
            {hasDiscount ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">₹{product.discountedPrice}</span>
                  <span className="line-through text-gray-500 text-sm">₹{product.price}</span>
                  <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full font-medium">
                    {discountPercent}% OFF
                  </span>
                </div>
                <div className="text-green-600 text-sm font-medium">
                  ₹{discountAmount} {t('products.youSave')}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-gray-900">₹{product.price}</div>
            )}
            <div className="text-sm text-green-600">{t('productDetails.inStock')}</div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{t('productDetails.description')}</h2>
            <p className="text-gray-600">{displayDescription}</p>
          </div>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && ( // Check benefits exist
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">{t('productDetails.benefits', 'Benefits')}</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.benefits.map((benefit, index) => {
                    const benefitText = (currentLang === 'en' || currentLang === 'mr') && benefit[currentLang]
                                        ? benefit[currentLang]
                                        : benefit.en; // Fallback to English
                    return (
                      // Use index as key since benefit objects lack a unique ID
                      <li key={index}>
                        {benefitText}
                      </li>
                    );
                  })}
                </ul>
              </div>
          )}
          {/* === End Benefits Section === */}
          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700">{t('productDetails.quantity')}:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 rounded-l-lg"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 rounded-r-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={(e) => handleAddToCart(e, product)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
           {isAuthenticated ? (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t('products.addToCart')}
              </>
            ) : (
              <>
                  {/* Suggest login instead of showing cart icon */}
                <LogIn className="h-5 w-5 mr-2" />
                  {t('products.loginToAdd')} {/* Changed text */}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
