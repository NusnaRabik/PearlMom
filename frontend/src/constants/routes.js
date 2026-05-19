// frontend/src/constants/routes.js

/**
 * Application route definitions for PearlMom
 * Matches the current App.jsx routing structure
 */

export const ROUTES = {
  // Public Routes (No authentication required)
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    HELP: '/help'
  },

  // Mother Routes
  MOTHER: {
    DASHBOARD: '/mother/dashboard',
    EMCH_CARD: '/mother/emch-card',
    VACCINATION: '/mother/vaccination',
    CLINIC_LOCATOR: '/mother/clinic-locator',
    NUTRITION: '/mother/nutrition',
    SETTINGS: '/mother/settings'
  },

  // Provider Routes
  PROVIDER: {
    DASHBOARD: '/provider/dashboard',
    SETTINGS: '/provider/settings',
    MOTHERS: '/provider/mothers',
    CLINIC_VISIT: '/provider/clinic-visit',
    NUTRITION: '/provider/nutrition'
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    SETTINGS: '/admin/settings',
    USERS: '/admin/users'
  }
};

/**
 * Mother Sidebar Navigation Items
 */
export const MOTHER_NAVIGATION = [
  {
    path: ROUTES.MOTHER.DASHBOARD,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    description: 'My Health Overview'
  },
  {
    path: ROUTES.MOTHER.EMCH_CARD,
    label: 'EMCH Card',
    icon: 'Heart',
    description: 'Digital Health Record'
  },
  {
    path: ROUTES.MOTHER.VACCINATION,
    label: 'Vaccination',
    icon: 'Syringe',
    description: 'Schedule & Reminders'
  },
  {
    path: ROUTES.MOTHER.CLINIC_LOCATOR,
    label: 'Clinic Locator',
    icon: 'MapPin',
    description: 'Find Nearby Clinics'
  },
  {
    path: ROUTES.MOTHER.NUTRITION,
    label: 'Nutrition Tracker',
    icon: 'Apple',
    description: 'Diet & Wellness'
  }
];

/**
 * Provider Sidebar Navigation Items
 */
export const PROVIDER_NAVIGATION = [
  {
    path: ROUTES.PROVIDER.DASHBOARD,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    description: 'Overview & Analytics'
  },
  {
    path: ROUTES.PROVIDER.NUTRITION,
    label: 'Nutrition Program',
    icon: 'Apple',
    description: 'Thriposha Management'
  },
  {
    path: ROUTES.PROVIDER.CLINIC_VISIT,
    label: 'Clinic Visit',
    icon: 'CalendarCheck',
    description: 'Visit Management'
  },
  {
    path: ROUTES.PROVIDER.MOTHERS,
    label: 'Assigned Mothers',
    icon: 'Users',
    description: 'Patient List'
  }
];

/**
 * Admin Sidebar Navigation Items
 */
export const ADMIN_NAVIGATION = [
  {
    path: ROUTES.ADMIN.DASHBOARD,
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    description: 'System Overview'
  },
  {
    path: ROUTES.ADMIN.USERS,
    label: 'User & System',
    icon: 'Users',
    description: 'Management'
  }
];

/**
 * Bottom navigation items for all sidebars
 */
export const BOTTOM_NAVIGATION = {
  help: {
    path: ROUTES.PUBLIC.HELP,
    label: 'Help & Support',
    icon: 'HelpCircle',
    description: 'FAQs & Contact'
  },
  motherSettings: {
    path: ROUTES.MOTHER.SETTINGS,
    label: 'Settings',
    icon: 'Settings',
    description: 'Profile & Preferences'
  },
  providerSettings: {
    path: ROUTES.PROVIDER.SETTINGS,
    label: 'Settings',
    icon: 'Settings',
    description: 'Provider Settings'
  },
  adminSettings: {
    path: ROUTES.ADMIN.SETTINGS,
    label: 'Admin Settings',
    icon: 'Settings',
    description: 'Profile & Security'
  }
};

/**
 * Route titles for page headers
 */
export const ROUTE_TITLES = {
  // Public
  [ROUTES.PUBLIC.LANDING]: 'PearlMom - Digital Maternal Healthcare',
  [ROUTES.PUBLIC.LOGIN]: 'Login - PearlMom',
  [ROUTES.PUBLIC.REGISTER]: 'Register - PearlMom',
  [ROUTES.PUBLIC.HELP]: 'Help & Support - PearlMom',
  
  // Mother
  [ROUTES.MOTHER.DASHBOARD]: 'Mother Dashboard',
  [ROUTES.MOTHER.EMCH_CARD]: 'Digital Pregnancy Record (E-MCH Card)',
  [ROUTES.MOTHER.VACCINATION]: 'Vaccination & Appointments',
  [ROUTES.MOTHER.CLINIC_LOCATOR]: 'Clinic & Hospital Locator',
  [ROUTES.MOTHER.NUTRITION]: 'Nutrition & Thriposha Tracker',
  [ROUTES.MOTHER.SETTINGS]: 'Account Settings',
  
  // Provider
  [ROUTES.PROVIDER.DASHBOARD]: 'Provider Dashboard',
  [ROUTES.PROVIDER.SETTINGS]: 'Provider Settings',
  [ROUTES.PROVIDER.MOTHERS]: 'Assigned Patients',
  [ROUTES.PROVIDER.CLINIC_VISIT]: 'Clinic Visit Management',
  [ROUTES.PROVIDER.NUTRITION]: 'Nutrition & Wellness Log',
  
  // Admin
  [ROUTES.ADMIN.DASHBOARD]: 'Admin Dashboard',
  [ROUTES.ADMIN.SETTINGS]: 'Admin Settings',
  [ROUTES.ADMIN.USERS]: 'User & System Management'
};

/**
 * Check if route requires authentication
 * @param {string} pathname - Current path
 * @returns {boolean} Whether route is protected
 */
export const isProtectedRoute = (pathname) => {
  const protectedPaths = ['/mother', '/provider', '/admin'];
  return protectedPaths.some(path => pathname.startsWith(path));
};

/**
 * Get user role from pathname
 * @param {string} pathname - Current path
 * @returns {string|null} User role or null
 */
export const getRoleFromPath = (pathname) => {
  if (pathname.startsWith('/mother')) return 'mother';
  if (pathname.startsWith('/provider')) return 'provider';
  if (pathname.startsWith('/admin')) return 'admin';
  return null;
};

/**
 * Get default dashboard route for role
 * @param {string} role - User role
 * @returns {string} Default route
 */
export const getDefaultRoute = (role) => {
  switch (role) {
    case 'mother':
      return ROUTES.MOTHER.DASHBOARD;
    case 'provider':
      return ROUTES.PROVIDER.DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.PUBLIC.LANDING;
  }
};

/**
 * Get sidebar navigation items for role
 * @param {string} role - User role
 * @returns {Array} Navigation items
 */
export const getNavigationForRole = (role) => {
  switch (role) {
    case 'mother':
      return MOTHER_NAVIGATION;
    case 'provider':
      return PROVIDER_NAVIGATION;
    case 'admin':
      return ADMIN_NAVIGATION;
    default:
      return [];
  }
};

/**
 * Get page title for current route
 * @param {string} pathname - Current path
 * @returns {string} Page title
 */
export const getPageTitle = (pathname) => {
  // Exact match
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }
  
  // Check with trailing slash
  const withSlash = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (ROUTE_TITLES[withSlash]) {
    return ROUTE_TITLES[withSlash];
  }
  
  return 'PearlMom';
};

/**
 * All public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  ROUTES.PUBLIC.LANDING,
  ROUTES.PUBLIC.LOGIN,
  ROUTES.PUBLIC.REGISTER,
  ROUTES.PUBLIC.HELP
];

/**
 * Complete route map for the application
 */
export const APP_ROUTES_MAP = {
  public: {
    landing: ROUTES.PUBLIC.LANDING,
    login: ROUTES.PUBLIC.LOGIN,
    register: ROUTES.PUBLIC.REGISTER,
    help: ROUTES.PUBLIC.HELP
  },
  mother: {
    dashboard: ROUTES.MOTHER.DASHBOARD,
    emchCard: ROUTES.MOTHER.EMCH_CARD,
    vaccination: ROUTES.MOTHER.VACCINATION,
    clinicLocator: ROUTES.MOTHER.CLINIC_LOCATOR,
    nutrition: ROUTES.MOTHER.NUTRITION,
    settings: ROUTES.MOTHER.SETTINGS
  },
  provider: {
    dashboard: ROUTES.PROVIDER.DASHBOARD,
    settings: ROUTES.PROVIDER.SETTINGS,
    mothers: ROUTES.PROVIDER.MOTHERS,
    clinicVisit: ROUTES.PROVIDER.CLINIC_VISIT,
    nutrition: ROUTES.PROVIDER.NUTRITION
  },
  admin: {
    dashboard: ROUTES.ADMIN.DASHBOARD,
    settings: ROUTES.ADMIN.SETTINGS,
    users: ROUTES.ADMIN.USERS
  }
};