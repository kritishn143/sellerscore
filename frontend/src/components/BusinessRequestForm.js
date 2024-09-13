import React, { useState } from 'react';
import axios from 'axios';

const BusinessRequestForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    location: '',
    website: '',
    category: '', // Add category to form data
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/business-request', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Business request submitted successfully!');
    } catch (error) {
      console.error('There was an error submitting the business request!', error);
      if (error.response && error.response.data.message) {
        alert(`Failed to submit business request: ${error.response.data.message}`);
      } else {
        alert('Failed to submit business request.');
      }
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
      <div>
        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          <option value="Bank">Bank</option>
          <option value="Travel Insurance Company">Travel Insurance Company</option>
          <option value="Car Dealer">Car Dealer</option>
          <option value="Furniture Store">Furniture Store</option>
          <option value="Jewelry Store">Jewelry Store</option>
          <option value="Clothing Store">Clothing Store</option>
          <option value="Electronics & Technology">Electronics & Technology</option>
          <option value="Fitness and Nutrition Service">Fitness and Nutrition Service</option>
          <option value="Pet Store">Pet Store</option>
          <option value="Energy Supplier">Energy Supplier</option>
          <option value="Real Estate Agents">Real Estate Agents</option>
          <option value="Insurance Agency">Insurance Agency</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BusinessRequestForm;