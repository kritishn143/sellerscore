// frontend/src/components/BusinessList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BusinessList.css'; // Import the CSS file


const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/approved-businesses');
        setBusinesses(response.data);
        await fetchAverageRatings(response.data);
      } catch (error) {
        console.error('Error fetching approved businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);
  // Function to fetch reviews and calculate average ratings
  const fetchAverageRatings = async (businesses) => {
    const ratings = {};
    for (const business of businesses) {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${business._id}`);
        const reviews = response.data;
        ratings[business._id] = calculateAverageRating(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    setAverageRatings(ratings);
  };

  // Function to calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0; // No reviews
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Function to render stars
  const renderStars = (currentRating) => {
    const roundedRating = Math.round(currentRating * 2) / 2;
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= roundedRating ? 'active-star' : 'inactive-star'}
          >
            {star <= roundedRating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };
  const filteredBusinesses = businesses.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="business-list">
      <input
        type="text"
        placeholder="Search businesses..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />
       <div className="business-list-container">
        {filteredBusinesses.map(business => (
          <div key={business._id} className="business-item">
            <div className="logo-and-name">
              <img 
                src={`http://localhost:5000${business.imageUrl}`} 
                alt={business.businessName} 
                className="business-logo"
              />
              <h2 className="business-name">
                <Link to={`/business/${business.businessName}`}>{business.businessName}</Link>
              </h2>
            </div>
            <div className="details">
              <p><strong>Category:</strong> {business.category}</p>
              <p><strong>Address:</strong> {business.address}</p>
              <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
              <div className="business-rating">
                <span className="stars">{renderStars(business.averageRating)}</span>
                <span className="review-count">({business.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BusinessList;