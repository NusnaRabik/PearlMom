const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const vaccinationController = require('../controllers/vaccination.controller');

// All routes require authentication
router.use(protect);

// Mother routes (self)
router.get('/', vaccinationController.getMyVaccinations);
router.post('/', vaccinationController.addVaccination);
router.put('/:id', vaccinationController.updateVaccination);
router.get('/upcoming', vaccinationController.getUpcomingVaccinations);
router.get('/completed', vaccinationController.getCompletedVaccinations);

// Provider/Admin routes - Get vaccinations for a specific mother
router.get('/mother/:motherId', authorize('midwife', 'doctor', 'admin'), vaccinationController.getVaccinationsByMotherId);
router.post('/mother/:motherId', authorize('midwife', 'doctor', 'admin'), vaccinationController.addVaccinationForMother);

module.exports = router;