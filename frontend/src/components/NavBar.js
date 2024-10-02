// frontend/src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <button className="navbar-button" onClick={handleHome}>Sellerscore</button>
      <button className="navbar-button" onClick={handleDashboardNavigation}>Dashboard</button>
    </nav>
  );
};

export default Navbar;
