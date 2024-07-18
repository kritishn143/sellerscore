const express = require('express');
const { register, login } = require('../controllers/userController');
const { submitBusinessRequest } = require('../controllers/businessRequestController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/business-request', submitBusinessRequest);

module.exports = router;
