const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(), 
    
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  authController.login
);

router.post(
  '/verify-login-pin',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('pin')
      .trim()
      .isLength({ min: 6, max: 6 }).withMessage('PIN must be 6 digits')
      .isNumeric().withMessage('PIN must contain only numbers')
  ],
  authController.verifyLoginPin
);

router.post(
  '/forgot-password',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail()
  ],
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('pin')
      .trim()
      .isLength({ min: 6, max: 6 }).withMessage('PIN must be 6 digits')
      .isNumeric().withMessage('PIN must contain only numbers'),
    body('newPassword')
      .trim()
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  authController.resetPassword
);


router.get('/me', authMiddleware.authAdmin , authController.getAdminVerify);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

router.post(
  '/create-admin',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  authController.createAdmin
);

module.exports = router;
