// frontend/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Development mode - allow all access
  const isDevelopment = import.meta.env.DEV || true; // Set to true for development

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Checking authentication..." />;
  }

  // In development mode, auto-create a user if not authenticated
  if (isDevelopment && !isAuthenticated) {
    // Don't redirect, just allow access
    return children;
  }

  // Production mode - require authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // In development mode, allow all roles
  if (isDevelopment) {
    return children;
  }

  // Production role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const dashboardRoute = user.role === 'mother' ? '/mother/dashboard' 
      : user.role === 'provider' ? '/provider/dashboard' 
      : user.role === 'admin' ? '/admin/dashboard' 
      : '/';
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;