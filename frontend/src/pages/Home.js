import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BusinessList from '../components/BusinessList';
import './Home.css'; // Import CSS file

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({}); // New state for review counts
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [currentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/approved-businesses');
        setBusinesses(response.data);
        await fetchRatingsAndReviews(response.data);
      } catch (error) {
        console.error('Error fetching approved businesses:', error);
      }
    };

    fetchCategories();
    fetchBusinesses();

    // Simulate checking login status (replace with actual logic)
    const token = localStorage.getItem('token'); // Example for checking login status
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to fetch reviews and calculate average ratings and review counts
  const fetchRatingsAndReviews = async (businesses) => {
    const ratings = {};
    const counts = {}; // Object to store review counts
    for (const business of businesses) {
      try {
        const response = await axios.get('http://localhost:5000/api/users/reviews', {
          params: {
            businessId: business._id
          }
        });
        const reviews = response.data;
        ratings[business._id] = calculateAverageRating(reviews);
        counts[business._id] = reviews.length; // Store review count
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    setAverageRatings(ratings);
    setReviewCounts(counts); // Set review counts in state
  };

  // Function to calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0; // No reviews
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (totalRating / reviews.length).toFixed(1);
    return parseFloat(average); // Convert to float for accurate rendering
  };

  // Function to get recommendations based on average ratings
  const getRecommendations = () => {
    const recommendations = {};

    businesses.forEach(business => {
      const category = business.category;
      const averageRating = averageRatings[business._id] || 0;

      if (!recommendations[category] || averageRating > recommendations[category].average) {
        recommendations[category] = {
          business: business,
          average: averageRating,
          reviewCount: reviewCounts[business._id] || 0, // Include review count
        };
      }
    });

    return recommendations;
  };

  // Get recommendations
  const recommendations = getRecommendations();

  return (
    <div>
      <nav className="navbar"> {/* Nav Bar Container */}
        <Link to="/">
          <img src="/seller.gif" alt="score logo" className="logo" />
        </Link>
        {/* Conditional rendering of login or dashboard button */}
        {isLoggedIn ? (
          <button className="navbar-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
        ) : (
          <button className="navbar-button" onClick={() => navigate('/login')}>Login</button>
        )}
      </nav>
      <h1>Top categories</h1>

      <ul>
        {categories.map(category => (
          <li key={category}>
            <Link to={`/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
      
      <BusinessList />
      
      <h2>Recommended Businesses by Category</h2>
      <div className="recommendations">
        {Object.keys(recommendations).map(category => (
          <div key={category} className="recommendation-item">
            <h3>{category}</h3>
            <div className="recommended-business">
              <h2 className="business-name">
                <Link to={`/business/${recommendations[category].business.businessName}`}>
                  {recommendations[category].business.businessName}
                </Link>
              </h2>
              <span className="stars">
                {/* Render the stars for the recommendation */}
                {renderStars(recommendations[category].average)}
              </span>
              <span className="review-count">
                ({recommendations[category].reviewCount} reviews) {/* Display review count */}
              </span>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <img src="/score.gif" alt="score logo" className="footer-logo" />
        <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
      </footer>
    </div>
  );
};

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

export default Home;
