const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

// Profile routes
router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);
router.post('/upload-photo', protect, profileController.uploadProfilePhoto);
router.delete('/photo', protect, profileController.deleteProfilePhoto);
router.put('/change-password', protect, profileController.changePassword);
router.get('/completion-status', protect, profileController.getProfileCompletionStatus);

// Role-specific profile updates
router.put('/mother', protect, profileController.updateMotherProfile);
router.put('/midwife', protect, profileController.updateMidwifeProfile);

module.exports = router;