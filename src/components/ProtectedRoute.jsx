import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SuspenseLoader from './ui/SuspenseLoader';

/**
 * ProtectedRoute component that checks if user is authenticated
 * Redirects to login page if not authenticated
 * Stores the intended location to redirect back after login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <SuspenseLoader message="Verifying authentication" />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;

