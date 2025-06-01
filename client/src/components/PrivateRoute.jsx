import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

// Private route component to protect routes based on authentication and roles
function PrivateRoute({ allowedRoles }) {
  const dispatch = useDispatch();
  const { user, accessToken, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if token exists
    if (!accessToken) {
      // Clear any remaining auth data
      dispatch(logout());
      toast.error('Session expired. Please login again.');
      return;
    }

    // Check if token is expired
    try {
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        // Token is expired
        dispatch(logout());
        toast.error('Session expired. Please login again.');
      }
    } catch (error) {
      // If token is invalid, clear auth data
      dispatch(logout());
      toast.error('Invalid session. Please login again.');
    }
  }, [accessToken, dispatch]);

  // If still loading auth state, you might want to render a spinner or null
  if (isLoading) {
    return null; // Or a loading spinner component
  }

  // Check if user is authenticated
  if (!user || !accessToken) {
    return <Navigate to='/' replace />;
  }

  // Check if user has the required role(s)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // User is authenticated but does not have the required role
      return <Navigate to='/' replace />;
    }
  }

  // User is authenticated and has the correct role(s), render the nested routes/component
  return <Outlet />;
}

export default PrivateRoute; 