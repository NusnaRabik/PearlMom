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
router.get('/distributions', protect, authorize('midwife', 'doctor'), thriposhaController.getEligibleMothersWithDistributions);
router.post('/distribute', protect, authorize('midwife', 'doctor'), thriposhaController.distributeSupplement);
router.get('/history/:motherId', protect, authorize('midwife', 'doctor'), thriposhaController.getDistributionHistory);
router.get('/report/export', protect, authorize('midwife', 'doctor'), thriposhaController.exportReport);

module.exports = router;