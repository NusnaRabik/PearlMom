// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('pearlmom_user');
      const storedToken = localStorage.getItem('pearlmom_token');
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await mockLoginAPI(credentials);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          fullName: response.user.fullName,
          email: response.user.email,
          mobile: response.user.mobile,
          role: response.user.role,
          avatar: response.user.avatar || null
        };
        
        localStorage.setItem('pearlmom_user', JSON.stringify(userData));
        localStorage.setItem('pearlmom_token', response.token);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, role: userData.role };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await mockRegisterAPI(userData);

      if (response.success) {
        // Auto-login after successful registration
        const role = userData.role || userData.joinAs?.toLowerCase() || 'mother';
        const userToStore = {
          id: response.userId || `MTH-${Date.now()}`,
          fullName: userData.fullName || 'New User',
          email: userData.email || '',
          mobile: userData.mobile || userData.phone || '',
          role: role,
          avatar: null
        };

        const token = 'mock-jwt-token-' + Date.now();

        localStorage.setItem('pearlmom_user', JSON.stringify(userToStore));
        localStorage.setItem('pearlmom_token', token);

        setUser(userToStore);
        setIsAuthenticated(true);

        return { success: true, role: userToStore.role };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pearlmom_user');
    localStorage.removeItem('pearlmom_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('pearlmom_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'mother': return '/mother/dashboard';
      case 'provider': return '/provider/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    getDashboardRoute,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API
const mockLoginAPI = (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const demoUsers = {
        'mother@example.com': { id: 'MTH-2024-001', fullName: 'Elena Richardson', email: 'mother@example.com', mobile: '+94 77 123 4567', role: 'mother', avatar: null },
        'provider@example.com': { id: 'PM-9942-MED', fullName: 'Dr. Sarah Jenkins', email: 'provider@example.com', mobile: '+1 (555) 012-3456', role: 'provider', avatar: null },
        'admin@example.com': { id: 'PM-ADMIN-8829', fullName: 'Dr. Sarah Jenkins', email: 'admin@example.com', mobile: '+1 (555) 234-8901', role: 'admin', avatar: null }
      };
      const user = demoUsers[credentials.email];
      if (user && credentials.password === 'password') {
        resolve({ success: true, user: user, token: 'mock-jwt-token-' + Date.now() });
      } else {
        resolve({ success: false, message: 'Invalid email or password' });
      }
    }, 1000);
  });
};

const mockRegisterAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Registration successful', userId: 'MTH-' + Date.now() });
    }, 1500);
  });
};

export default AuthContext;