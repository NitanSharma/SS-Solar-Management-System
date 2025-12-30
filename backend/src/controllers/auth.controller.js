const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const {validationResult } = require('express-validator');

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

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      const newAdmin = new Admin({
        email,
        password, 
      });

      await newAdmin.save();

      return res.status(201).json({
        success: true,
        message: 'Admin created successfully. Please login again.',
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id},
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    // console.log(admin)
    res.cookie('token', token);
    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.getAdminVerify = async (req, res, next) => {  
    res.status(200).json({admin: req.admin});
}