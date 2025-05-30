import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Private route component to protect routes based on authentication and roles
function PrivateRoute({ allowedRoles }) {
  const { user, isLoading } = useSelector((state) => state.auth);

  // If still loading auth state, you might want to render a spinner or null
  if (isLoading) {
      return null; // Or a loading spinner component
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Check if user has the required role(s)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
        // User is authenticated but does not have the required role
        // You might want to navigate to an unauthorized page or home
        return <Navigate to='/' replace />; // Redirect to home or unauthorized
    }
  }

  // User is authenticated and has the correct role(s), render the nested routes/component
  return <Outlet />;
}

export default PrivateRoute; 