// frontend/src/components/BusinessList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/approved-businesses');
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching approved businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search businesses..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div>
        {filteredBusinesses.map(business => (
          <div key={business._id}>
            <h2>{business.businessName}</h2>
            <p>{business.address}</p>
            <p>{business.website}</p>
            <p>{business.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessList;