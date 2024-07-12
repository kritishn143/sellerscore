const express = require('express');
const router = express.Router();
const { register, login, submitBusinessRequest, getAllRequests, handleRequest } = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/role');

// Routes for user registration and login
router.post('/register', register);
router.post('/login', login);

// Route for submitting a business request (with authentication)
router.post('/submit-request', auth, submitBusinessRequest);

// Route for retrieving all requests, protected by auth and adminOnly middleware
router.get('/requests', auth, adminOnly, getAllRequests);

// Route for handling requests, protected by auth and adminOnly middleware
router.post('/handle-request', auth, adminOnly, handleRequest);

module.exports = router;
