// frontend/src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './CategoryPage.css';


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
    <div className="category-page">
    {/* Include the NavBar here */}
    <NavBar />  {/* This will render the navbar */}

    <h1 className="category-title">Top Businesses in {category}</h1>
    <div className="business-list">
      {businesses.map(business => (
        <div key={business._id} className="business-item">
          <h2 className="business-name">
            <Link to={`/business/${business.businessName}`}>{business.businessName}</Link>
          </h2>
          <p>{business.address}</p>
          <p>{business.website}</p>
          <p>{business.category}</p>
          {business.imageUrl && (
            <img 
              src={`http://localhost:5000${business.imageUrl}`} 
              alt={business.businessName} 
              className="business-image"
            />
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

export default CategoryPage;