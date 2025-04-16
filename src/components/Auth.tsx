import React, { useState } from 'react'; // Added useEffect for potential future use, kept React import standard
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, /* ToggleLeft as Google, */ RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { resendVerification, googleLogin } from '../api'; // Assuming these API functions handle fetch/axios and might throw structured errors
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

// Define a type for expected backend error responses for better type checking
interface ApiErrorResponse {
  message: string;
  // Add other potential fields if your backend sends them
}

// Type guard to check if an object conforms to ApiErrorResponse
function isApiErrorResponse(obj: unknown): obj is ApiErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    typeof (obj as ApiErrorResponse).message === 'string'
  );
}

// Type guard to check for Axios-like error structure
interface AxiosError {
  response?: {
    data?: unknown; // Use unknown for data initially
  };
  message: string; // Axios errors also have a message property
}

function isAxiosError(error: unknown): error is AxiosError {
    return typeof error === 'object' && error !== null && 'message' in error && typeof (error as AxiosError).message === 'string';
    // We check for response.data inside the catch block where we use this guard
}


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register, setAuthStateFromGoogle } = useAuthStore();

  // Helper function to extract error message
 // Helper function to extract error message
  const getErrorMessage = (err: unknown, defaultMessage: string): string => {
    // 1. Check for Axios-like error with structured data.message
    if (isAxiosError(err) && err.response?.data && isApiErrorResponse(err.response.data)) {
        return err.response.data.message;
    }
    // 2. Check if error itself is an API error response (e.g., custom error thrown)
    if (isApiErrorResponse(err)) {
        return err.message;
    }
    // 3. Check for standard Error object message
    if (err instanceof Error) {
      // Optional: Try parsing if message looks like JSON (less common)
      try {
        const parsed = JSON.parse(err.message);
        if (isApiErrorResponse(parsed)) {
          return parsed.message;
        }
      } catch { 
        // Ignore parsing error, fall through to use raw message
      }
      return err.message; // Use the standard error message
    }
    // 4. Fallback
    return defaultMessage;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    setShowResendVerification(false); // Reset this state on new submission

    try {
      if (isLogin) {
        await login(email, password); // Assume login action throws structured error on failure
        const isAdmin = useAuthStore.getState().isAdmin;
        navigate(isAdmin ? '/admin' : '/');
      } else {
        await register(name, email, password); // Assume register action throws structured error on failure
        setSuccessMessage('Registration successful! Please check your email for verification. Check your spam folder if you don\'t see it in your inbox.');
        setName('');
        setEmail('');
        setPassword('');
        // Switch to login form after successful registration
        setIsLogin(true);
      }
    } catch (err: unknown) { // Catch as unknown
      const defaultMsg = isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.';
      const errorMessage = getErrorMessage(err, defaultMsg); // Use helper to extract message
      setError(errorMessage);
      console.error("Auth Error (handleSubmit):", err); // Log the original error for debugging

      // Show resend verification link ONLY if registration failed with a message containing 'verify'
      if (!isLogin && errorMessage.toLowerCase().includes('verify')) {
        setShowResendVerification(true);
        setResendEmail(email); // Keep the email for the resend function
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      // Assuming resendVerification API function throws structured error on failure
      await resendVerification(resendEmail);
      setSuccessMessage('Verification email has been resent. Please check your inbox and spam folder.');
      setShowResendVerification(false);
    } catch (err: unknown) { // Catch as unknown
      const errorMessage = getErrorMessage(err, 'Failed to resend verification email'); // Use helper
      setError(errorMessage);
      console.error("Auth Error (handleResendVerification):", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      // Using original fetch call - handles response directly
      const response = await fetch('https://starfarmer-backend.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data: unknown = await response.json(); // Parse JSON but treat as unknown initially

      if (response.ok && isApiErrorResponse(data)) { // Check response.ok AND if data has a message field
        setSuccessMessage(data.message || 'If an account exists with this email, you will receive password reset instructions.');
        setEmail(''); // Clear email field on success
        setShowForgotPassword(false); // Hide the form on success
        setIsLogin(true); // Go back to login view
      } else if (!response.ok && isApiErrorResponse(data)) { // Check !response.ok AND if data has a message field
         setError(data.message); // Use the specific message from backend
      } else {
         // Fallback if response is not ok and data doesn't have the expected message field
         setError('Failed to process request. Server returned an unexpected response.');
         console.error("Forgot Password API Response Error:", data);
      }
    } catch (err: unknown) { // Catch network/fetch errors
      console.error("Forgot Password Network/Fetch Error:", err);
      const errorMessage = getErrorMessage(err, 'Failed to connect to the server. Please try again.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  // --- NEW Google Sign-In Handlers using @react-oauth/google ---
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');
    setSuccessMessage(''); // Clear previous messages
    setIsLoading(true);
    console.log('Google Sign-In Success. Response:', credentialResponse);

    if (credentialResponse.credential) {
      const idToken = credentialResponse.credential;
      try {
        // Assume googleLogin API function throws structured error on failure
        const result = await googleLogin(idToken); // This should contain user and appToken on success

        // Assuming successful backend response structure like: { data: { user: {...}, token: '...' } }
        // Add checks for this structure if needed
        const user = result.data.data.user;
        const appToken = result.data.token;

        setAuthStateFromGoogle(user, appToken);

        navigate(user.role === 'admin' ? '/admin' : '/');

      } catch (err: unknown) { // Catch as unknown
        console.error("Backend Google Login Error:", err); // Log original error
        const errorMessage = getErrorMessage(err, 'Google sign in failed. Please try again later.'); // Use helper
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Google Sign-In failed: No credential received from Google.");
      setError('Google Sign-In failed: No credential received.');
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed (library error)');
    setError('Google Sign-In process failed. Please try again.');
    setIsLoading(false);
  };
  // --- End of NEW Google Sign-In Handlers ---


  // --- JSX Structure (Remains Unchanged) ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        {/* Header and messages... (Unchanged) */}
        <div>
         <h2 className="text-center text-3xl font-bold text-gray-900">
            {showForgotPassword ? 'Reset Password' : isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          {/* Error display remains the same, now shows more specific messages */}
          {error && ( <p className="mt-2 text-center text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p> )}
          {successMessage && ( <p className="mt-2 text-center text-sm text-green-600 bg-green-100 p-2 rounded">{successMessage}</p> )}
        </div>

        {/* Conditional Rendering: Resend Verification / Forgot Password / Main Form (Unchanged) */}
        {showResendVerification ? (
          <div className="text-center">{/* ... Resend Verification UI ... (Unchanged) */}
             <p className="text-gray-600 mb-4">Your email address requires verification.</p>
             <button onClick={handleResendVerification} disabled={isLoading} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> : <><RefreshCw className="h-5 w-5 mr-2" /> Resend Verification Email</>}
             </button>
             <button type="button" onClick={() => { setShowResendVerification(false); setError(''); }} className="mt-4 text-sm text-gray-600 hover:text-gray-800">Back to login</button>
          </div>
        ) : showForgotPassword ? (
           <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
             {/* ... Forgot Password Form ... (Unchanged) */}
              <div><label htmlFor="email-forgot" className="sr-only">Email address</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input id="email-forgot" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Email address" /></div></div>
              <div><button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">{isLoading ? <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> : 'Send Reset Link'}</button></div>
              <div className="text-center"><button type="button" onClick={() => { setShowForgotPassword(false); setError(''); setSuccessMessage(''); }} className="text-sm text-green-600 hover:text-green-500">Back to login</button></div>
           </form>
        ) : (
          // --- Main Login/Register Form ---
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* ... Form Inputs ... (Unchanged) */}
             <div className="rounded-md shadow-sm space-y-4">
              {!isLogin && ( <div><label htmlFor="name" className="sr-only">Full Name</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div><input id="name" name="name" type="text" required={!isLogin} value={name} onChange={(e) => setName(e.target.value)} className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Full Name" /></div></div> )}
              <div><label htmlFor="email-main" className="sr-only">Email address</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div><input id="email-main" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Email address" /></div></div>
              <div><label htmlFor="password" className="sr-only">Password</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div><input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Password" /></div></div>
            </div>
            {/* ... Forgot Password Link ... (Unchanged) */}
             {isLogin && ( <div className="flex items-center justify-end"><button type="button" onClick={() => { setShowForgotPassword(true); setEmail(email); /* Carry over email */ setError(''); setSuccessMessage(''); }} className="text-sm text-green-600 hover:text-green-500">Forgot your password?</button></div> )}
            {/* ... Submit Button ... (Unchanged) */}
             <div><button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div> : (isLogin ? 'Sign in' : 'Sign up')}</button></div>
            {/* ... Separator ... (Unchanged) */}
             <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>

            {/* --- Social Logins Section - (Unchanged Google Button usage) --- */}
            <div className="flex justify-center items-center pt-2">
               <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
                 <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    // Consider adding theme, shape, etc. customizations if needed
                  />
               </div>
            </div>
             {/* ... Toggle Login/Register Link ... (Unchanged) */}
             <div className="text-center"><button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMessage(''); setShowResendVerification(false); setShowForgotPassword(false); /* Consider clearing form fields on toggle? */ }} className="text-sm text-green-600 hover:text-green-500">{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}