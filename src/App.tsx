import { useState, useEffect, useRef } from 'react'; // Import useRef
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Logo from './assets/Logo.png'

import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CheckoutSuccess from './components/CheckoutSuccess';
import OrderSuccess from './components/OrderSuccess';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import LanguageSelector from './components/LanguageSelector';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import './i18n';
import { getCurrentUser } from './api';
import UserOrders from './components/UserOrders';

// footer Imports 
import PrivacyPolicy from './components/policies/PrivacyPolicy';
import TermsOfService from './components/policies/TermsOfService';
import RefundPolicy from './components/policies/RefundPolicy';
import ShippingPolicy from './components/policies/ShippingPolicy';

// --- Route Protection Components --- (Keep as they are)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};
// --- End Route Protection Components ---

function App() {
  const { t } = useTranslation();
  const cartItems = useCartStore((state) => state.items);
  const { isAdmin, isAuthenticated, user, logout, setAuthStateFromGoogle } = useAuthStore();
  const [showUserInfo, setShowUserInfo] = React.useState(false); // State to control dropdown visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Refs for the user button and the dropdown menu to detect outside clicks
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement>(null);

  const googleClientId = import.meta.env.VITE_GMAIL_CLIENT_ID;

  if (!googleClientId) {
    console.error("ERROR: VITE_GMAIL_CLIENT_ID environment variable not set!");
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- useEffect for checking auth (Keep as is) ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }
    getCurrentUser()
      .then((res) => {
        const userData = res?.data?.data?.user;
        if (userData) {
          setAuthStateFromGoogle(userData, token);
        } else {
          console.error('User data missing in response', res?.data);
          localStorage.removeItem('token');
          // logout(); // Consider if needed here
        }
      })
      .catch((err) => {
        console.error('Failed to fetch current user', err);
        localStorage.removeItem('token');
        // logout(); // Consider if needed here
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [setAuthStateFromGoogle]); // Dependency array remains the same


  // --- useEffect for handling clicks outside the user menu ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the menu is not open, do nothing
      if (!showUserInfo) return;

      // Check if the click was outside the button AND outside the dropdown
      if (
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target as Node) &&
        userMenuDropdownRef.current &&
        !userMenuDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserInfo(false); // Close the menu
      }
    };

    // Add event listener when the component mounts (and menu might be open)
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener when the component unmounts or showUserInfo changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserInfo]); // Re-run effect if showUserInfo changes (to add/remove listener correctly)


  // --- Loading State (Keep as is) ---
   if (isCheckingAuth) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <p className="text-gray-500 text-lg font-medium">Loading...</p>
       </div>
     );
   }

  // --- Main App Structure ---
  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* --- Navigation Bar --- */}
          <nav className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center flex-shrink-0" onClick={closeMobileMenu}>
                  <img
                    src={Logo}
                    alt="Star Farmer Logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                  />
                  <span className="ml-2 text-xl sm:text-2xl lg:text-3xl font-extrabold text-green-600 tracking-wide drop-shadow-sm font-sans">
                    Star <span className="text-emerald-500">Farmer</span>
                  </span>
                </Link>

                {/* Desktop Menu Links */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                  <Link to="/products" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">{t('nav.products')}</Link>
                  <Link to="/cart" className="text-gray-700 hover:text-green-600 relative p-1 rounded-full">
                    <span className="sr-only">View Cart</span>
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    )}
                  </Link>

                  {/* User Info / Login / Admin Links */}
                  {isAuthenticated ? (
                    <div className="relative">
                      {/* User Icon Button */}
                      <button
                        ref={userMenuButtonRef} // Add ref to the button
                        className="flex items-center text-gray-700 hover:text-green-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        // REMOVED: onMouseEnter={() => setShowUserInfo(true)}
                        // REMOVED: onMouseLeave={() => setShowUserInfo(false)}
                        onClick={() => setShowUserInfo(prev => !prev)} // TOGGLE visibility on click
                        aria-label="User Menu"
                        aria-haspopup="true"
                        aria-expanded={showUserInfo}
                      >
                        <User className="h-6 w-6" />
                      </button>

                      {/* User Info Dropdown */}
                      {showUserInfo && ( // Render based on state
                        <div
                          ref={userMenuDropdownRef} // Add ref to the dropdown
                          className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5"
                          // REMOVED: onMouseEnter={() => setShowUserInfo(true)}
                          // REMOVED: onMouseLeave={() => setShowUserInfo(false)}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="user-menu-button" // Consider adding id="user-menu-button" to the button
                        >
                          {/* User Details Section */}
                          <div className="border-b pb-2 mb-2 px-4">
                            <p className="font-semibold text-sm truncate" title={user?.name}>{user?.name ?? 'User'}</p>
                            <p className="text-xs text-gray-600 truncate" title={user?.email}>{user?.email ?? 'No email'}</p>
                          </div>

                          {/* My Orders Link */}
                          <Link
                              to="/my-orders"
                              onClick={() => setShowUserInfo(false)} // Close dropdown on click/navigate
                              className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-green-700 text-sm w-full text-left px-4 py-2"
                              role="menuitem"
                          >
                              <Archive className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{t('orders.myOrders')}</span>
                          </Link>

                          {/* Logout Button */}
                          <button
                            onClick={() => { logout(); setShowUserInfo(false); }} // Close dropdown on click
                            className="flex items-center text-red-600 hover:bg-gray-100 hover:text-red-700 text-sm w-full text-left px-4 py-2"
                            role="menuitem"
                          >
                            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{t('logout')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Login Link (when not authenticated)
                    <Link to="/auth" className="text-gray-700 hover:text-green-600 p-1 rounded-full" title={t('login') as string}>
                      <User className="h-6 w-6" />
                    </Link>
                  )}

                  {/* Admin Link (if applicable) */}
                  {isAdmin && (
                    <Link to="/admin" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">{t('nav.admin')}</Link>
                  )}

                  {/* Language Selector */}
                  <LanguageSelector />
                </div>

                {/* Mobile Menu Button & Cart (Keep as is) */}
                <div className="md:hidden flex items-center">
                   <Link to="/cart" className="text-gray-700 hover:text-green-600 relative p-1 rounded-full mr-2" onClick={closeMobileMenu} title={t('nav.cart') as string}>
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                       <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    )}
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                    aria-controls="mobile-menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel (Keep as is, including My Orders Link) */}
             <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`} id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/products" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500">
                  {t('nav.products')}
                </Link>

                {isAuthenticated ? (
                  <div className="border-t border-gray-200 pt-4 mt-3 pb-3">
                    <div className="px-2 space-y-1">
                      <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
                        <p className="font-semibold truncate">{user?.name ?? 'User'}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email ?? 'No email'}</p>
                      </div>
                       <Link
                        to="/my-orders"
                        onClick={closeMobileMenu} // This already closes the mobile menu panel
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500"
                      >
                        <Archive className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span>{t('orders.myOrders')}</span>
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={closeMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500">
                           <span className="ml-8">{t('nav.admin')}</span>
                        </Link>
                      )}
                      <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-white hover:bg-red-500">
                        <div className="flex items-center">
                          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span>{t('logout')}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" onClick={closeMobileMenu} className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500">
                    <User className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{t('login')} / {t('signup')}</span>
                  </Link>
                )}

                <div className="border-t border-gray-200 mt-3 pt-3 px-3 py-2">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </nav>

          {/* --- Main Content Area --- */}
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Routes (Keep as they are) */}
              <Route path="/" element={<ProductList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
              <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
              <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
            </Routes>
          </main>

          {/* --- Footer --- */}
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;