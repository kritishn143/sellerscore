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

const updateBusinessRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // Expecting 'approve' or 'decline'

    const request = await BusinessRequest.findById(id);
    if (!request) {
      return res.status(404).send({ message: 'Business request not found' });
    }

    if (action === 'approve') {
      request.status = 'approved';
    } else if (action === 'decline') {
      request.status = 'declined';
    } else {
      return res.status(400).send({ message: 'Invalid action' });
    }

    await request.save();
    res.status(200).send({ message: `Business request ${action}d successfully` });
  } catch (error) {
    console.error('Error updating business request status:', error);
    res.status(500).send({ message: 'Failed to update business request status' });
  }
};
const getUserBusinessRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await BusinessRequest.find({ user: userId });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user business requests:', error);
    res.status(500).json({ message: 'Failed to fetch business requests' });
  }
};

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


const declineBusinessRequest = async (req, res) => {
  try {
    const request = await BusinessRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    request.status = 'declined';
    request.feedback = req.body.feedback; // Save feedback if provided
    await request.save();
    res.json({ message: 'Request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitBusinessRequest, approveBusinessRequest, declineBusinessRequest, getUserBusinessRequests };