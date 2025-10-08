import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserPermissions } from '../store/slices/authSlice';

/**
 * Permission Loader - Simplified version
 * No longer needed since permissions come with login response
 * This component is kept for backward compatibility but does nothing
 */
const PermissionLoader = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const permissions = useSelector(selectUserPermissions);
  
  // Log permission status for debugging
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('User permissions loaded:', permissions.length > 0 ? 'Yes' : 'No');
      console.log('Available permissions:', permissions);
    }
  }, [isAuthenticated, permissions]);

  // This component doesn't render anything
  return null;
};

export default PermissionLoader;
