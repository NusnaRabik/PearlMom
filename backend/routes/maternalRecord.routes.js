const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const maternalRecordController = require('../controllers/maternalRecord.controller');

// Get all records (mother sees own, provider sees assigned mothers)
router.get('/', protect, maternalRecordController.getAllRecords);

// Get single record
router.get('/:id', protect, maternalRecordController.getRecordById);

// Create new record (provider only)
router.post('/', protect, authorize('midwife', 'doctor'), maternalRecordController.createRecord);

// Update record (provider only)
router.put('/:id', protect, authorize('midwife', 'doctor'), maternalRecordController.updateRecord);

// Delete record (provider only)
router.delete('/:id', protect, authorize('midwife', 'doctor'), maternalRecordController.deleteRecord);

// Get records for specific mother (provider only)
router.get('/mother/:motherId', protect, authorize('midwife', 'doctor'), maternalRecordController.getMotherRecords);

module.exports = router;