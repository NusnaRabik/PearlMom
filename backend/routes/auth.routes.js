const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

// Register - More flexible validation
router.post('/register', [
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('mobile')
    .notEmpty().withMessage('Mobile number is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty().withMessage('Role is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
], authController.register);

// Login with email
router.post('/login', [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
], authController.login);

// Login by Full Name (for mother login)
router.post('/login-by-name', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
], authController.loginByName);

// Refresh token
router.post('/refresh-token', authController.refreshAccessToken);

// Password management routes
router.put('/change-password', protect, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Profile management routes
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);
router.put('/upload-profile-picture', protect, authController.uploadProfilePicture);
router.get('/check-profile', protect, authController.checkProfileStatus);
router.put('/complete-profile', protect, authController.completeProfile);
router.post('/logout', protect, authController.logout);

module.exports = router;