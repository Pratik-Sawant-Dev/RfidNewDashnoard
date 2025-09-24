import { createSlice } from '@reduxjs/toolkit';


// Initial state for API configuration
const initialState = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7107',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  isOnline: true,
};

// Create the API slice
const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    // Action to update the base URL
    setBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
    },
    
    // Action to update timeout
    setTimeout: (state, action) => {
      state.timeout = action.payload;
    },
    
    // Action to update retry attempts
    setRetryAttempts: (state, action) => {
      state.retryAttempts = action.payload;
    },
    
    // Action to set online/offline status
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    // Action to reset all API configuration to defaults
    resetApiConfig: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  setBaseUrl,
  setTimeout,
  setRetryAttempts,
  setOnlineStatus,
  resetApiConfig,
} = apiSlice.actions;

// Selectors for easy access to API configuration
export const selectBaseUrl = (state) => state.api.baseUrl;
export const selectTimeout = (state) => state.api.timeout;
export const selectRetryAttempts = (state) => state.api.retryAttempts;
export const selectIsOnline = (state) => state.api.isOnline;

// Selector to get API configuration object
export const selectApiConfig = (state) => ({
  baseUrl: state.api.baseUrl,
  timeout: state.api.timeout,
  retryAttempts: state.api.retryAttempts,
  isOnline: state.api.isOnline,
});

export default apiSlice.reducer;