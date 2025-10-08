/**
 * API Configuration
 * Centralized configuration for API settings
 */

// Default API configuration
export const defaultApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7107',
  timeout: 30000,
  retryAttempts: 3,
  isOnline: true,
};

// Get API configuration from environment or defaults
export const getApiConfig = () => {
  return {
    baseUrl: import.meta.env.VITE_API_BASE_URL || defaultApiConfig.baseUrl,
    timeout: 30000,
    retryAttempts: 3,
    isOnline: true,
  };
};

// Get auth token from localStorage (fallback when store is not available)
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get base URL from environment
export const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || defaultApiConfig.baseUrl;
};
