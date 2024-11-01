// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have AuthContext set up

const PrivateRoute = ({ element }) => {
  const { user } = useAuth(); // Get the user from context

  return user ? element : <Navigate to="/login" />; // If user is authenticated, render the element, otherwise redirect to login
};

export default PrivateRoute;
