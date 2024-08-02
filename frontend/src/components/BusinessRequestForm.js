import React, { useState } from 'react';
import axios from 'axios';

const BusinessRequestForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    location: '',
    website: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/business-request', formData);
      alert('Business request submitted successfully!');
    } catch (error) {
      console.error('There was an error submitting the business request!', error);
      alert('Failed to submit business request.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Business Name:</label>
        <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div>
        <label>Website or Social Media:</label>
        <input type="text" name="website" value={formData.website} onChange={handleChange} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BusinessRequestForm;
