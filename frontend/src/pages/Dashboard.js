import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Dashboard() {
    const navigate = useNavigate();

    // Function to check if user is logged in
    const isLoggedIn = () => {
        return localStorage.getItem('token'); // Assuming 'token' is stored in local storage upon login
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            {isLoggedIn() && (
                <button onClick={handleLogout}>Logout</button> // Render logout button if user is logged in
            )}
            {/* Additional content */}
        </div>
    );
}

export default Dashboard;