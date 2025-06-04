// PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './authContext';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
