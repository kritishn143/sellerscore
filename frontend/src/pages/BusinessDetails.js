import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './BusinessDetails.css';

const BusinessDetails = () => {
  const { name } = useParams();
  const [business, setBusiness] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/business/name/${name}`);
      setBusiness(response.data);
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  }, [name]);

  const fetchReviews = useCallback(async () => {
    if (!business) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/users/reviews?businessId=${business._id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [business]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/review', {
        businessId: business._id,
        rating,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (currentRating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{ cursor: 'pointer', color: star <= currentRating ? '#ffd700' : '#e4e5e9' }}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="page-card">
        <div className="card-container">
          {/* Business Info Column */}
          <div className="column-card business-info">
            <img
              className="business-profile-image"
              src={`http://localhost:5000${business.imageUrl}`} 
              alt={business.businessName}
            />
            <h1>{business.businessName}</h1>
            <p>{business.address}</p>
            <p>
              <a href={business.website} target="_blank" rel="noopener noreferrer">
                {business.website}
              </a>
            </p>
            <p className="category">{business.category}</p>
          </div>

          {/* Add Comment/Rating Form Column */}
          <div className="column-card">
            <h2>Submit a Review</h2>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="rating-select">
                <label>Rating:</label>
                {renderStars(rating)}
              </div>
              <div>
                <label>Comment:</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>

        {/* Reviews in Grid Layout */}
        <div className="section reviews">
          <h2>Reviews</h2>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <p><strong>{review.userId.username}</strong></p>
                </div>
                <div className="review-stars">
                  {renderStars(review.rating)}
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
