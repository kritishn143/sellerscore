import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './AdminDashboard.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [declineRequestId, setDeclineRequestId] = useState(null);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [currentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${REACT_APP_API_URL}/users/api/admin/business-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching business requests:', error);
        setError('Failed to load business requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    if (action === 'decline' && !feedback) {
      setError('Please provide feedback for declining this request.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${REACT_APP_API_URL}/users/business-request/${requestId}/${action}`, { feedback }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Business request ${action}d successfully!`);
      setRequests(requests.filter(request => request._id !== requestId));
      setFeedback('');
      setDeclineRequestId(null);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setError(`Failed to ${action} request. ${error.response?.data?.error || ''}`);
    }
  };

  const handleDeleteSelected = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the selected requests?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/business-requests`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { ids: selectedRequests },
        });

        setRequests(requests.filter(request => !selectedRequests.includes(request._id)));
        setSelectedRequests([]);
        alert('Selected requests deleted successfully!');
      } catch (error) {
        console.error('Error deleting requests:', error);
        setError(`Failed to delete selected requests. ${error.response?.data?.error || ''}`);
      }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <h1>Admin Dashboard</h1>
      {error && <div className="error">{error}</div>}
      <button onClick={handleDeleteSelected} disabled={selectedRequests.length === 0}>
        Delete Selected
      </button>
      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Select</th>
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
          <td>
            <input
              type="checkbox"
              checked={selectedRequests.includes(request._id)}
              onChange={() => {
                setSelectedRequests(prev =>
                  prev.includes(request._id)
                    ? prev.filter(id => id !== request._id)
                    : [...prev, request._id]
                );
              }}
            />
          </td>
          <td>{request.businessName}</td>
          <td>{request.address}</td>
          <td>{request.website}</td>
          <td>{request.category}</td>
          <td>
            {request.imageUrl && (
              <img 
                src={`${process.env.REACT_APP_API_URL.split('/api')[0]}${request.imageUrl}`} 
                alt={request.businessName} 
                className="business-image" 
              />
            )}
          </td>
          <td>
            {request.status === 'pending' && (
              <div className="action-button">
                <button className="approve-button" onClick={() => handleAction(request._id, 'approve')}>Approve</button>
                <button className="decline-button" onClick={() => setDeclineRequestId(request._id)}>Decline</button>
                {declineRequestId === request._id && (
                  <div className="feedback-form">
                    <label>
                      Please provide feedback for declining this request:
                      <input 
                        type="text" 
                        value={feedback} 
                        onChange={(e) => setFeedback(e.target.value)} 
                        className="feedback-input"
                      />
                    </label>
                    <button className="submit-feedback" onClick={() => handleAction(request._id, 'decline')}>Submit</button>
                    <button className="cancel-feedback" onClick={handleCancel}>Cancel</button>
                  </div>
                )}
              </div>
            )}
            {request.status === 'declined' && <span className="status-declined">Declined</span>}
            {request.status === 'approved' && <span className="status-approved">Approved</span>}
          </td>
          <td>{request.status === 'declined' ? request.feedback : ''}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <footer className="footer">
      <img src="/score.gif" alt="score logo" className="footer-logo" style={{ width: "50px", height: "50px" }} />
      <p>&copy; {currentYear} Sellerscore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
