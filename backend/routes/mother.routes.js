const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const motherController = require('../controllers/mother.controller');

// All routes are protected
router.use(protect);

// Mother routes (self)
router.get('/profile', motherController.getProfile);
router.put('/profile', motherController.updateProfile);
router.put('/change-password', motherController.changePassword);
router.delete('/deactivate', motherController.deactivateAccount);
router.put('/upload-profile-picture', motherController.uploadProfilePicture);
router.get('/dashboard', motherController.getDashboard);

// Provider routes
router.get('/all', authorize('midwife', 'doctor'), motherController.getAllMothers);
router.put('/medical-details', authorize('midwife', 'doctor'), motherController.updateMedicalDetails);
router.post('/create-or-update', authorize('midwife', 'doctor'), motherController.createOrUpdateProfile);
router.post('/add', authorize('midwife', 'doctor'), motherController.addMother);

module.exports = router;