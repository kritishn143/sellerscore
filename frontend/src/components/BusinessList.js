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
    const average = (totalRating / reviews.length).toFixed(1);
    console.log('Total Rating:', totalRating, 'Number of Reviews:', reviews.length, 'Average:', average);
    return parseFloat(average); // Convert to float for accurate rendering
  };

  // Revised function to render stars with correct half-star positioning
  const renderStars = (currentRating) => {
    const fullStars = Math.floor(currentRating); // Get the number of full stars
    const hasHalfStar = currentRating % 1 !== 0; // Check if there's a half-star
    const totalStars = 5; // Total number of stars (fixed)

    return (
      <div className="rating-stars">
        {/* Render full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} className="full-star">★</span>
        ))}

        {/* Render a half-star if applicable */}
        {hasHalfStar && <span className="half-star">★</span>}

        {/* Render empty stars to complete the total of 5 */}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <span key={index} className="empty-star">★</span>
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
