// models/businessRequest.js
const mongoose = require('mongoose');

const businessRequestSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BusinessRequest', businessRequestSchema);
