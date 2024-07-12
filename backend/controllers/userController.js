// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in an existing user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit a business request
const submitBusinessRequest = async (req, res) => {
  const { businessName, location, categories, websiteOrSocialLinks } = req.body;
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.businessName = businessName;
    user.location = location;
    user.categories = categories;
    user.websiteOrSocialLinks = websiteOrSocialLinks;
    user.requestStatus = 'pending';  // Set request status to 'pending' upon submission
    user.feedback = '';  // Clear previous feedback
    await user.save();

    res.status(200).json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Error in submitBusinessRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle a business request
const handleRequest = async (req, res) => {
  const { userId, requestStatus, feedback } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.requestStatus = requestStatus;
    user.feedback = feedback;
    await user.save();
    res.status(200).json({ message: `Request ${requestStatus}` });
  } catch (error) {
    console.error('Error in handleRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all requests with a businessName
const getAllRequests = async (req, res) => {
  try {
    const requests = await User.find({ businessName: { $exists: true }, requestStatus: { $ne: 'rejected' } }); // Filter out rejected requests
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error in getAllRequests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all requests for the authenticated user
const getUserRequests = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      businessName: user.businessName,
      location: user.location,
      categories: user.categories,
      websiteOrSocialLinks: user.websiteOrSocialLinks,
      requestStatus: user.requestStatus,
      feedback: user.feedback
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Exporting all controller functions
module.exports = {
  register,
  login,
  submitBusinessRequest,
  handleRequest,
  getAllRequests,
  getUserRequests  // Added this line
};
