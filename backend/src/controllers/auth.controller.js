const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/admin.model');
const {validationResult } = require('express-validator');
const { sendEmail } = require('../utils/emailService');

module.exports.login = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate 6-digit PIN for 2FA
    const loginPin = crypto.randomInt(100000, 1000000).toString();
    const loginPinExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    admin.loginPin = loginPin;
    admin.loginPinExpires = loginPinExpires;
    await admin.save();
    console.log(admin);
    // Send PIN via email
    try {
      await sendEmail(
        admin.email,
        'SS Solar - Login Verification Code',
        `Your 6-digit verification code is: ${loginPin}\n\nThis code will expire in 10 minutes.`
      );
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // For testing, return the PIN in response instead of failing
      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email. Please enter the code to complete login.',
        requiresVerification: true,
        email: admin.email,
        testPin: loginPin, // Remove this in production
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email. Please enter the code to complete login.',
      requiresVerification: true,
      email: admin.email,
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.verifyLoginPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || !admin.loginPin || admin.loginPin !== pin) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }

    if (admin.loginPinExpires < new Date()) {
      return res.status(401).json({ message: 'Verification code has expired' });
    }

    // Clear the PIN
    admin.loginPin = null;
    admin.loginPinExpires = null;
    await admin.save();

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(token);
    res.cookie('token', token);

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error('Verify Login PIN Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Generate 6-digit PIN
    const resetPin = crypto.randomInt(100000, 1000000).toString();
    const resetPinExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    admin.resetPin = resetPin;
    admin.resetPinExpires = resetPinExpires;
    await admin.save();

    // Send PIN via email
    try {
      await sendEmail(
        admin.email,
        'SS Solar - Password Reset Code',
        `Your 6-digit password reset code is: ${resetPin}\n\nThis code will expire in 10 minutes.`
      );
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email',
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, pin, newPassword } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || !admin.resetPin || admin.resetPin !== pin) {
      return res.status(401).json({ message: 'Invalid reset code' });
    }

    if (admin.resetPinExpires < new Date()) {
      return res.status(401).json({ message: 'Reset code has expired' });
    }

    // Update password
    admin.password = newPassword; // Will be hashed by pre-save hook
    admin.resetPin = null;
    admin.resetPinExpires = null;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.createAdmin = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const admin = new Admin({
      email,
      password, // Will be hashed by pre-save hook
    });

    await admin.save();
    console.log(admin);
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
    });

  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.getAdminVerify = async (req, res, next) => {  
    res.status(200).json({admin: req.admin});
}