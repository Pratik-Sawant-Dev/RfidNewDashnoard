import { useSelector, useDispatch } from 'react-redux';
import { 
  selectUserPermissions,
  selectModulePermissions,
  selectHasPermission,
  selectHasModuleAccess
} from '../store/slices/authSlice';
import { clearPermissions } from '../store/slices/permissionSlice';

/**
 * Simplified hook for checking user permissions
 * Now works directly with permissions from auth state
 */
export const usePermissions = () => {
  const dispatch = useDispatch();
  
  // Selectors - now using auth state
  const permissions = useSelector(selectUserPermissions);
  const isLoading = false; // No longer loading since permissions come with login
  const error = null; // No longer has errors since permissions come with login

  // Actions
  const clearUserPermissions = () => {
    dispatch(clearPermissions());
  };

  // Helper functions using Redux selectors
  const hasPermission = (module, action) => {
    return useSelector(selectHasPermission(module, action));
  };

  const getModulePermissions = (module) => {
    return useSelector(selectModulePermissions(module));
  };

  const hasModuleAccess = (module) => {
    return useSelector(selectHasModuleAccess(module));
  };

  // Convenience methods
  const canView = (module) => hasPermission(module, 'view');
  const canCreate = (module) => hasPermission(module, 'create');
  const canEdit = (module) => hasPermission(module, 'edit');
  const canDelete = (module) => hasPermission(module, 'delete');
  const canExport = (module) => hasPermission(module, 'export');
  const canImport = (module) => hasPermission(module, 'import');

  return {
    // State
    permissions,
    isLoading,
    error,
    
    // Actions
    clearPermissions: clearUserPermissions,
    
    // Helper functions
    hasPermission,
    getModulePermissions,
    hasModuleAccess,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canImport,
  };
};

export default usePermissions;
