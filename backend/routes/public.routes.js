const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Public routes (no authentication required)
router.get('/stats', publicController.getPublicStats);

module.exports = router;