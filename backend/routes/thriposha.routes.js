const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const thriposhaController = require('../controllers/thriposha.controller');

// Mother routes
router.get('/status', protect, authorize('mother'), thriposhaController.getMyThriposhaStatus);
router.get('/history', protect, authorize('mother'), thriposhaController.getMyThriposhaHistory);

// Provider routes
router.post('/assess', protect, authorize('midwife', 'doctor'), thriposhaController.assessEligibility);
router.get('/eligible-mothers', protect, authorize('midwife', 'doctor'), thriposhaController.getEligibleMothers);
router.post('/distribute', protect, authorize('midwife', 'doctor'), thriposhaController.distributeSupplement);

module.exports = router;