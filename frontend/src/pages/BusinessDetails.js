import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import './BusinessDetails.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const BusinessDetails = () => {
  const { name } = useParams();
  const [business, setBusiness] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [currentYear] = useState(new Date().getFullYear());
  const [editingReview, setEditingReview] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/users/business/name/${name}`);
      setBusiness(response.data);
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  }, [name]);

  const fetchReviews = useCallback(async () => {
    if (!business) return;
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/users/reviews?businessId=${business._id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [business]);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/myprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
    fetchUser();
  }, [fetchBusiness, fetchUser]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingReview) {
        await axios.put(`${REACT_APP_API_URL}/api/users/review/${editingReview._id}`, {
          rating,
          comment,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingReview(null);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/users/review`, {
          businessId: business._id,
          rating,
          comment,
          userId: user._id, // Include user ID in review submission
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${REACT_APP_API_URL}/api/users/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (currentRating) => (
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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const calculateRatingCounts = () => {
    const counts = Array(5).fill(0);
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating - 1] += 1;
      }
    });
    return counts;
  };

  const averageRating = calculateAverageRating();
  const ratingCounts = calculateRatingCounts();
  const totalReviews = reviews.length || 1; // Avoid division by zero

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="page-card">
        <div className="card-container">
          <div className="column-card business-info">
            <h1>{business.businessName}</h1>
            <img
              className="business-profile-image"
              src={`${REACT_APP_API_URL.split('/api')[0]}${business.imageUrl}`}
                            alt={business.businessName}
            />
            <p>{business.address}</p>
            <p>
            <a
  href={
    business.website.startsWith("http") 
      ? business.website 
      : `https://${business.website}`
  }
  target="_blank"
  rel="noopener noreferrer"
>
  {new URL(business.website.startsWith("http") ? business.website : `https://${business.website}`).hostname}
</a>

            </p>
            <p className="category">{business.category}</p>
            
          </div>
           {/* Average Rating Column */}
           <div className="column-card">
            <h2>{averageRating}☆</h2>
            <div className="rating-breakdown">
              {ratingCounts.slice().reverse().map((count, index) => (
                <div key={index} className="rating-row">
                  <span>{5 - index}☆</span>
                  <div className="rating-bar-container">
                    <div
                      className="rating-bar"
                      style={{ width: `${(count / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">({count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="column-card">
            <h2>{editingReview ? 'Edit Review' : 'Submit a Review'}</h2>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="rating-select">
                <label>Rating:</label>
                {renderStars(rating)}
              </div>
              <div>
                <label>Comment:</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <button type="submit">{editingReview ? 'Update' : 'Submit'}</button>
              {editingReview && <button type="button" onClick={() => setEditingReview(null)}>Cancel</button>}
            </form>
          </div>
        <div className="section reviews">
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <p><strong>{review.userId.username}</strong></p>
                    {user && user._id === review.userId._id && ( // Check if logged-in user matches review user
                      <div className="review-actions">
                        <button onClick={() => handleEdit(review)}>Edit</button>
                        <button onClick={() => handleDelete(review._id)}>Delete</button>
                      </div>
                    )}
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
        <footer className="footer">
               <img src="/score.gif" alt="score logo" className="footer-logo" style={{ width: "50px", height: "50px" }} />

          <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
        </footer>
      
    </div>
  );
};

export default BusinessDetails;
