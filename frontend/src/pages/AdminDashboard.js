import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/api/admin/business-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching business requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const feedback = action === 'decline' ? prompt('Please provide feedback for declining this request:') : '';

      await axios.put(`http://localhost:5000/api/users/business-request/${requestId}/${action}`, { feedback }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Business request ${action}d successfully!`);
      setRequests(requests.filter(request => request._id !== requestId)); // Update state after approval/decline
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Address</th>
            <th>Website</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>{request.businessName}</td>
              <td>{request.address}</td>
              <td>{request.website}</td>
              <td>{request.category}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(request._id, 'approve')}>Approve</button>
                    <button onClick={() => handleAction(request._id, 'decline')}>Decline</button>
                  </>
                )}
                {request.status === 'declined' && <span>Declined</span>}
                {request.status === 'approved' && <span>Approved</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;