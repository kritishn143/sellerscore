// frontend/src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); // Store the user's role
      setError('');
      if (response.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Sellerscore</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit">Login</button> <hr />
      <p>
        Not registered yet? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default LoginForm;