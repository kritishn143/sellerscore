// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [currentYear] = useState(new Date().getFullYear());
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/business-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching business requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const isLoggedIn = () => {
    return localStorage.getItem('token');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBusinessRequest = () => {
    navigate('/business-request');
  };

  const handleAdminDashboard = () => {
    navigate('/admin-dashboard');
  };

  const handleUserProfile = () => {
    navigate('/useraccount'); // Navigate to User Profile page
  };

  return (
    <div>
      <nav className="navbar"> {/* Navigation Bar */}
        <Link to="/">
          <img src="/seller.gif" alt="score logo" className="logo" />
        </Link>
        {isLoggedIn() && (
          <>
            <button className="navbar-button" onClick={handleBusinessRequest}>Business Request</button>
            <button className="navbar-button" onClick={handleUserProfile}>Profile</button> {/* User Profile link */}
            <button className="navbar-button" onClick={handleLogout}>Logout</button>
            {role === 'admin' && (
              <button className="navbar-button" onClick={handleAdminDashboard}>Admin Dashboard</button>
            )}
          </>
        )}
      </nav>
      <h1>User Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Image</th>
            <th>Address</th>
            <th>Website</th>
            <th>Category</th>
            <th>Status</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>{request.businessName}</td>
              <td>
                {request.imageUrl && (
                  <img 
                  src={`${REACT_APP_API_URL.split('/api')[0]}${request.imageUrl}`} 
                    alt={request.businessName} 
                    style={{ width: '100px', height: 'auto' }} 
                  />
                )}
              </td>
              <td>{request.address}</td>
              <td>{request.website}</td>
              <td>{request.category}</td>
              <td>{request.status}</td>
              <td>{request.status === 'declined' ? request.feedback : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="footer">
             <img src="/score.gif" alt="score logo" className="footer-logo" style={{ width: "50px", height: "50px" }} />

        <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
