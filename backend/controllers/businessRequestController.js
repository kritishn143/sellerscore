const BusinessRequest = require('../models/businessRequest');

const submitBusinessRequest = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the request object
    const { businessName, address, website, category } = req.body;

    const existingRequest = await BusinessRequest.findOne({ userId });

    if (existingRequest) {
      return res.status(400).send({ message: 'You have already submitted a business request.' });
    }

    const newRequest = new BusinessRequest({
      userId, // Set userId
      businessName,
      address,
      website,
      category,
      status: 'pending', // Set default status to 'pending'
    });

    await newRequest.save();

    res.status(200).send({ message: 'Business request submitted successfully!' });
  } catch (error) {
    console.error('Error submitting business request:', error);
    res.status(500).send({ message: 'Failed to submit business request.' });
  }
};

const approveBusinessRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, feedback } = req.body; // Get action and feedback from the request body
    const request = await BusinessRequest.findById(requestId);

    if (!request) {
      return res.status(404).send({ message: 'Business request not found.' });
    }

    if (action === 'approve') {
      request.status = 'approved';
    } else if (action === 'decline') {
      request.status = 'declined';
      request.feedback = feedback; // Save feedback on decline
    }

    await request.save();

    res.status(200).send({ message: `Business request ${action}d successfully!` });
  } catch (error) {
    console.error(`Error ${action}ing business request:`, error);
    res.status(500).send({ message: `Failed to ${action} business request.` });
  }
};

const getUserBusinessRequests = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the request object
    const requests = await BusinessRequest.find({ userId });

    if (!requests.length) {
      return res.status(404).send({ message: 'No business requests found for this user.' });
    }

    res.status(200).send(requests);
  } catch (error) {
    console.error('Error fetching user business requests:', error);
    res.status(500).send({ message: 'Failed to fetch user business requests.' });
  }
};

module.exports = { submitBusinessRequest, approveBusinessRequest, getUserBusinessRequests };