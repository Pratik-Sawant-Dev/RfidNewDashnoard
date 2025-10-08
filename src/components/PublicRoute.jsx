import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SuspenseLoader from './ui/SuspenseLoader';

/**
 * PublicRoute component for routes like login, register
 * Redirects to dashboard if already authenticated
 */
const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <SuspenseLoader message="Loading" />;
  }

  // If restricted (like login/register) and user is authenticated, redirect to dashboard
  if (restricted && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the public content
  return children;
};

export default PublicRoute;

