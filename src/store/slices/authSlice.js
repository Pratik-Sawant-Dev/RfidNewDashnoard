import { createSlice } from '@reduxjs/toolkit';
import { isAdminFromToken, isTokenExpired, getTokenClaims } from '../../utils/jwtUtils';

// Initial state for authentication
const initialState = {
  // Authentication status
  isAuthenticated: false,
  isLoading: false,
  
  // Token information
  token: null,
  expiresAt: null,
  
  // User information
  user: {
    userId: null,
    userName: null,
    email: null,
    fullName: null,
    mobileNumber: null,
    faxNumber: null,
    city: null,
    address: null,
    organisationName: null,
    showroomType: null,
    clientCode: null,
    databaseName: null,
    connectionString: null,
    isAdmin: false,
    userType: null,
    adminUserId: null,
    isActive: false,
    createdOn: null,
    lastLoginDate: null,
    branchId: null,
    branchName: null,
    counterId: null,
    counterName: null,
    permissions: [],
  },
  
  // Error handling
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action) => {
      const { token, user, expiresAt } = action.payload;
      
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = null;
      
      // Store token information
      state.token = token;
      state.expiresAt = expiresAt;
      
      // Store user information including permissions
      state.user = {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        faxNumber: user.faxNumber,
        city: user.city,
        address: user.address,
        organisationName: user.organisationName,
        showroomType: user.showroomType,
        clientCode: user.clientCode,
        databaseName: user.databaseName,
        connectionString: user.connectionString,
        isAdmin: user.isAdmin,
        userType: user.userType,
        adminUserId: user.adminUserId,
        isActive: user.isActive,
        createdOn: user.createdOn,
        lastLoginDate: user.lastLoginDate,
        branchId: user.branchId,
        branchName: user.branchName,
        counterId: user.counterId,
        counterName: user.counterName,
        permissions: user.permissions || [],
      };
    },
    
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.token = null;
      state.expiresAt = null;
      state.user = initialState.user;
    },
    
    // Logout actions
    logoutStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.expiresAt = null;
      state.user = initialState.user;
      state.error = null;
      state.isLoading = false;
    },
    
    logoutFailure: (state, action) => {
      // Even if API call fails, we still clear local state
      state.isAuthenticated = false;
      state.token = null;
      state.expiresAt = null;
      state.user = initialState.user;
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error action
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user information
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    // Check token validity
    checkTokenValidity: (state) => {
      if (state.expiresAt) {
        const now = new Date();
        const expiryDate = new Date(state.expiresAt);
        
        if (now >= expiryDate) {
          // Token expired, logout user
          state.isAuthenticated = false;
          state.token = null;
          state.expiresAt = null;
          state.user = initialState.user;
        }
      }
    },
    
    // Initialize auth from localStorage
    initializeAuth: (state, action) => {
      const { token, user, expiresAt } = action.payload;
      
      if (token && user && expiresAt) {
        // Check if token is still valid
        const now = new Date();
        const expiryDate = new Date(expiresAt);
        
        if (now < expiryDate) {
          state.isAuthenticated = true;
          state.token = token;
          state.expiresAt = expiresAt;
          state.user = user;
        } else {
          // Token expired, clear localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('tokenExpiry');
        }
      }
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  clearError,
  updateUser,
  checkTokenValidity,
  initializeAuth,
} = authSlice.actions;

// Selectors for easy access to auth state
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectUserInfo = (state) => ({
  userId: state.auth.user.userId,
  userName: state.auth.user.userName,
  email: state.auth.user.email,
  fullName: state.auth.user.fullName,
  organisationName: state.auth.user.organisationName,
  clientCode: state.auth.user.clientCode,
  isAdmin: state.auth.user.isAdmin,
  userType: state.auth.user.userType,
});
export const selectAuthError = (state) => state.auth.error;
export const selectExpiresAt = (state) => state.auth.expiresAt;

// Token-based selectors
export const selectIsAdminFromToken = (state) => {
  const token = state.auth.token;
  if (!token) return false;
  return isAdminFromToken(token);
};

export const selectTokenClaims = (state) => {
  const token = state.auth.token;
  if (!token) return null;
  return getTokenClaims(token);
};

export const selectIsTokenValid = (state) => {
  const token = state.auth.token;
  if (!token) return false;
  return !isTokenExpired(token);
};

// Selector to get complete auth state
export const selectAuthState = (state) => state.auth;

// Permission-related selectors
export const selectUserPermissions = (state) => state.auth.user.permissions || [];

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

// Helper selector to check if user has any permission for a module
export const selectHasModuleAccess = (module) => (state) => {
  const permissions = state.auth.user.permissions || [];
  return permissions.some(p => p.module === module);
};

export default authSlice.reducer;
