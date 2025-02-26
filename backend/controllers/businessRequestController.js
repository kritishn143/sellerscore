const BusinessRequest = require('../models/businessRequest');
const multer = require('multer');
const Review = require('../models/review');

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

// Delete a single business request by ID
const deleteBusinessRequest = async (req, res) => {
  try {
    await BusinessRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Business request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting business request' });
  }
};

// Delete multiple business requests by IDs
const deleteBusinessRequests = async (req, res) => {
  const { ids } = req.body; // Expecting an array of IDs in the request body

  try {
    await BusinessRequest.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Business requests deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting business requests' });
  }
};

// Submit a review for a business
const submitReview = async (req, res) => {
  const { businessId, rating, comment } = req.body;
  const userId = req.userId;

  try {
    // Check if the user has already submitted a review for this business
    const existingReview = await Review.findOne({ userId, businessId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this business' });
    }

    const review = new Review({ userId, businessId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch reviews for a business
const getReviews = async (req, res) => {
  const { businessId } = req.query;

  try {
    const reviews = await Review.find({ businessId }).populate('userId', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review.' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review.' });
  }
};

// Export all handlers
module.exports = {
  submitBusinessRequest,
  approveBusinessRequest,
  declineBusinessRequest,
  getUserBusinessRequests,
  updateBusinessRequestStatus,
  deleteBusinessRequest,
  deleteBusinessRequests,
  submitReview,
  getReviews,
  updateReview,
  deleteReview,
};
