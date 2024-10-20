import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './CategoryPage.css'; // Import the CSS file

const CategoryPage = () => {
  const { category } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/approved-businesses?category=${category}`);
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, [category]);

  const handleHome = () => {
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <><NavBar /><div className="category-page">


      <h1 className="category-title">Top Businesses in {category}</h1>
      <div className="business_list">
        {businesses.map(business => (
          <div key={business._id} className="business_item">
            <h2 className="business_name">
              <Link to={`/business/${business.businessName}`}>{business.businessName}</Link>
            </h2>
            <p className="business_address">{business.address}</p>
            <p className="business_website">{business.website}</p>
            <p className="business_category">{business.category}</p>
            {business.imageUrl && (
              <img
                src={`http://localhost:5000${business.imageUrl}`}
                alt={business.businessName}
                className="business_image" />
            )}
          </div>
        ))}
      </div>
    </div></>
  );
};

export default CategoryPage;
