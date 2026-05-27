const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const clinicController = require('../controllers/clinic.controller');

// Protect all clinic routes (require authentication)
router.use(protect);

router.get('/', clinicController.getAllClinics);
router.get('/:id', clinicController.getClinicById);
router.get('/district/:district', clinicController.getClinicsByDistrict);

module.exports = router;