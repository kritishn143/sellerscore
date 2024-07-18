// controllers/businessRequestController.js
const BusinessRequest = require('../models/businessRequest');

const submitBusinessRequest = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { businessName, address, location, website } = req.body;

    const newRequest = new BusinessRequest({
      businessName,
      address,
      location,
      website,
    });

    await newRequest.save();

    res.status(200).send({ message: 'Business request submitted successfully!' });
  } catch (error) {
    console.error('Error submitting business request:', error);
    res.status(500).send({ message: 'Failed to submit business request.' });
  }
};

module.exports = { submitBusinessRequest };
