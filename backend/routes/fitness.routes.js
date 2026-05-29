const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const fitnessController = require('../controllers/fitness.controller');

// Mother routes (protected)
router.get('/exercises/:trimester', protect, authorize('mother'), fitnessController.getExercisesByTrimester);
router.get('/today', protect, authorize('mother'), fitnessController.getTodayExercises);
router.post('/complete', protect, authorize('mother'), fitnessController.completeExercise);
router.get('/history', protect, authorize('mother'), fitnessController.getExerciseHistory);
router.get('/summary', protect, authorize('mother'), fitnessController.getWeeklySummary);

module.exports = router;