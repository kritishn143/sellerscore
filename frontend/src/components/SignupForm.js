import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignupForm.css'; 

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password) {
      return 'All fields are required';
    }
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{5,7}$/;
    if (!usernameRegex.test(username)) {
      return 'Username must be 5-7 characters long, and include both letters and numbers';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
    const passwordRegex = /^(?=.*[!@#$%^&*()]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include a special character';
    }
    if (/^(.)\1*$/.test(password)) {
      return 'Password cannot be repeated characters';
    }
    return '';
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setValidationError(validationError);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      alert(response.data.message);
      setError('');
      navigate('/login'); // Redirect to login after successful signup
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {validationError && <p className="error-message">{validationError}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
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
      <button type="submit">Signup</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default SignupForm;