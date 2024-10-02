import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './AdminDashboard.css'; // Import the CSS file


const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [declineRequestId, setDeclineRequestId] = useState(null);
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
    if (action === 'decline' && !feedback) {
      alert('Please provide feedback for declining this request.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/business-request/${requestId}/${action}`, { feedback }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Business request ${action}d successfully!`);
      setRequests(requests.filter(request => request._id !== requestId)); // Update state after approval/decline
      setFeedback('');
      setDeclineRequestId(null);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request.`);
    }
  };

  const handleCancel = () => {
    setFeedback('');
    setDeclineRequestId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/'); 
  };

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
     <NavBar />

      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Address</th>
            <th>Website</th>
            <th>Category</th>
            <th>Image</th>
            <th>Action</th>
            <th>Feedbacks</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>{request.businessName}</td>
              <td>{request.address}</td>
              <td>{request.website}</td>
              <td>{request.category}</td>
              <td>
                {request.imageUrl && (
                  <img 
                    src={`http://localhost:5000${request.imageUrl}`} 
                    alt={request.businessName} 
                    style={{ width: '100px', height: 'auto' }} 
                  />
                )}
              </td>
              <td>
                {request.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(request._id, 'approve')}>Approve</button>
                    <button onClick={() => setDeclineRequestId(request._id)}>Decline</button>
                    {declineRequestId === request._id && (
                      <div>
                        <label>
                          Please provide feedback for declining this request:
                          <input 
                            type="text" 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)} 
                          />
                        </label>
                        <button onClick={() => handleAction(request._id, 'decline')}>Submit</button>
                        <button onClick={handleCancel}>Cancel</button>
                      </div>
                    )}
                  </>
                )}
                {request.status === 'declined' && <span>Declined</span>}
                {request.status === 'approved' && <span>Approved</span>}
              </td>
              <td>{request.status === 'declined' ? request.feedback : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;