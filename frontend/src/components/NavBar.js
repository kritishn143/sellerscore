// frontend/src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file
import { Link } from 'react-router-dom';

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
   <Link to="/">
      <img src="/seller.gif" alt="score logo" className="logo" />
   </Link>
   <button className="navbar-button" onClick={handleDashboardNavigation}>Dashboard</button>
</nav>

  );
};

export default Navbar;
