import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './CategoryPage.css'; // Import the CSS file

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const CategoryPage = () => {
  const { category } = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [currentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/users/approved-businesses?category=${category}`);
        const businessesData = response.data;
        setBusinesses(businessesData);
        await fetchRatingsAndReviews(businessesData);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, [category]);

  const fetchRatingsAndReviews = async (businesses) => {
    const ratings = {};
    const counts = {};
    for (const business of businesses) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/reviews`, {
          params: { businessId: business._id },
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
    const average = (totalRating / reviews.length).toFixed(1);
    return parseFloat(average);
  };

  const sortedBusinesses = businesses.sort((a, b) => {
    const ratingA = averageRatings[a._id] || 0;
    const ratingB = averageRatings[b._id] || 0;
    if (ratingB !== ratingA) {
      return ratingB - ratingA; // Sort by average rating (high to low)
    }
    const reviewsA = reviewCounts[a._id] || 0;
    const reviewsB = reviewCounts[b._id] || 0;
    return reviewsB - reviewsA; // Sort by review count (high to low if ratings are tied)
  });

  return (
    <>
      <NavBar />
      <div className="category-page-container">
        <h1 className="category-page-title">Top Businesses in {category}</h1>
        <div className="category-page-business-list">
          {sortedBusinesses.map((business) => (
            <div key={business._id} className="category-page-business-card">
              <div className="category-page-business-image-container">{business.imageUrl && (
              <img src={`${REACT_APP_API_URL.split('/api')[0]}${business.imageUrl}`}
                 alt={business.businessName}className="category-page-business-image"/>
              )}
              <div className="category-page-business-rating">
                <span className="rating-display">
      {averageRatings[business._id] || 0}★
    </span>
    <span className="review-count">
      ({reviewCounts[business._id] || 0} reviews)
    </span>
  </div>
</div>
              <div className="category-page-business-info">
                <h2 className="category-page-business-name">
                  <Link to={`/business/${business.businessName}`}>{business.businessName}</Link>
                </h2>
                <p className="category-page-business-address">{business.address}</p>
                <p className="category-page-business-website">{business.website}</p>
                <p className="category-page-business-category">{business.category}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="footer">
             <img src="/score.gif" alt="score logo" className="footer-logo" style={{ width: "50px", height: "50px" }} />

        <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
      </footer>
    </>
    
  );
};

export default CategoryPage;
