import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

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

  const checkAuthStatus = async () => {
    try {
      const storedToken = localStorage.getItem('pearlmom_token');
      
      if (storedToken) {
        try {
          const result = await authService.getCurrentUser();
          
          if (result.success && result.data?.user) {
            const backendUser = result.data.user;
            const mappedUser = {
              id: backendUser.user_id,
              fullName: backendUser.name,
              email: backendUser.email,
              mobile: backendUser.phone_no,
              role: backendUser.role,
              avatar: backendUser.profile_picture_url || null,
              profile_completed: backendUser.profile_completed,
              mother_id: backendUser.mother_profile?.mother_id,
              mother_code: backendUser.mother_profile?.mother_code,
              midwife_id: backendUser.midwife_profile?.midwife_id,
              employee_id: backendUser.midwife_profile?.employee_id
            };
            
            setUser(mappedUser);
            setIsAuthenticated(true);
            localStorage.setItem('pearlmom_user', JSON.stringify(mappedUser));

            // Set popup flag based on profile status
            if (mappedUser.role === 'mother' && !mappedUser.profile_completed) {
              localStorage.setItem('pearlmom_new_registration', 'true');
            } else {
              localStorage.removeItem('pearlmom_new_registration');
            }
          } else {
            logout();
          }
        } catch (err) {
          console.error('Token validation failed');
          logout();
        }
      }
    } catch (err) {
      console.error('Auth check failed');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Check if logging in with fullName or email
      let result;
      if (credentials.fullName) {
        // Use login-by-name endpoint for mother login
        result = await authService.loginByName(
          credentials.fullName,
          credentials.password,
          credentials.role
        );
      } else {
        // Use regular login for email
        result = await authService.login(
          credentials.email,
          credentials.password,
          credentials.role
        );
      }

      console.log('Login result:', result);

      if (result.success && result.data) {
        const backendUser = result.data.user;
        const token = result.data.accessToken || result.data.token;

        // FIX: Handle both data structures (root level or nested in mother_profile)
        const mappedUser = {
          id: backendUser.user_id,
          fullName: backendUser.name || backendUser.full_name,
          email: backendUser.email,
          mobile: backendUser.phone_no,
          role: backendUser.role,
          avatar: backendUser.profile_picture_url || null,
          profile_completed: backendUser.profile_completed || false,
          // Check both root level and mother_profile for mother data
          mother_id: backendUser.mother_id || backendUser.mother_profile?.mother_id,
          mother_code: backendUser.mother_code || backendUser.mother_profile?.mother_code,
          pregnancy_status: backendUser.pregnancy_status || backendUser.mother_profile?.pregnancy_status,
          expected_delivery_date: backendUser.expected_delivery_date || backendUser.mother_profile?.expected_delivery_date,
          blood_group: backendUser.blood_group || backendUser.mother_profile?.blood_group,
          // For midwife data
          midwife_id: backendUser.midwife_id || backendUser.midwife_profile?.midwife_id,
          employee_id: backendUser.employee_id || backendUser.midwife_profile?.employee_id,
          assigned_area: backendUser.assigned_area || backendUser.midwife_profile?.assigned_area
        };

        localStorage.setItem('pearlmom_token', token);
        localStorage.setItem('pearlmom_user', JSON.stringify(mappedUser));

        // Set popup flag based on profile status
        if (mappedUser.role === 'mother' && !mappedUser.profile_completed) {
          localStorage.setItem('pearlmom_new_registration', 'true');
        } else {
          localStorage.removeItem('pearlmom_new_registration');
        }

        setUser(mappedUser);
        setIsAuthenticated(true);

        return { success: true, role: mappedUser.role };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'An error occurred during login'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Prepare registration data
      const registrationData = {
        fullName: userData.fullName,
        mobile: userData.mobile,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'mother'
      };

      console.log('Registering with data:', registrationData);
      const result = await authService.register(registrationData);
      console.log('Registration result:', result);

      if (result.success && result.data) {
        const backendUser = result.data.user;
        const token = result.data.accessToken || result.data.token;

        const mappedUser = {
          id: backendUser.user_id || backendUser.id,
          fullName: backendUser.name || backendUser.fullName,
          email: backendUser.email,
          mobile: backendUser.phone_no || backendUser.mobile,
          role: backendUser.role,
          avatar: null,
          profile_completed: backendUser.profile_completed || false
        };

        if (token) {
          localStorage.setItem('pearlmom_token', token);
        }
        localStorage.setItem('pearlmom_user', JSON.stringify(mappedUser));

        // Always set popup flag for new mother registrations
        if (mappedUser.role === 'mother') {
          localStorage.setItem('pearlmom_new_registration', 'true');
        } else if (mappedUser.role === 'midwife' || mappedUser.role === 'doctor') {
          localStorage.setItem('pearlmom_provider_new_registration', 'true');
        }

        setUser(mappedUser);
        setIsAuthenticated(true);

        return { success: true, role: mappedUser.role };
      } else {
        return { 
          success: false, 
          message: result.message || result.error || 'Registration failed' 
        };
      }
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          'An error occurred during registration';
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
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
      case 'midwife':
      case 'doctor': return '/provider/dashboard';
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

export default AuthContext;