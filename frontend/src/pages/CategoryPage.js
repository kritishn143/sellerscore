// frontend/src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { category } = useParams();
  const [businesses, setBusinesses] = useState([]);

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

  return (
    <div>
      <h1>Top Businesses in {category}</h1>
      <div>
        {businesses.map(business => (
          <div key={business._id}>
            <h2>{business.businessName}</h2>
            <p>{business.address}</p>
            <p>{business.website}</p>
            <p>{business.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;