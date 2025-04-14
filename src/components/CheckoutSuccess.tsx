import  { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios'; // Keep for error type checking
import { CheckCircle, Loader, AlertTriangle, Clock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

// --- Import NEW API function ---
import { getOrderStatusByMtid } from '../api/index'; // Adjust path

const POLLING_INTERVAL = 3000; // Poll every 3 seconds
const POLLING_TIMEOUT = 60000; // Stop polling after 60 seconds

export default function CheckoutSuccess(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { clearCart } = useCartStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timedout'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  // --- REMOVED unused merchantTransactionId state ---
  // const [merchantTransactionId, setMerchantTransactionId] = useState<string | null>(null);

  const intervalIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);

  const cleanupTimers = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mtid = urlParams.get('mtid'); // Get mtid added by our backend

    if (!mtid) {
      console.error('No Merchant Transaction ID (mtid) found in URL');
      setErrorMessage(t('checkoutSuccess.errors.missingMtid'));
      setStatus('error');
      return;
    }
    // --- REMOVED unused setMerchantTransactionId call ---
    // setMerchantTransactionId(mtid);
    setStatus('loading'); // Start in loading state

    // checkOrderStatus uses the 'mtid' variable from the useEffect closure
    const checkOrderStatus = async (currentMtid: string) => {
      try {
        const response = await getOrderStatusByMtid(currentMtid);
        const { orderId: fetchedOrderId, paymentStatus } = response.data;

        console.log(`Polling Status for MTID ${currentMtid}:`, paymentStatus);

        if (paymentStatus === 'paid') {
          console.log("Payment confirmed as 'paid'. Order ID:", fetchedOrderId);
          setOrderId(fetchedOrderId);
          setStatus('success');
          cleanupTimers();
          console.log("Clearing cart...");
          clearCart();
        } else if (paymentStatus === 'failed') {
          console.error("Payment status confirmed as 'failed'.");
          setErrorMessage(t('checkoutSuccess.errors.paymentFailed'));
          setStatus('error');
          cleanupTimers();
        } else {
          setStatus('loading'); // Continue polling
        }
      } catch (err: unknown) {
        console.error('Error polling order status:', err);
        let message = t('checkoutSuccess.errors.pollingError');
        if (err instanceof AxiosError) {
          if (err.response?.status === 404) {
            message = t('checkoutSuccess.errors.transactionNotFound');
            setStatus('error');
            cleanupTimers();
          } else {
            message = err.response?.data?.message || err.message || message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
        setErrorMessage(message);
      }
    };

    // Start polling using the local 'mtid' variable
    checkOrderStatus(mtid);
    intervalIdRef.current = setInterval(() => checkOrderStatus(mtid), POLLING_INTERVAL);

    // Set polling timeout
    timeoutIdRef.current = setTimeout(() => {
        // Check current status via state, not ref, is fine here
        if (status === 'loading') {
            console.warn("Polling timed out.");
            setErrorMessage(t('checkoutSuccess.errors.timeout'));
            setStatus('timedout');
            cleanupTimers();
        }
    }, POLLING_TIMEOUT);


    // Cleanup on unmount
    return () => {
      cleanupTimers();
    };
  // status IS needed in dependency array IF the timeout logic depends on it
  // to avoid running timeout logic unnecessarily if status changed before timeout fired.
  // location.search triggers refetch/re-poll if URL changes.
  }, [location.search, clearCart, t, status]);


  // Redirect effect (remains the same)
  useEffect(() => {
    let redirectTimerId: number | null = null;
    if (status === 'success' && orderId) {
      console.log(`Redirecting to /order-success/${orderId} in 3 seconds...`);
      redirectTimerId = setTimeout(() => {
        navigate(`/order-success/${orderId}`, { replace: true });
      }, 3000);
    }
    return () => {
      if (redirectTimerId) {
        clearTimeout(redirectTimerId);
      }
    };
  }, [status, orderId, navigate]);


  // --- Render logic remains the same based on 'status' ---

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center min-h-[300px] flex flex-col justify-center items-center">
        <Loader className="h-12 w-12 animate-spin mx-auto text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('checkoutSuccess.verifying')}</h2>
        <p className="mt-2 text-gray-600">{t('checkoutSuccess.pleaseWait')}</p>
        {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center min-h-[300px] flex flex-col justify-center items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
           <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('checkoutSuccess.errorTitle')}</h2>
        <p className="mt-2 text-gray-600">{errorMessage || t('checkoutSuccess.errors.unknown')}</p>
        <button onClick={() => navigate('/cart')} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          {t('checkoutSuccess.backToCart')}
        </button>
      </div>
    );
  }

   if (status === 'timedout') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center min-h-[300px] flex flex-col justify-center items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
           <Clock className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('checkoutSuccess.verificationTimeoutTitle')}</h2>
        <p className="mt-2 text-gray-600">{errorMessage || t('checkoutSuccess.errors.timeout')}</p>
        <p className="mt-2 text-sm text-gray-500">{t('checkoutSuccess.checkMyOrders')}</p>
        <button onClick={() => navigate('/my-orders')} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          {t('orderSuccess.viewMyOrders')}
        </button>
      </div>
    );
  }

  // Successful verification state (status === 'success')
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center min-h-[300px] flex flex-col justify-center items-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('checkoutSuccess.title')}</h2>
      <p className="mt-2 text-lg text-gray-600">{t('checkoutSuccess.paymentConfirmed')}</p>
      <p className="text-sm text-gray-500 mt-1">{t('checkoutSuccess.redirectingToOrder')}</p>
       <div className="mt-4">
         <Loader className="h-6 w-6 animate-spin mx-auto text-gray-400" />
       </div>
    </div>
  );
}