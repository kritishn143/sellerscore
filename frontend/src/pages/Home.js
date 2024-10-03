// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BusinessList from '../components/BusinessList';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './Home.css'; // Import CSS file

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
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

    fetchCategories();

    // Simulate checking login status (replace with actual logic)
    const token = localStorage.getItem('token'); // Example for checking login status
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleHome = () => {
    navigate('/'); 
  };

  const handleLogin = () => {
    navigate('/login'); 
  };

  const handleDashboard = () => {
    navigate('/dashboard'); 
  };

  return (
    <div>
      <nav className="navbar"> {/* Nav Bar Container */}
        
      <Link to="/">
          <img src="/seller.gif" alt="score logo" className="logo" />
        </Link>        {/* Conditional rendering of login or dashboard button */}
        {isLoggedIn ? (
          <button className="navbar-button" onClick={handleDashboard}>Dashboard</button>
        ) : (
          <button className="navbar-button" onClick={handleLogin}>Login</button>
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
         <footer className="footer">
        <img src="/score.gif" alt="score logo" className="footer-logo" />
        <p>&copy; 2023 Sellerscore. All rights reserved.</p>
      </footer>
    </div>
  );
};


export default Home;
