// backend/routes/clinicVisit.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const clinicVisitController = require('../controllers/clinicVisit.controller');

// All routes require provider role
router.use(protect);
router.use(authorize('midwife', 'doctor'));

// Clinic visit routes
router.get('/assigned-mothers', clinicVisitController.getAssignedMothers);
router.get('/mother/:motherId', clinicVisitController.getMotherForVisit);
router.post('/draft/:motherId', clinicVisitController.saveDraftVisit);
router.post('/complete/:motherId', clinicVisitController.completeVisit);

module.exports = router;