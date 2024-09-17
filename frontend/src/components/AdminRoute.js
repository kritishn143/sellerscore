// frontend/src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  const isAdmin = localStorage.getItem('role') === 'admin';
  return isAdmin ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default AdminRoute;