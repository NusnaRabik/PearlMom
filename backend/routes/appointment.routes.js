const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const appointmentController = require('../controllers/appointment.controller');

router.get('/', protect, appointmentController.getMyAppointments);
router.post('/', protect, appointmentController.createAppointment);
router.put('/:id', protect, appointmentController.updateAppointment);

module.exports = router;