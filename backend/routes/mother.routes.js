const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const motherController = require('../controllers/mother.controller');

router.get('/dashboard', protect, motherController.getDashboard);
router.get('/profile', protect, motherController.getProfile);
router.put('/profile', protect, motherController.updateProfile);
router.get('/all', protect, motherController.getAllMothers);

module.exports = router;