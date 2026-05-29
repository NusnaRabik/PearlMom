const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const stockController = require('../controllers/stock.controller');

// All routes require authentication and provider/admin role
router.use(protect);
router.use(authorize('midwife', 'doctor', 'admin'));

// Thriposha stock routes
router.get('/thriposha', stockController.getThriposhaStock);
router.post('/thriposha/batch', stockController.addThriposhaBatch);
router.put('/thriposha/settings', stockController.updateThriposhaSettings);

// Vaccine stock routes
router.get('/vaccines', stockController.getAllVaccineStock);
router.get('/vaccines/:vaccineType', stockController.getVaccineStockByType);
router.post('/vaccines/batch', stockController.addVaccineBatch);
router.post('/vaccines/use', stockController.recordVaccineUsage);

// Common routes
router.get('/expiring', stockController.getExpiringBatches);

module.exports = router;