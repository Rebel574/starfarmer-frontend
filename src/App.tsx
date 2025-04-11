import { useState, useEffect } from 'react';
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Plane as Plant, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import LanguageSelector from './components/LanguageSelector';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';
import Footer from './components/Footer';
import './i18n';
import { fetchCurrentUser } from './api';

// --- Route Protection Components ---
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
  const [showUserInfo, setShowUserInfo] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const googleClientId = import.meta.env.VITE_GMAIL_CLIENT_ID;

  if (!googleClientId) {
    console.error("ERROR: VITE_GMAIL_CLIENT_ID environment variable not set!");
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    fetchCurrentUser()
      .then((res) => {
        const user = res?.data?.data?.user;
        if (user) {
          setAuthStateFromGoogle(user, token);
        } else {
          console.error('User data missing in response', res?.data);
          localStorage.removeItem('token');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch current user', err);
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [setAuthStateFromGoogle]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link to="/" className="flex items-center flex-shrink-0" onClick={closeMobileMenu}>
                  <Plant className="h-8 w-8 text-green-600" />
                  <span className="ml-2 text-xl font-bold text-green-600">Star Farmer</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                  <Link to="/products" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">{t('nav.products')}</Link>
                  <Link to="/cart" className="text-gray-700 hover:text-green-600 relative p-1 rounded-full">
                    <span className="sr-only">View Cart</span>
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartItems.length}</span>
                    )}
                  </Link>

                  {isAuthenticated ? (
                    <div className="relative">
                      <button
                        className="flex items-center text-gray-700 hover:text-green-600 p-1 rounded-full"
                        onMouseEnter={() => setShowUserInfo(true)}
                        onMouseLeave={() => setShowUserInfo(false)}
                        aria-label="User Menu"
                      >
                        <User className="h-6 w-6" />
                      </button>
                      {showUserInfo && (
                        <div
                          className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg py-2 px-4 z-50"
                          onMouseEnter={() => setShowUserInfo(true)}
                          onMouseLeave={() => setShowUserInfo(false)}
                        >
                          <div className="border-b pb-2 mb-2">
                            <p className="font-semibold text-sm">{user?.name}</p>
                            <p className="text-xs text-gray-600">{user?.email}</p>
                          </div>
                          <button
                            onClick={() => { logout(); setShowUserInfo(false); }}
                            className="flex items-center text-red-600 hover:text-red-700 text-sm w-full text-left px-1 py-1"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to="/auth" className="text-gray-700 hover:text-green-600 p-1 rounded-full">
                      <User className="h-6 w-6" />
                    </Link>
                  )}

                  {isAdmin && (
                    <Link to="/admin" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">{t('nav.admin')}</Link>
                  )}

                  <LanguageSelector />
                </div>

                <div className="md:hidden flex items-center">
                  <Link to="/cart" className="text-gray-700 hover:text-green-600 relative p-1 rounded-full mr-2" onClick={closeMobileMenu}>
                    <ShoppingCart className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartItems.length}</span>
                    )}
                  </Link>

                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>

            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`} id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/products" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500">
                  {t('nav.products')}
                </Link>

                {isAuthenticated ? (
                  <div className="border-t border-gray-200 pt-4 mt-3 pb-3">
                    <div className="px-2 space-y-1">
                      <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500">
                          {t('nav.admin')}
                        </Link>
                      )}
                      <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-white hover:bg-red-500">
                        <div className="flex items-center">
                          <LogOut className="h-5 w-5 mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-green-500">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Login / Sign Up
                    </div>
                  </Link>
                )}

                <div className="px-3 py-2">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
