import { createSlice } from '@reduxjs/toolkit';

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
      
      // Store user information
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
    
    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.expiresAt = null;
      state.user = initialState.user;
      state.error = null;
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
  logout,
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

// Selector to get complete auth state
export const selectAuthState = (state) => state.auth;

export default authSlice.reducer;
