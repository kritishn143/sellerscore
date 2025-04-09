import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NavBar'; // Import the CSS file
import './BusinessRequestForm.css'; // Import the CSS file
import { Link } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const BusinessRequestForm = () => {
  const navigate = useNavigate();
  const [currentYear] = useState(new Date().getFullYear());
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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/business-requests`, {
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/business-request`, formDataToSend, {
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
      <nav className="navbar"> {/* Navigation Bar */}
   
      <Link to="/">
          <img src="/seller.gif" alt="score logo" className="logo" />
        </Link>          <button className="navbar-button" onClick={handleDashboardNavigation}>Dashboard</button>
      </nav>

      <form onSubmit={handleSubmit} className="business-request-form">
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
            <option value="Finance">Finance</option>
            <option value="Travel Company">Travel Company</option>
            <option value="Health">Health</option>
            <option value="Store">Store</option>
            <option value="Food and Beverage">Food & Beverage</option>
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
      <footer className="footer">
             <img src="/score.gif" alt="score logo" className="footer-logo" style={{ width: "50px", height: "50px" }} />

        <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BusinessRequestForm;
