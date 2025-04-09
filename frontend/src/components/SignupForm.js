import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;


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
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,11}$/;
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, { username, email, password });
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
    <form 
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      
      {validationError && (
        <p className="text-red-500 text-sm mb-4">{validationError}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="mb-4">
        <label 
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label 
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label 
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
      >
        Sign Up
      </button>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link 
          to="/login"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;