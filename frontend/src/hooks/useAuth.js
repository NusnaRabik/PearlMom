// frontend/src/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for authentication operations
 * Uses the AuthContext internally
 */
export const useAuthHook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login handler - DON'T navigate here, just return result
  const handleLogin = useCallback(async (credentials, loginFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginFn(credentials);
      console.log('HandleLogin result:', result);
      
      // Just return the result, don't navigate
      return result;
    } catch (err) {
      console.error('Login error in hook:', err);
      setError('An unexpected error occurred');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register handler
  // frontend/src/hooks/useAuth.js - Update the handleRegister function

const handleRegister = useCallback(async (userData, registerFn) => {
  setLoading(true);
  setError(null);
  
  try {
    console.log('Register hook received:', userData);
    const result = await registerFn(userData);
    console.log('Register hook result:', result);
    
    // Just return the result, let RegisterPage handle navigation
    return result;
  } catch (err) {
    console.error('Registration error in hook:', err);
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error ||
                        err.message || 
                        'An unexpected error occurred';
    setError(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoading(false);
  }
}, []);

  // Logout handler
  const handleLogout = useCallback((logoutFn) => {
    logoutFn();
    navigate('/');
  }, [navigate]);

  // Check password strength
  const checkPasswordStrength = useCallback((password) => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strengths = {
      0: { label: 'Very Weak', color: '#ef4444', width: 'w-1/6', textColor: 'text-red-600' },
      1: { label: 'Weak', color: '#f97316', width: 'w-2/6', textColor: 'text-orange-600' },
      2: { label: 'Fair', color: '#eab308', width: 'w-3/6', textColor: 'text-yellow-600' },
      3: { label: 'Good', color: '#3b82f6', width: 'w-4/6', textColor: 'text-blue-600' },
      4: { label: 'Strong', color: '#22c55e', width: 'w-5/6', textColor: 'text-green-600' },
      5: { label: 'Very Strong', color: '#16a34a', width: 'w-full', textColor: 'text-green-700' }
    };
    
    return strengths[Math.min(score, 5)];
  }, []);

  // Validate email format
  const validateEmail = useCallback((email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }, []);

  // Validate mobile number
  const validateMobile = useCallback((mobile) => {
    const re = /^\+?[\d\s-]{10,15}$/;
    return re.test(mobile);
  }, []);

  return {
    loading,
    error,
    setError,
    handleLogin,
    handleRegister,
    handleLogout,
    checkPasswordStrength,
    validateEmail,
    validateMobile
  };
};

export default useAuthHook;