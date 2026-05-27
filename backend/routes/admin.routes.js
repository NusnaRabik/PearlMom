const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');

// Apply auth + admin role to every route in this file
router.use(protect);
router.use(authorize('admin'));

// --- Dashboard & stats ---
router.get('/dashboard',           adminController.getDashboard);
router.get('/system-stats',        adminController.getSystemStats);
router.get('/user-stats',          adminController.getUserStats);

// --- User management ---
router.get('/users',               adminController.getAllUsers);
router.put('/users/:id',           adminController.updateUser);
router.delete('/users/:id',        adminController.deleteUser);
router.post('/users/:id/reactivate', adminController.reactivateUser);

// --- Bulk operations ---
router.post('/users/bulk-deactivate', adminController.bulkDeactivateUsers);
router.post('/users/bulk-activate',   adminController.bulkActivateUsers);

// --- Alert Preferences ---
router.get('/alert-preferences',     adminController.getAlertPreferences);
router.put('/alert-preferences',     adminController.updateAlertPreferences);

// --- Admin-only add routes ---
router.post('/add-mother',         adminController.addMother);
router.post('/add-provider',       adminController.addProvider);
router.post('/add-admin',          adminController.addAdmin);

module.exports = router;