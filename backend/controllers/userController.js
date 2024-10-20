const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const BusinessRequest=require('../models/businessRequest')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos'); // Directory for uploading images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename using timestamp
  },
});

const upload = multer({ storage });
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// backend/controllers/userController.js
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
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    return res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.userId, { username, email }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Business Request: Create
const createBusinessRequest = async (req, res) => {
  const { businessName, category, address, website } = req.body;
  const newRequest = new BusinessRequest({ userId: req.userId, businessName, category, address, website });
  try {
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Business Request: Update
// const updateBusinessRequest = async (req, res) => {
//   const { businessName, category, address, website } = req.body;
//   console.log(req.body);
//   try {
//     const updatedRequest = await BusinessRequest.findByIdAndUpdate(
//       req.params.id,
//       { businessName, category, address, website },
//       { new: true }
//     );
//     res.json({ updatedRequest });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateBusinessRequest = async (req, res) => {
  // Use multer to handle image uploads
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image' });
    }

    // Destructure fields from req.body
    const { businessName, address, website, category } = req.body;

    // If an image was uploaded, set the image URL
    const imageUrl = req.file ? `/uploads/logos/${req.file.filename}` : undefined;

    try {
      // Retrieve the business request ID from the request parameters
      const requestId = req.params.id;

      // Find the business request to update
      const updatedRequest = await BusinessRequest.findById(requestId);
      if (!updatedRequest) {
        return res.status(404).json({ message: 'Business request not found' });
      }

      // Update the fields; if no new image is uploaded, keep the existing image URL
      updatedRequest.businessName = businessName || updatedRequest.businessName;
      updatedRequest.address = address || updatedRequest.address;
      updatedRequest.website = website || updatedRequest.website;
      updatedRequest.category = category || updatedRequest.category;
      if (imageUrl) {
        updatedRequest.imageUrl = imageUrl; // Update the image URL if a new image is provided
      }

      // Save the updated business request
      await updatedRequest.save();

      // Respond with the updated request
      res.json({ message: 'Business request updated successfully!', updatedRequest });
    } catch (error) {
      console.error('Error updating business request:', error);
      res.status(500).json({ message: 'Failed to update business request.', error });
    }
  });
};


// Business Request: Delete
const deleteBusinessRequest = async (req, res) => {
  try {
    const deletedRequest = await BusinessRequest.findByIdAndDelete(req.params.id);
    res.json({ deletedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Business Request: Get all for a user
const getBusinessRequests = async (req, res) => {
  console.log(req.userId)
  try {
    const requests = await BusinessRequest.find({ userId: req.userId });
    return res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  createBusinessRequest,
  updateBusinessRequest,
  deleteBusinessRequest,
  getBusinessRequests,
};