const User = require('../models/User');

const adminOnly = async (req, res, next) => {
  try {
    // Fetch the user from the database using the userId from the request object
    const user = await User.findById(req.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has an admin role
    if (user.role === 'admin') {
      // Call next() to pass control to the next middleware or route handler
      return next();
    } else {
      // Return a 403 Forbidden response if the user is not an admin
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Role check error:', error);
    // Return a 500 Internal Server Error response in case of unexpected errors
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminOnly;
