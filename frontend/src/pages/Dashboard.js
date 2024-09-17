import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div>
      {isLoggedIn() && (
        <button onClick={handleLogout}>Logout</button>
      )}
      <h1>User Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Address</th>
            <th>Location</th>
            <th>Website</th>
            <th>Category</th>
            <th>Status</th>
            <th>Feedback</th> {/* Add Feedback column */}
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>{request.businessName}</td>
              <td>{request.address}</td>
              <td>{request.location}</td>
              <td>{request.website}</td>
              <td>{request.category}</td>
              <td>{request.status}</td>
              <td>{request.status === 'declined' ? request.feedback : ''}</td> {/* Conditionally render feedback */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;