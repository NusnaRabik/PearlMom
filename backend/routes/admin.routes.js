const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const adminController = require('../controllers/admin.controller');

router.get('/dashboard', protect, authorize('admin'), adminController.getDashboard);
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);
router.get('/system-stats', protect, authorize('admin'), adminController.getSystemStats);

module.exports = router;