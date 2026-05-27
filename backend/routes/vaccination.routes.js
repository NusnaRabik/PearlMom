const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const vaccinationController = require('../controllers/vaccination.controller');

router.use(protect);

router.get('/', vaccinationController.getMyVaccinations);
router.post('/', vaccinationController.addVaccination);
router.put('/:id', vaccinationController.updateVaccination);
router.get('/upcoming', vaccinationController.getUpcomingVaccinations);
router.get('/completed', vaccinationController.getCompletedVaccinations);

module.exports = router;