import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      alert('Login successful');
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
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
