// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BusinessList from '../components/BusinessList';

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Top categories</h1>
      <ul>
        {categories.map(category => (
          <li key={category}>
            <Link to={`/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
      <h2>Approved Businesses</h2>
      <BusinessList />
    </div>
  );
};

export default Home;