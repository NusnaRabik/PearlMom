const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const motherController = require('../controllers/mother.controller');

// All routes are protected
router.use(protect);

// Mother routes
router.get('/profile', motherController.getProfile);
router.put('/profile', motherController.updateProfile);
router.put('/change-password', motherController.changePassword);
router.delete('/deactivate', motherController.deactivateAccount);
router.put('/upload-profile-picture', motherController.uploadProfilePicture);
router.get('/dashboard', motherController.getDashboard);
router.get('/all', motherController.getAllMothers);
router.put('/medical-details', motherController.updateMedicalDetails);
router.post('/create-or-update', motherController.createOrUpdateProfile);

module.exports = router;