const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// POST /login
router.post(
  '/login',
  // 1. MIDDLEWARE: Validation Rules
  [
    body('email')
      .trim()
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(), // Sanitizes email (creates consistent format)
    
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  
  // 2. CONTROLLER LOGIC
  async (req, res) => {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg, // Return just the first error message for clean UI
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    try {
      // --- SPECIAL LOGIC: Create First Admin (Auto-Setup) ---
      // Note: In large scale apps, use a seed script instead of this check.
      const adminCount = await Admin.countDocuments();
      
      if (adminCount === 0) {
        // Hash password explicitly here if your model doesn't handle it, 
        // or rely on pre-save hook if you have one.
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newAdmin = new Admin({ 
          email, 
          password: hashedPassword // Ensure we save hashed password
        });
        
        await newAdmin.save();
        
        return res.status(201).json({ 
          message: 'System initialized: Admin account created. Please log in.' 
        });
      }
      // -----------------------------------------------------

      // 3. Standard Login Flow
      const admin = await Admin.findOne({ email }).select('+password'); // Explicitly select password if it's set to select: false in schema

      // Security: Use same generic error for User Not Found OR Wrong Password
      // This prevents "User Enumeration" attacks.
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 4. Issue Token
      const token = jwt.sign(
        { id: admin._id, role: 'admin' }, // Payload
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Standard expiry (1 day)
      );

      // 5. Success Response
      res.status(200).json({
        success: true,
        token,
        admin: {
          id: admin._id,
          email: admin.email
        }
      });

    } catch (err) {
      console.error('Login Error:', err); // Log the real error on server console
      // Send generic error to client
      res.status(500).json({ message: 'Internal Server Error' }); 
    }
  }
);

module.exports = router;
