import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BusinessDetails = () => {
  const { name } = useParams();
  const [business, setBusiness] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

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
    console.log('Submitting review:', { businessId: business._id, rating, comment });
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.post('http://localhost:5000/api/users/review', {
        businessId: business._id,
        rating,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Review submitted successfully:', response.data);
      setRating(0);
      setComment('');
      // Fetch reviews again to update the list
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{business.businessName}</h1>
      {business.imageUrl && (
        <img 
          src={`http://localhost:5000${business.imageUrl}`} 
          alt={business.businessName} 
          style={{ width: '200px', height: 'auto' }} 
        />
      )}
      <p>{business.address}</p>
      <p>{business.website}</p>
      <p>{business.category}</p>

      <h2>Submit a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
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
          <div key={review._id}>
            <p><strong>{review.userId.username}</strong></p>
            <p>Rating: {review.rating}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessDetails;