import { createSlice } from '@reduxjs/toolkit';

// Initial state - now simplified since permissions come from auth state
const initialState = {
  // No longer needed since permissions are in auth state
  // This slice is kept for backward compatibility but will be deprecated
  isLoading: false,
  error: null,
};

// Permission slice - simplified since permissions now come from auth state
const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    // Clear permissions on logout - now just clears error state
    clearPermissions: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    
    // Clear error
    clearPermissionError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { clearPermissions, clearPermissionError } = permissionSlice.actions;

// Selectors - now deprecated, use authSlice selectors instead
// These are kept for backward compatibility but will redirect to auth selectors
export const selectPermissions = (state) => state.auth.user.permissions || [];
export const selectPermissionsLoading = (state) => state.permissions.isLoading;
export const selectPermissionsError = (state) => state.permissions.error;
export const selectLastFetched = (state) => null; // No longer applicable

// Helper selector to get permissions for a specific module
export const selectModulePermissions = (module) => (state) => {
  const permissions = state.auth.user.permissions || [];
  return permissions.find(p => p.module === module) || null;
};

// Helper selector to check if user has specific permission
export const selectHasPermission = (module, action) => (state) => {
  const permissions = state.auth.user.permissions || [];
  const modulePermissions = permissions.find(p => p.module === module);
  if (!modulePermissions) return false;
  
  switch (action) {
    case 'view':
      return modulePermissions.canView;
    case 'create':
      return modulePermissions.canCreate;
    case 'edit':
      return modulePermissions.canEdit;
    case 'delete':
      return modulePermissions.canDelete;
    case 'export':
      return modulePermissions.canExport;
    case 'import':
      return modulePermissions.canImport;
    default:
      return false;
  }
};

export default permissionSlice.reducer;
