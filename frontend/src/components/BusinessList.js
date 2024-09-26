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
          <div key={business._id} style={{ marginBottom: '20px' }}>
         <h2>{business.businessName}</h2>  {/* Display the image if it exists */}
          {business.imageUrl && (
            <img 
              src={`http://localhost:5000${business.imageUrl}`}  // Make sure this is the correct path
              alt={business.businessName} 
              style={{ width: '100px', height: 'auto' }} 
            />
          )}
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
