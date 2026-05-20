const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

// Register
router.post('/register', [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['mother', 'provider', 'admin']).withMessage('Invalid role'),
  validate
], authController.register);

// Login
router.post('/login', [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
], authController.login);

// Refresh token
router.post('/refresh-token', authController.refreshAccessToken);

// Get current user
router.get('/me', protect, authController.getMe);

// Check profile status
router.get('/check-profile', protect, authController.checkProfileStatus);

// Complete profile
router.put('/complete-profile', protect, authController.completeProfile);

// Logout
router.post('/logout', protect, authController.logout);

module.exports = router;