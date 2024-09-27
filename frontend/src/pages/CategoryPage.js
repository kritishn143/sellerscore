// frontend/src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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
    <div>
              <button onClick={handleHome}>Sellerscore</button> {/* Home Button */}
              <button onClick={handleDashboard}>Dashboard</button>

      <h1>Top Businesses in {category}</h1>
      <div>
        {businesses.map(business => (
          <div key={business._id}>
            <h2>
              <Link to={`/business/${business.businessName}`}>{business.businessName}</Link>
            </h2>
            <p>{business.address}</p>
            <p>{business.website}</p>
            <p>{business.category}</p>
            {business.imageUrl && (
              <img 
                src={`http://localhost:5000${business.imageUrl}`} 
                alt={business.businessName} 
                style={{ width: '100px', height: 'auto' }} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;