const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const {validationResult } = require('express-validator');

module.exports.login = async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    try {
     
      const adminCount = await Admin.countDocuments();
      
      if (adminCount === 0) {
       
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newAdmin = new Admin({ 
          email, 
          password: hashedPassword 
        });
        
        await newAdmin.save();
        
        return res.status(201).json({ 
          message: 'System initialized: Admin account created. Please log in.' 
        });
      }
      
      const admin = await Admin.findOne({ email }).select('+password'); // Explicitly select password if it's set to select: false in schema

      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, role: 'admin' }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } 
      );

      res.status(200).json({
        success: true,
        token,
        admin: {
          id: admin._id,
          email: admin.email
        }
      });

    } catch (err) {
      console.error('Login Error:', err); 
      res.status(500).json({ message: 'Internal Server Error' }); 
    }
  }