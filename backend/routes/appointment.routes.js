const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const appointmentController = require('../controllers/appointment.controller');

// All routes require authentication
router.use(protect);

// Mother routes (self)
router.get('/my', appointmentController.getMyAppointments);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.get('/upcoming', appointmentController.getUpcomingAppointments);

// Provider/Admin routes - Get appointments for a specific mother
router.get('/mother/:motherId', authorize('midwife', 'doctor', 'admin'), appointmentController.getAppointmentsByMotherId);
router.post('/mother/:motherId', authorize('midwife', 'doctor', 'admin'), appointmentController.addAppointmentForMother);

module.exports = router;