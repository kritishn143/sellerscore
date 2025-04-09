import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BusinessList.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [averageRatings, setAverageRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/users/approved-businesses`);
        setBusinesses(response.data);
        await fetchRatingsAndReviews(response.data);
      } catch (error) {
        console.error('Error fetching approved businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const fetchRatingsAndReviews = async (businesses) => {
    const ratings = {};
    const counts = {};
    for (const business of businesses) {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/users/reviews`, {
          params: { businessId: business._id }
        });
        const reviews = response.data;
        ratings[business._id] = calculateAverageRating(reviews);
        counts[business._id] = reviews.length;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    setAverageRatings(ratings);
    setReviewCounts(counts);
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((totalRating / reviews.length).toFixed(1));
  };

  const renderStars = (currentRating) => {
    const fullStars = Math.floor(currentRating);
    const hasHalfStar = currentRating % 1 !== 0;
    const totalStars = 5;

    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="full-star">★</span>
        ))}
        {hasHalfStar && <span className="half-star">★</span>}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <span key={`empty-${index}`} className="empty-star">★</span>
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
                src={`${process.env.REACT_APP_API_URL.split('/api')[0]}${business.imageUrl}`} 
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
              <p>
                <strong>Website:</strong> 
                <a 
                  href={business.website?.startsWith('http') ? business.website : `http://${business.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {business.website}
                </a>
              </p>
              <div className="business-rating">
                <span className="stars">{renderStars(averageRatings[business._id] || 0)}</span>
                <span className="review-count">({reviewCounts[business._id] || 0} reviews)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessList;
