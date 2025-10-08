import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SuspenseLoader from './ui/SuspenseLoader';
import { AlertTriangle } from 'lucide-react';

/**
 * AdminRoute component that checks if user is authenticated AND is an admin
 * Redirects to login if not authenticated
 * Shows unauthorized page if authenticated but not admin
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <SuspenseLoader message="Verifying admin access" />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, show unauthorized page
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <p>Current user: <span className="font-medium text-gray-900 dark:text-white">{user?.userName}</span></p>
            <p>Role: <span className="font-medium text-gray-900 dark:text-white">{isAdmin ? 'Admin' : 'User'}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <a
              href="/dashboard"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin, render the protected content
  return children;
};

export default AdminRoute;

