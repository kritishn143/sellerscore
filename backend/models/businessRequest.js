// models/businessRequest.js

const mongoose = require('mongoose');

const businessRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId field
  businessName: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'pending' },
  feedback: { type: String },
  imageUrl: { type: String }, 
}, {
  timestamps: true,
});

module.exports = mongoose.model('BusinessRequest', businessRequestSchema);