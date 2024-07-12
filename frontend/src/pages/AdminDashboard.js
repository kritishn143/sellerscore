import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [requests, setRequests] = useState([]);

    // Fetch requests from backend on component mount
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/requests', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRequests(response.data); // Assuming response.data contains the requests
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    // Function to handle approval or decline
    const handleAction = async (userId, action) => {
        const feedback = prompt('Enter your feedback:');
        if (!feedback) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/users/handle-request', {
                userId,
                requestStatus: action,
                feedback
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert(`Request ${action}ed successfully`);
            setRequests(requests.filter(request => request._id !== userId));
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
            alert(`Failed to ${action} request`);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {requests.length === 0 ? (
                <p>No requests available</p>
            ) : (
                <ul>
                    {requests.map(request => (
                        <li key={request._id}>
                            <p>Business Name: {request.businessName}</p>
                            <p>Location: {request.location}</p>
                            <p>Categories: {request.categories.join(', ')}</p> {/* Join array elements into a string */}
                            <p>Website/Social Links: {request.websiteOrSocialLinks}</p>
                            <button onClick={() => handleAction(request._id, 'approve')}>Approve</button>
                            <button onClick={() => handleAction(request._id, 'decline')}>Decline</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminDashboard;
