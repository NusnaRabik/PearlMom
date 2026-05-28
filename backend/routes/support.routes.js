const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const supportController = require('../controllers/support.controller');

// Public route (no authentication required)
router.post('/ticket', supportController.createTicket);

// Protected routes
router.get('/my-tickets', protect, supportController.getMyTickets);
router.get('/ticket/:ticketId', protect, supportController.getTicketById);

// Admin only routes
router.get('/tickets', protect, authorize('admin'), supportController.getAllTickets);
router.put('/ticket/:ticketId/status', protect, authorize('admin'), supportController.updateTicketStatus);
router.delete('/ticket/:ticketId', protect, authorize('admin'), supportController.deleteTicket);

module.exports = router;