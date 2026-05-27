const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const providerController = require('../controllers/provider.controller');

// All routes are protected and require midwife/doctor role
router.use(protect);
router.use(authorize('midwife', 'doctor'));

// Dashboard and profile routes
router.get('/dashboard', providerController.getDashboard);
router.get('/profile', providerController.getMyProfile);
router.put('/profile', providerController.updateProfile);
router.put('/change-password', providerController.changePassword);

// Work preferences
router.get('/work-preferences', providerController.getWorkPreferences);
router.put('/work-preferences', providerController.updateWorkPreferences);

// Notification preferences
router.get('/notification-preferences', providerController.getNotificationPreferences);
router.put('/notification-preferences', providerController.updateNotificationPreferences);

// Mother management routes
router.get('/mothers', providerController.getMyMothers);
router.get('/mothers/:motherId', providerController.getMotherDetails);

// Clinical routes
router.post('/clinic-visit', providerController.recordClinicVisit);

module.exports = router;