import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  return (
    <Route
      {...rest}
      render={props =>
        isAdmin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default AdminRoute;
