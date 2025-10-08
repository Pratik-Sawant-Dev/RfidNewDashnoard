/**
 * App Initialization Utility
 * Handles initialization of services and dependencies
 */

import apiService from '../services/apiService';
import store from '../store';

/**
 * Initialize the application
 * Call this before rendering the app to ensure all services are properly set up
 */
export const initializeApp = () => {
  try {
    // Set store reference in API service
    apiService.setStore(store);
    
    console.log('App initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return false;
  }
};

/**
 * Check if app is properly initialized
 */
export const isAppInitialized = () => {
  try {
    // Try to get store from API service
    const store = apiService.getStore ? apiService.getStore() : null;
    return store !== null;
  } catch (error) {
    return false;
  }
};

export default initializeApp;
