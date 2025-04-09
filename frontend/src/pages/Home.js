import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BusinessList from '../components/BusinessList';
const apiUrl = process.env.REACT_APP_API_URL;

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/approved-businesses`);
        setBusinesses(response.data);
        await fetchRatingsAndReviews(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchCategories();
    fetchBusinesses();

    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const fetchRatingsAndReviews = async (businesses) => {
    const ratings = {};
    const counts = {};
    for (const business of businesses) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/reviews`, {
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
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRecommendations = () => {
    const recommendations = {};
    businesses.forEach((business) => {
      const category = business.category;
      const averageRating = averageRatings[business._id] || 0;

      if (!recommendations[category] || averageRating > recommendations[category].average) {
        recommendations[category] = {
          business,
          average: averageRating,
          reviewCount: reviewCounts[business._id] || 0,
        };
      }
    });
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/seller.gif" alt="Score Logo" className="h-10" />
        </Link>
        {isLoggedIn ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Top Categories</h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {categories.map((category) => (
            <li key={category} className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-blue-50">
              <Link to={`/category/${category}`} className="text-blue-600 font-semibold">
                {category}
              </Link>
            </li>
          ))}
        </ul>

        <BusinessList />

        <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Recommended Businesses by Category</h2>
        <div className="space-y-6">
          {Object.keys(recommendations)
            .sort((a, b) => {
              if (recommendations[b].average !== recommendations[a].average) {
                return recommendations[b].average - recommendations[a].average;
              }
              return recommendations[b].reviewCount - recommendations[a].reviewCount;
            })
            .map((category) => (
              <div key={category} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                <div className="mt-2">
                  <h4 className="text-lg font-semibold text-blue-600">
                    <Link to={`/business/${recommendations[category].business.businessName}`}>
                      {recommendations[category].business.businessName}
                    </Link>
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-yellow-500">{recommendations[category].average}★</span>
                    <span className="text-gray-500">({recommendations[category].reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
        <div className="flex items-center justify-center space-x-2">
          <img src="/score.gif" alt="Score Logo" className="h-8" />
          <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
