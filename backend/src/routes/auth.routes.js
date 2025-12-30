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


router.get('/me', authMiddleware.authAdmin , authController.getAdminVerify);

module.exports = router;
