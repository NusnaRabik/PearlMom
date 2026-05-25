const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const providerController = require('../controllers/provider.controller');

router.get('/dashboard', protect, authorize('midwife', 'doctor'), providerController.getDashboard);
router.get('/profile', protect, authorize('midwife', 'doctor'), providerController.getMyProfile);
router.put('/profile', protect, authorize('midwife', 'doctor'), providerController.updateProfile);
router.get('/mothers', protect, authorize('midwife', 'doctor'), providerController.getMyMothers);
router.post('/clinic-visit', protect, authorize('midwife', 'doctor'), providerController.recordClinicVisit);

module.exports = router;