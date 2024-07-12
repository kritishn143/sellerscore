// BusinessRequestForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './BusinessRequestForm.css'; // Import the CSS file here

const BusinessRequestForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    categories: '',
    websiteOrSocialLinks: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login again.');
      return;
    }
    // Decode and check token expiry here if necessary
    try {
      await axios.post('http://localhost:5000/api/users/submit-request', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Request submitted successfully');
    } catch (error) {
      console.error('Error submitting request:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to submit request. Please try again.';
      alert(errorMessage);
    }
  };
  

  return (
    <div className="business-request-form">
      <form onSubmit={handleSubmit}>
        <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" required />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        <input name="categories" value={formData.categories} onChange={handleChange} placeholder="Categories" required />
        <input name="websiteOrSocialLinks" value={formData.websiteOrSocialLinks} onChange={handleChange} placeholder="Website or Social Links" required />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default BusinessRequestForm;
