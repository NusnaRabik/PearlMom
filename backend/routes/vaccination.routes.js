const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const vaccinationController = require('../controllers/vaccination.controller');

router.get('/', protect, vaccinationController.getMyVaccinations);
router.post('/', protect, vaccinationController.addVaccination);

module.exports = router;