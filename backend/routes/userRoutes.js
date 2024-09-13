// backend/routes/userRoutes.js
const express = require('express');
const { register, login } = require('../controllers/userController');
const { submitBusinessRequest, approveBusinessRequest, getUserBusinessRequests } = require('../controllers/businessRequestController');
const adminOnly = require('../middleware/role');
const auth = require('../middleware/auth');
const BusinessRequest = require('../models/businessRequest'); // Import the model
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/business-request', auth, submitBusinessRequest);
router.put('/business-request/:id/approve', auth, adminOnly, approveBusinessRequest);
router.put('/business-request/:id/decline', auth, adminOnly, approveBusinessRequest);
router.get('/business-requests', auth, getUserBusinessRequests);

// Admin route to get all business requests
router.get('/api/admin/business-requests', auth, adminOnly, async (req, res) => {
  try {
    const requests = await BusinessRequest.find({ status: 'pending' }); // Fetch only pending requests
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;