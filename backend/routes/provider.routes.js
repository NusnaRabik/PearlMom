const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const providerController = require('../controllers/provider.controller');

// Provider routes (self)
router.get('/dashboard', protect, authorize('midwife', 'doctor'), providerController.getDashboard);
router.get('/profile', protect, authorize('midwife', 'doctor'), providerController.getMyProfile);
router.put('/profile', protect, authorize('midwife', 'doctor'), providerController.updateProfile);
router.get('/mothers', protect, authorize('midwife', 'doctor'), providerController.getMyMothers);
router.get('/mothers/:motherId', protect, authorize('midwife', 'doctor'), providerController.getMotherDetails);
router.post('/clinic-visit', protect, authorize('midwife', 'doctor'), providerController.recordClinicVisit);
router.put('/change-password', protect, authorize('midwife', 'doctor'), providerController.changePassword);
router.get('/work-preferences', protect, authorize('midwife', 'doctor'), providerController.getWorkPreferences);
router.put('/work-preferences', protect, authorize('midwife', 'doctor'), providerController.updateWorkPreferences);
router.get('/notification-preferences', protect, authorize('midwife', 'doctor'), providerController.getNotificationPreferences);
router.put('/notification-preferences', protect, authorize('midwife', 'doctor'), providerController.updateNotificationPreferences);

// Admin only - Add new provider
router.post('/add', protect, authorize('admin'), providerController.addMidwife);

module.exports = router;