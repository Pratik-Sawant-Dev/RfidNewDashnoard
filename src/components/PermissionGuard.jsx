import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import usePermissions from '../hooks/usePermissions';

/**
 * Simple permission guard component
 * Shows children only if user has required permission
 * Shows access denied message if no permission
 */
const PermissionGuard = ({ 
  module, 
  action, 
  children, 
  fallback = null,
  showAccessDenied = true 
}) => {
  const { hasPermission } = usePermissions();

  // Check if user has permission
  const hasAccess = hasPermission(module, action);

  // If user has permission, show children
  if (hasAccess) {
    return children;
  }

  // If fallback is provided, show it
  if (fallback) {
    return fallback;
  }

  // If showAccessDenied is false, show nothing
  if (!showAccessDenied) {
    return null;
  }

  // Show access denied message
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to {action} {module.toLowerCase()} data.
        </p>
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
};

export default PermissionGuard;
