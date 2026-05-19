// frontend/src/constants/roles.js

/**
 * User role definitions for PearlMom system
 */

export const ROLES = {
  MOTHER: 'mother',
  PROVIDER: 'provider',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [ROLES.MOTHER]: 'Mother',
  [ROLES.PROVIDER]: 'Provider',
  [ROLES.ADMIN]: 'Administrator'
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.MOTHER]: 'Expecting or new mother accessing maternal healthcare services',
  [ROLES.PROVIDER]: 'Healthcare provider (Midwife, Doctor, Nurse) managing patient care',
  [ROLES.ADMIN]: 'System administrator managing users, content, and system configuration'
};

export const ROLE_PERMISSIONS = {
  [ROLES.MOTHER]: [
    'view_dashboard',
    'view_emch_card',
    'view_vaccination_schedule',
    'view_clinic_locator',
    'view_nutrition_tracker',
    'view_profile_settings',
    'edit_profile',
    'upload_reports',
    'book_appointments',
    'view_help_support'
  ],
  [ROLES.PROVIDER]: [
    'view_dashboard',
    'view_mothers_list',
    'view_mother_profile',
    'record_clinic_visit',
    'manage_nutrition',
    'manage_vaccinations',
    'view_analytics',
    'export_reports',
    'view_profile_settings',
    'edit_profile',
    'view_help_support'
  ],
  [ROLES.ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_roles',
    'manage_content',
    'view_system_logs',
    'configure_system',
    'view_analytics',
    'export_reports',
    'view_profile_settings',
    'edit_profile',
    'view_help_support'
  ]
};

export const ROLE_HOME_ROUTES = {
  [ROLES.MOTHER]: '/mother/dashboard',
  [ROLES.PROVIDER]: '/provider/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard'
};

export const ROLE_REGISTRATION_FIELDS = {
  [ROLES.MOTHER]: {
    required: ['fullName', 'mobile', 'email', 'password', 'edd'],
    optional: ['bloodGroup', 'address']
  },
  [ROLES.PROVIDER]: {
    required: ['fullName', 'mobile', 'email', 'password', 'employeeId', 'designation'],
    optional: ['clinic', 'contactNumber']
  },
  [ROLES.ADMIN]: {
    required: ['fullName', 'mobile', 'email', 'password', 'employeeId'],
    optional: ['adminLevel']
  }
};