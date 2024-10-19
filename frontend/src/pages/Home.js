import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BusinessList from '../components/BusinessList';
import './Home.css'; // Import CSS file

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchRatingsAndReviews = async (businesses) => {
    const ratings = {};
    const counts = {};
    for (const business of businesses) {
      try {
        const response = await axios.get('http://localhost:5000/api/users/reviews', {
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
    const average = (totalRating / reviews.length).toFixed(1);
    return parseFloat(average);
  };

  const getRecommendations = () => {
    const recommendations = {};
    businesses.forEach(business => {
      const category = business.category;
      const averageRating = averageRatings[business._id] || 0;

      if (!recommendations[category] || averageRating > recommendations[category].average) {
        recommendations[category] = {
          business: business,
          average: averageRating,
          reviewCount: reviewCounts[business._id] || 0,
        };
      }
    });
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div>
      <nav className="navbar">
        <Link to="/">
          <img src="/seller.gif" alt="score logo" className="logo" />
        </Link>
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
              <span className="rating-display">
                {recommendations[category].average}★ {/* Display average rating followed by a star */}
              </span>
              <span className="review-count">
                ({recommendations[category].reviewCount} reviews)
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

export default Home;
