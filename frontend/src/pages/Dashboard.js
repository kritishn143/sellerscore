import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/business-requests', {
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

  const handleHome = () => {
    navigate('/'); 
  };

  return (
    <div>
            <button onClick={handleHome}>Home</button> {/* Home Button */}

      {isLoggedIn() && (
        
        <button onClick={handleLogout}>Logout</button>
      )}
      <button onClick={handleBusinessRequest}>Business Request</button>
      {role === 'admin' && (
        <button onClick={handleAdminDashboard}>Admin Dashboard</button>
        
      )}      <h1>User Dashboard</h1>

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
                    src={`http://localhost:5000${request.imageUrl}`} 
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
    </div>
  );
};

export default Dashboard;
