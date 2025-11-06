const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const router = express.Router();

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      const newAdmin = new Admin({ email, password }); // Plain password here
      await newAdmin.save(); // Will trigger pre-save hook to hash

      return res.status(201).json({ message: 'Admin account created successfully, please log in again.' });
    }

    // Admin exists → validate details
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    // Issue JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
