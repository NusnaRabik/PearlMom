const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserById);

module.exports = router;