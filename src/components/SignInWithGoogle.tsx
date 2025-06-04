"use client";

import { useState } from 'react';
import { useAuth } from '../lib/hooks/useAuth';

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </>
      ) : (
        <>
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M12 5c1.6168 0 3.1013.5978 4.2863 1.5798l3.2955-3.2955C17.4999 1.3470 14.9726 0 12 0 8.4775 0 5.3442 1.8284 3.3994 4.5722l3.8701 3.0278C8.1387 5.8889 9.9509 5 12 5z" />
            <path fill="#4285F4" d="M23.49 12.275c0-.8091-.069-1.5837-.1967-2.3325H12v4.6377h6.4871c-.2791 1.5479-1.1323 2.8614-2.4147 3.7418v3.1078h3.9088c2.2891-2.1124 3.6088-5.2173 3.6088-9.1548z" />
            <path fill="#FBBC05" d="M12 24c3.2614 0 5.9891-1.0699 7.9831-2.9l-3.9088-3.1078c-1.0842.7285-2.4701 1.1578-4.0743 1.1578-3.1313 0-5.7822-2.1124-6.7359-4.9456l-4.0414 3.1112C3.1975 21.1667 7.3057 24 12 24z" />
            <path fill="#34A853" d="M5.2641 15.1044C5.0295 14.4283 4.8913 13.7064 4.8913 12.9669c0-.7395.1382-1.4614.3728-2.1375l-4.0414-3.1112C.4262 9.1548 0 11.0214 0 12.9669c0 1.9455.4262 3.8121 1.2227 5.4487l4.0414-3.1112z" />
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  );
}
