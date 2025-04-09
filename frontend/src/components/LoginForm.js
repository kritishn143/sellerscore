// frontend/src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, { email, password });
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
    <form 
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

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
        Login
      </button>

      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <Link 
          to="/signup"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;