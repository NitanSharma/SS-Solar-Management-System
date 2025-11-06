// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if not changed
  this.password = await bcrypt.hash(this.password, 10); // 10 = salt rounds
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
