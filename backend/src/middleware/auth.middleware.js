const adminModel = require('../models/admin.model');
const jwt = require('jsonwebtoken');

module.exports.authAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(' ')[1];

    // console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminModel.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    req.admin = admin;
    next();

  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
