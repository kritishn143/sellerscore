// frontend/src/pages/BusinessDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BusinessDetails = () => {
  const { name } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/business/name/${name}`);
        setBusiness(response.data);
      } catch (error) {
        console.error('Error fetching business details:', error);
      }
    };

    fetchBusiness();
  }, [name]);

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{business.businessName}</h1>
    
      {business.imageUrl && (
        <img 
          src={`http://localhost:5000${business.imageUrl}`} 
          alt={business.businessName} 
          style={{ width: '200px', height: 'auto' }} 
        />
      )}
       <p>{business.address}</p>
      <p>{business.website}</p>
      <p>{business.category}</p>
    </div>
  );
};

export default BusinessDetails;