const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const appointmentController = require('../controllers/appointment.controller');

router.use(protect);

router.get('/my', appointmentController.getMyAppointments);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.get('/upcoming', appointmentController.getUpcomingAppointments);

module.exports = router;