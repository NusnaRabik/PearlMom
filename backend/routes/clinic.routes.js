const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');

router.get('/', clinicController.getAllClinics);
router.get('/:id', clinicController.getClinicById);
router.get('/district/:district', clinicController.getClinicsByDistrict);

module.exports = router;