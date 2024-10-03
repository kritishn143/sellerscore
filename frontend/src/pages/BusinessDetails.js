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

  const handleHome = () => {
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted rating:', rating); // Debug log to check rating
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/review', {
        businessId: business._id,
        rating, // Ensure the correct rating value is being sent
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRating(0);
      setComment('');
      fetchReviews(); // Refresh reviews after submission
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  

  const renderStars = (currentRating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => {
              console.log(`Star ${star} clicked!`); // Debug log
              setRating(star); // Update rating when a star is clicked
            }}
            className={star <= currentRating ? 'active-star' : 'inactive-star'}
            style={{ cursor: 'pointer' }} // Ensure the stars are visibly clickable
          >
            &#9733; {/* Star character */}
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
      <div className="business-container">
        <img 
          className="business-image"
          src={`http://localhost:5000${business.imageUrl}`} 
          alt={business.businessName} 
           
        />
        <div className="business-details">
        <h1>{business.businessName}</h1>
        <p>{business.address}</p>
        <p>
            <a href={business.website} target="_blank" rel="noopener noreferrer">
                {business.website}
            </a>
        </p>
        <p className="category">{business.category}</p>
    </div>
    
</div>
      
      
<form onSubmit={handleSubmit}>
<h2>Submit a Review</h2>
  <div className="rating-select">
    <label>Rating:</label>
    {renderStars(rating)} {/* Call renderStars to display the stars */}
  </div>
  <div>
    <label>Comment:</label>
    <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
  </div>
  <button type="submit">Submit</button>
</form>

<h2>Reviews</h2>
<div>
  {reviews.map((review) => (
    <div key={review._id} className="review">
      <p><strong>{review.userId.username}</strong></p>
      <div className="rating">
        {renderStars(review.rating)} {/* Display stars for each review */}
      </div>
      <p>{review.comment}</p>
    </div>
  ))}
</div>

</div>
  );
};

export default BusinessDetails;
