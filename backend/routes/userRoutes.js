// backend/routes/userRoutes.js

const express = require('express');
const {
  register,
  login,
  updateUserProfile,
  updateBusinessRequest,
  getBusinessRequests,
  getUserProfile,
  deleteBusinessRequest,
} = require('../controllers/userController');
const {
  submitBusinessRequest,
  approveBusinessRequest,
  declineBusinessRequest,
  getUserBusinessRequests,
  deleteBusinessRequests,
  submitReview,
  getReviews,
  updateReview,
  deleteReview,
} = require('../controllers/businessRequestController');
const adminOnly = require('../middleware/role');
const auth = require('../middleware/auth');
const BusinessRequest = require('../models/businessRequest');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/business-request', auth, submitBusinessRequest);
router.put('/business-request/:id/approve', auth, adminOnly, approveBusinessRequest);
router.put('/business-request/:id/decline', auth, adminOnly, declineBusinessRequest);
router.get('/business-requests', auth, getUserBusinessRequests);
router.post('/review', auth, submitReview);
router.get('/reviews', getReviews);
router.get('/myprofile', auth, getUserProfile);
router.put('/updateuserprofile', auth, updateUserProfile);
router.get('/mybusiness', auth, getBusinessRequests);
router.put('/business-request/:id/edit', auth, updateBusinessRequest); // Edit business request
router.delete('/business-request/:id', auth, deleteBusinessRequest); // Delete business request

// New routes for review editing and deletion
router.put('/review/:id', auth, updateReview); // Edit review
router.delete('/review/:id', auth, deleteReview); // Delete review

// Admin route to get all business requests
router.get('/api/admin/business-requests', auth, adminOnly, async (req, res) => {
  try {
    const requests = await BusinessRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to delete multiple business requests
router.delete('/business-requests', auth, adminOnly, deleteBusinessRequests); // New route for bulk deletion

// Endpoint to fetch approved businesses
router.get('/approved-businesses', async (req, res) => {
  const { category } = req.query;
  try {
    const query = { status: 'approved' };
    if (category) {
      query.category = category;
    }
    const approvedBusinesses = await BusinessRequest.find(query);
    res.json(approvedBusinesses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await BusinessRequest.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch business by name
router.get('/business/name/:name', async (req, res) => {
  try {
    const business = await BusinessRequest.findOne({ businessName: req.params.name });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
