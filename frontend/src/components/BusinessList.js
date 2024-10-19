// frontend/src/components/BusinessList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BusinessList.css'; // Import the CSS file

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [averageRatings, setAverageRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/approved-businesses');
        setBusinesses(response.data);
        await fetchRatingsAndReviews(response.data);
      } catch (error) {
        console.error('Error fetching approved businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  // Function to fetch reviews and calculate average ratings and review counts
  const fetchRatingsAndReviews = async (businesses) => {
    const ratings = {};
    const counts = {};
    for (const business of businesses) {
      try {
        const response = await axios.get('http://localhost:5000/api/users/reviews', {
          params: {
            businessId: business._id
          }
        });
        const reviews = response.data;
        ratings[business._id] = calculateAverageRating(reviews);
        counts[business._id] = reviews.length; // Set the total number of reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    setAverageRatings(ratings);
    setReviewCounts(counts);
  };

  // Function to calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0; // No reviews
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

// Function to render stars with half-star support
const renderStars = (currentRating) => {
  const roundedRating = Math.round(currentRating * 2) / 2; // Round to nearest half

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= roundedRating - 0.5
              ? 'full-star'
              : star === roundedRating
              ? 'half-star'
              : 'empty-star'
          }
        >
          ★
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
              <p>
  <strong>Website:</strong> 
  <a 
    href={business.website.startsWith('http') ? business.website : `http://${business.website}`} 
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
