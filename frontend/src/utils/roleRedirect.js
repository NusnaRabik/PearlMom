// frontend/src/utils/roleRedirect.js

/**
 * Role-based redirect utilities
 */

import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

/**
 * Get dashboard route based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard route
 */
export const getDashboardRoute = (role) => {
  switch (role) {
    case ROLES.MOTHER:
      return ROUTES.MOTHER.DASHBOARD;
    case ROLES.PROVIDER:
      return ROUTES.PROVIDER.DASHBOARD;
    case ROLES.ADMIN:
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.PUBLIC.LANDING;
  }
};

/**
 * Get the appropriate redirect path after login
 * @param {string} role - User role
 * @param {string} intendedPath - Path user was trying to access
 * @returns {string} Redirect path
 */
export const getLoginRedirect = (role, intendedPath = null) => {
  // If user was trying to access a specific page, check if they have permission
  if (intendedPath) {
    const rolePrefix = getRolePrefix(role);
    if (intendedPath.startsWith(rolePrefix)) {
      return intendedPath;
    }
  }
  
  // Otherwise redirect to dashboard
  return getDashboardRoute(role);
};

/**
 * Get role prefix for URL
 * @param {string} role - User role
 * @returns {string} URL prefix
 */
export const getRolePrefix = (role) => {
  switch (role) {
    case ROLES.MOTHER:
      return '/mother';
    case ROLES.PROVIDER:
      return '/provider';
    case ROLES.ADMIN:
      return '/admin';
    default:
      return '';
  }
};

/**
 * Check if user can access a route
 * @param {string} role - User role
 * @param {string} path - Route path
 * @returns {boolean} Access granted
 */
export const canAccessRoute = (role, path) => {
  const rolePrefix = getRolePrefix(role);
  
  // Public routes are accessible to all
  const publicPaths = ['/', '/login', '/register', '/help', '/forgot-password'];
  if (publicPaths.includes(path)) return true;
  
  // Role-specific routes
  return path.startsWith(rolePrefix);
};

/**
 * Get role display name
 * @param {string} role - User role
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role) => {
  const names = {
    [ROLES.MOTHER]: 'Mother',
    [ROLES.PROVIDER]: 'Healthcare Provider',
    [ROLES.ADMIN]: 'Administrator'
  };
  return names[role] || 'User';
};

/**
 * Get role icon name for lucide-react
 * @param {string} role - User role
 * @returns {string} Icon name
 */
export const getRoleIconName = (role) => {
  const icons = {
    [ROLES.MOTHER]: 'User',
    [ROLES.PROVIDER]: 'Briefcase',
    [ROLES.ADMIN]: 'Shield'
  };
  return icons[role] || 'User';
};

/**
 * Get role color theme
 * @param {string} role - User role
 * @returns {Object} Color theme
 */
export const getRoleTheme = (role) => {
  const themes = {
    [ROLES.MOTHER]: {
      primary: 'pink',
      secondary: 'rose',
      gradient: 'from-pink-500 to-rose-500',
      light: 'pink-50',
      text: 'pink-600',
      hover: 'pink-700'
    },
    [ROLES.PROVIDER]: {
      primary: 'pink',
      secondary: 'rose',
      gradient: 'from-pink-600 to-rose-600',
      light: 'pink-50',
      text: 'pink-600',
      hover: 'pink-700'
    },
    [ROLES.ADMIN]: {
      primary: 'pink',
      secondary: 'rose',
      gradient: 'from-pink-600 to-rose-700',
      light: 'pink-50',
      text: 'pink-600',
      hover: 'pink-700'
    }
  };
  return themes[role] || themes[ROLES.MOTHER];
};

/**
 * Get sidebar navigation items for role
 * @param {string} role - User role
 * @returns {Array} Navigation items
 */
export const getSidebarNavigation = (role) => {
  const { MOTHER_NAVIGATION, PROVIDER_NAVIGATION, ADMIN_NAVIGATION } = require('../constants/routes');
  
  switch (role) {
    case ROLES.MOTHER:
      return MOTHER_NAVIGATION;
    case ROLES.PROVIDER:
      return PROVIDER_NAVIGATION;
    case ROLES.ADMIN:
      return ADMIN_NAVIGATION;
    default:
      return [];
  }
};

/**
 * Get page title based on route and role
 * @param {string} pathname - Current path
 * @returns {string} Page title
 */
export const getPageTitle = (pathname) => {
  const { ROUTE_TITLES } = require('../constants/routes');
  
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }
  
  return 'PearlMom';
};

/**
 * Handle role-based navigation
 * @param {string} role - User role
 * @param {Function} navigate - React Router navigate function
 * @param {string} path - Optional specific path
 */
export const navigateByRole = (role, navigate, path = null) => {
  if (path) {
    navigate(path);
  } else {
    navigate(getDashboardRoute(role));
  }
};