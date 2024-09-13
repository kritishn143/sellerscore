// backend/middleware/role.js
const User = require('../models/User');

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Role check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminOnly;