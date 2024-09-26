const BusinessRequest = require('../models/businessRequest');
const multer = require('multer');
const path = require('path');

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos'); // Directory for uploading images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename using timestamp
  },
});

const upload = multer({ storage });

// Submit business request with image upload
const submitBusinessRequest = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image' });
    }

    const { businessName, address, website, category } = req.body;
    const imageUrl = req.file ? `/uploads/logos/${req.file.filename}` : '';

    try {
      const userId = req.userId; // Assuming userId is retrieved from request object

      // Check if the user already submitted a request
      const existingRequest = await BusinessRequest.findOne({ userId });
      if (existingRequest) {
        return res.status(400).json({ message: 'You have already submitted a business request.' });
      }

      // Create new business request with image URL
      const businessRequest = new BusinessRequest({
        userId,
        businessName,
        address,
        website,
        category,
        imageUrl, // Attach image URL
        status: 'pending', // Default status set to 'pending'
      });

      await businessRequest.save();
      res.status(201).json({ message: 'Business request submitted successfully!', businessRequest });
    } catch (error) {
      console.error('Error submitting business request:', error);
      res.status(500).json({ message: 'Failed to submit business request.', error });
    }
  });
};

// Update business request status (approve/decline)
const updateBusinessRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'decline'

    const request = await BusinessRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Business request not found' });
    }

    if (action === 'approve') {
      request.status = 'approved';
    } else if (action === 'decline') {
      request.status = 'declined';
      request.feedback = req.body.feedback; // Save feedback if provided
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await request.save();
    res.status(200).json({ message: `Business request ${action}d successfully.` });
  } catch (error) {
    console.error('Error updating business request status:', error);
    res.status(500).json({ message: 'Failed to update business request status.' });
  }
};

// Fetch user-specific business requests
const getUserBusinessRequests = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is retrieved from request object
    const requests = await BusinessRequest.find({ userId });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user business requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve business request by ID
const approveBusinessRequest = async (req, res) => {
  try {
    const request = await BusinessRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'approved';
    await request.save();
    res.json({ message: 'Request approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Decline business request by ID with optional feedback
const declineBusinessRequest = async (req, res) => {
  try {
    const request = await BusinessRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'declined';
    request.feedback = req.body.feedback || ''; // Optional feedback
    await request.save();
    res.json({ message: 'Request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all handlers
module.exports = {
  submitBusinessRequest,
  approveBusinessRequest,
  declineBusinessRequest,
  getUserBusinessRequests,
  updateBusinessRequestStatus,
};
