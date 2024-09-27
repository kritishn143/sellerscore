import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusinessRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    website: '',
    category: '',
    image: null,
    imageUrl: '',
  });

  useEffect(() => {
    const fetchBusinessRequest = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/business-request', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching business request:', error);
      }
    };

    fetchBusinessRequest();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleHome = () => {
    navigate('/'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('businessName', formData.businessName);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('category', formData.category);



    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/users/business-request', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData(response.data); // Update form data with the response data
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

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  return (
    <div>
            <button onClick={handleHome}>Sellerscore</button> {/* Home Button */}

            <button onClick={handleDashboardNavigation}>Dashboard</button>

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
            <option value="Electronics and Technology">Electronics & Technology</option>
            <option value="Insurance Agency">Insurance Agency</option>
          </select>
        </div>
        <div>
          <label>Business Image:</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>
        {formData.imageUrl && (
          <div>
            <img src={formData.imageUrl} alt="Business" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BusinessRequestForm;
