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

  // Login handler
  const handleLogin = useCallback(async (credentials, loginFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginFn(credentials);
      
      if (result.success) {
        // Redirect based on role
        const roleRoutes = {
          mother: '/mother/dashboard',
          provider: '/provider/dashboard',
          admin: '/admin/dashboard'
        };
        
        const route = roleRoutes[result.role] || '/';
        navigate(route);
        return { success: true };
      } else {
        setError(result.message || 'Login failed');
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Register handler
  const handleRegister = useCallback(async (userData, registerFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerFn(userData);
      
      if (result.success) {
        const roleRoutes = {
          mother: '/mother/dashboard',
          provider: '/provider/dashboard',
          admin: '/admin/dashboard'
        };
        
        const route = roleRoutes[result.role] || '/login';
        setTimeout(() => navigate(route), 1500);
        return { success: true };
      } else {
        setError(result.message || 'Registration failed');
        return { success: false, message: result.message };
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
      0: { label: 'Very Weak', color: 'bg-red-500', width: 'w-1/6', textColor: 'text-red-600' },
      1: { label: 'Weak', color: 'bg-orange-500', width: 'w-2/6', textColor: 'text-orange-600' },
      2: { label: 'Fair', color: 'bg-yellow-500', width: 'w-3/6', textColor: 'text-yellow-600' },
      3: { label: 'Good', color: 'bg-blue-500', width: 'w-4/6', textColor: 'text-blue-600' },
      4: { label: 'Strong', color: 'bg-green-500', width: 'w-5/6', textColor: 'text-green-600' },
      5: { label: 'Very Strong', color: 'bg-green-600', width: 'w-full', textColor: 'text-green-700' }
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